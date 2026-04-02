import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient = null;
let pineconeIndex = null;

const INDEX_NAME = process.env.PINECONE_INDEX || "shree-vectordb";
const EMBEDDING_DIMENSION = 1024; // mistral-embed output dimension
const MIN_SCORE = 0.0; // TEMPORARILY DISABLED for debugging (was 0.72)
const TOP_K = 10; // Increased number of chunks to retrieve
const PINECONE_REGION = process.env.PINECONE_REGION || "us-east-1";
const PINECONE_ENVIRONMENT =
  process.env.PINECONE_ENVIRONMENT || process.env.PINECONE_REGION;
const PINECONE_CONTROLLER_HOST = process.env.PINECONE_CONTROLLER_HOST;

function getPineconeClient() {
  if (!pineconeClient) {
    const config = {
      apiKey: process.env.PINECONE_API_KEY,
    };

    if (PINECONE_ENVIRONMENT) {
      config.environment = PINECONE_ENVIRONMENT;
    }
    if (PINECONE_CONTROLLER_HOST) {
      config.controllerHostUrl = PINECONE_CONTROLLER_HOST;
    }

    pineconeClient = new Pinecone(config);
  }
  return pineconeClient;
}

/**
 * Ensures the Pinecone index exists; creates it if not.
 * Call once on server startup.
 */
export async function initializePinecone() {
  try {
    const client = getPineconeClient();
    const existingIndexes = await client.listIndexes();
    const indexNames = existingIndexes.indexes?.map((i) => i.name) || [];

    if (!indexNames.includes(INDEX_NAME)) {
      console.log(`Creating Pinecone index: ${INDEX_NAME}`);
      await client.createIndex({
        name: INDEX_NAME,
        dimension: EMBEDDING_DIMENSION,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: PINECONE_REGION,
          },
        },
      });
      console.log(`Pinecone index "${INDEX_NAME}" created.`);
    } else {
      console.log(`Pinecone index "${INDEX_NAME}" already exists.`);
    }
  } catch (err) {
    console.error("Pinecone init failed:", err.message);
    // Non-fatal — app continues running
  }
}

function getIndex(namespace) {
  const client = getPineconeClient();
  return client.index(INDEX_NAME).namespace(namespace);
}

/**
 * Upserts all chunk vectors for a file into Pinecone.
 * @param {Array<{ text, metadata, vector }>} chunks
 * @param {string} namespace  — "user-{userId}"
 * @param {string} fileId
 */
export async function upsertChunks(chunks, namespace, fileId) {
  const ns = getIndex(namespace);

  console.log(`\n[Pinecone Upsert] Namespace: ${namespace}, fileId: ${fileId}`);
  console.log(`[Pinecone Upsert] Total chunks to insert: ${chunks.length}`);

  const vectors = chunks.map((chunk, i) => ({
    id: `${fileId}-chunk-${i}`,
    values: chunk.vector,
    metadata: {
      ...chunk.metadata,
      text: chunk.text,
    },
  }));

  // Upsert in batches of 100 (Pinecone limit)
  const BATCH = 100;
  for (let i = 0; i < vectors.length; i += BATCH) {
    const batch = vectors.slice(i, i + BATCH);
    if (batch.length === 0) continue;
    const result = await ns.upsert({ records: batch });
    console.log(`[Pinecone Upsert] Batch ${i / BATCH + 1} upserted. Response:`, JSON.stringify(result));
  }

  // Verify upsert by querying for the first chunk
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for eventual consistency
  try {
    const verifyResult = await ns.query({
      vector: vectors[0].values,
      topK: 1,
      filter: { fileId: { $eq: fileId } },
      includeMetadata: true,
    });
    console.log(`[Pinecone Upsert] Verification query returned ${verifyResult.matches?.length || 0} matches`);
    if (verifyResult.matches?.length === 0) {
      console.warn(`[Pinecone Upsert] ⚠️ Verification failed - vectors may not be stored. Checking without filter...`);
      const verifyNoFilter = await ns.query({
        vector: vectors[0].values,
        topK: 1,
        includeMetadata: true,
      });
      console.log(`[Pinecone Upsert] No-filter query returned ${verifyNoFilter.matches?.length || 0} matches`);
      if (verifyNoFilter.matches?.length > 0) {
        console.log(`[Pinecone Upsert] Vectors exist but filter mismatch. Stored metadata:`, JSON.stringify(verifyNoFilter.matches[0].metadata));
      }
    }
  } catch (err) {
    console.error(`[Pinecone Upsert] Verification failed:`, err.message);
  }
}

/**
 * Queries Pinecone for the most relevant chunks for a user's query.
 * Filters strictly by fileId + userId to prevent cross-user data leaks.
 * @param {number[]} queryVector
 * @param {string} fileId
 * @param {string} userId
 * @param {string} namespace
 * @returns {Array<{ text, score, metadata }>}
 */
export async function queryChunks(queryVector, fileId, userId, namespace) {
  const ns = getIndex(namespace);

  console.log(`\n[Pinecone Retrieval] Namespace: ${namespace}`);
  console.log(`[Pinecone Retrieval] Filters used: fileId=${fileId}, userId=${userId.toString()}`);
  console.log(`[Pinecone Retrieval] Executing vector query with topK=${TOP_K}...`);

  const result = await ns.query({
    vector: queryVector,
    topK: TOP_K,
    includeMetadata: true,
    filter: {
      fileId: { $eq: fileId },
      userId: { $eq: userId.toString() },
    },
  });

  const allMatches = result.matches || [];

  if (allMatches.length === 0) {
    console.log(`[Pinecone Retrieval] ⚠️ ZERO matches returned from Pinecone before filtering.`);
    console.log(`[Pinecone Retrieval] Possible reasons:`);
    console.log(`  1. No vectors exist in namespace "${namespace}"`);
    console.log(`  2. Filter mismatch (e.g. metadata fileId or userId were different during upsert)`);
  } else {
    console.log(`[Pinecone Retrieval] ✅ Found ${allMatches.length} raw matches before score filtering.`);
    allMatches.forEach((m, idx) => {
      console.log(`  -> Match ${idx + 1}: score=${m.score.toFixed(4)}, chunkIndex=${m.metadata?.chunkIndex}`);
      console.log(`     text preview: ${m.metadata?.text?.substring(0, 60).replace(/\\n/g, " ")}...`);
    });
  }

  const filteredMatches = allMatches.filter((match) => match.score >= MIN_SCORE);

  if (allMatches.length > 0 && filteredMatches.length === 0) {
    console.log(`[Pinecone Retrieval] ⚠️ ALL matches filtered out due to strict MIN_SCORE threshold (${MIN_SCORE}).`);
    console.log(`  -> Highest score was: ${Math.max(...allMatches.map(m => m.score)).toFixed(4)}`);
  } else {
    console.log(`[Pinecone Retrieval] ✅ Returning ${filteredMatches.length} matches after filtering (MIN_SCORE=${MIN_SCORE}).`);
  }

  return filteredMatches.map((match) => ({
    text: match.metadata?.text || "",
    score: match.score,
    metadata: match.metadata,
  }));
}

/**
 * Deletes all vectors for a specific file from Pinecone.
 * @param {string} fileId
 * @param {string} namespace
 */
export async function deleteFileVectors(fileId, namespace) {
  try {
    const ns = getIndex(namespace);
    await ns.deleteMany({ fileId: { $eq: fileId } });
    console.log(`Deleted Pinecone vectors for fileId: ${fileId}`);
  } catch (err) {
    console.error(
      `Failed to delete Pinecone vectors for ${fileId}:`,
      err.message,
    );
    // Non-fatal — log and continue
  }
}
