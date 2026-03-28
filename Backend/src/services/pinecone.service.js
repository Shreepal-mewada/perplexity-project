import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient = null;
let pineconeIndex = null;

const INDEX_NAME = process.env.PINECONE_INDEX || "shree-vectordb";
const EMBEDDING_DIMENSION = 1024; // mistral-embed output dimension
const MIN_SCORE = 0.72; // minimum cosine similarity threshold
const TOP_K = 5; // number of chunks to retrieve
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

  const vectors = chunks.map((chunk, i) => ({
    id: `${fileId}-chunk-${i}`,
    values: chunk.vector,
    metadata: {
      ...chunk.metadata,
      text: chunk.text, // store text for retrieval
    },
  }));

  // Upsert in batches of 100 (Pinecone limit)
  const BATCH = 100;
  for (let i = 0; i < vectors.length; i += BATCH) {
    const batch = vectors.slice(i, i + BATCH);
    if (batch.length === 0) continue;
    await ns.upsert({ records: batch });
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

  const result = await ns.query({
    vector: queryVector,
    topK: TOP_K,
    includeMetadata: true,
    filter: {
      fileId: { $eq: fileId },
      userId: { $eq: userId.toString() },
    },
  });

  return (result.matches || [])
    .filter((match) => match.score >= MIN_SCORE)
    .map((match) => ({
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
