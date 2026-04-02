// import { isQueryFileRelated } from "./classifier.service.js";
// import { embedQuery } from "./embedding.service.js";
// import { queryChunks } from "./pinecone.service.js";
// import fileUploadModel from "../models/fileUpload.model.js";

// /**
//  * Main RAG pipeline. Called from chat controller when a fileId is present.
//  *
//  * Returns:
//  *  - { type: 'rag', context: string, fileName: string }  — if file-related → caller builds grounded prompt
//  *  - { type: 'general' }                                 — if unrelated → caller uses normal LLM
//  *  - { type: 'not_found', fileName: string }             — if file-related but no chunks found
//  *
//  * @param {string} userQuery
//  * @param {string} fileId
//  * @param {string} userId
//  */
// export async function handleRagQuery(userQuery, fileId, userId) {
//   const fileDoc = await fileUploadModel.findOne({ fileId, userId });

//   console.log(`\n[RAG Request] User query: "${userQuery}", active fileId: ${fileId}`);

//   if (!fileDoc || fileDoc.status !== "ready") {
//     console.log(`[RAG Request] File is missing or not ready (status=${fileDoc?.status}). Falling back to general chat.`);
//     return { type: "general" };
//   }

//   const isFileRelated = await isQueryFileRelated(userQuery, fileDoc.fileName);

//   if (!isFileRelated) {
//     console.log(`[RAG Request] Query intent classified as NOT file-related. Routing to general chat.`);
//     return { type: "general" };
//   }
  
//   console.log(`[RAG Request] Query intent classified as YES file-related. Proceeding with RAG.`);

//   // 3. Embed query
//   let queryVector;
//   try {
//     queryVector = await embedQuery(userQuery);
//   } catch (err) {
//     console.error("RAG embed query failed:", err.message);
//     return { type: "general" }; // safe fallback
//   }

//   const chunks = await queryChunks(
//     queryVector,
//     fileId,
//     userId,
//     fileDoc.namespace
//   );

//   if (!chunks || chunks.length === 0) {
//     console.log(`[RAG Request] ❌ queryChunks returned 0 chunks. Trying fallback without userId filter...`);
    
//     // Fallback 1: try querying without userId filter (in case of metadata mismatch)
//     const fallbackChunks = await queryChunksFallback(
//       queryVector,
//       fileId,
//       fileDoc.namespace
//     );
    
//     if (fallbackChunks && fallbackChunks.length > 0) {
//       console.log(`[RAG Request] ✅ Fallback retrieved ${fallbackChunks.length} chunks from Pinecone!`);
//       const context = fallbackChunks
//         .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
//         .join("\n\n");
//       console.log(`[RAG Request] Context string length: ${context.length} characters.`);
//       return { type: "rag", context, fileName: fileDoc.fileName };
//     }
    
//     // Fallback 2: Use full text from MongoDB
//     if (fileDoc.fullText && fileDoc.fullText.length > 0) {
//       console.log(`[RAG Request] ⚠️ Pinecone empty, using MongoDB fullText fallback (${fileDoc.fullText.length} chars)`);
//       // Truncate if too large (keep first 15000 chars to avoid token limits)
//       const truncatedText = fileDoc.fullText.length > 15000 
//         ? fileDoc.fullText.substring(0, 15000) + "\n\n[... document truncated ...]"
//         : fileDoc.fullText;
      
//       const context = `[Full Document Content]:\n${truncatedText}`;
//       return { type: "rag", context, fileName: fileDoc.fileName };
//     }
    
//     console.log(`[RAG Request] ❌ All fallbacks failed. Returning not_found.`);
//     return { type: "not_found", fileName: fileDoc.fileName };
//   }

//   console.log(`[RAG Request] ✅ Received ${chunks.length} chunks from Pinecone. Constructing LLM context...`);

//   // 5. Build grounded context string from top chunks
//   const context = chunks
//     .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
//     .join("\n\n");
    
//   console.log(`[RAG Request] Context string length being sent to Gemini: ${context.length} characters.`);

//   return { type: "rag", context, fileName: fileDoc.fileName };
// }

// /**
//  * Fallback query that only filters by fileId (no userId filter).
//  * Used when the primary query returns 0 results due to metadata mismatch.
//  */
// async function queryChunksFallback(queryVector, fileId, namespace) {
//   const { Pinecone } = await import("@pinecone-database/pinecone");
  
//   const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
//   const INDEX_NAME = process.env.PINECONE_INDEX || "shree-vectordb";
//   const ns = client.index(INDEX_NAME).namespace(namespace);
  
//   const result = await ns.query({
//     vector: queryVector,
//     topK: 10,
//     includeMetadata: true,
//     filter: {
//       fileId: { $eq: fileId },
//     },
//   });
  
//   const matches = result.matches || [];
  
//   return matches.map((match) => ({
//     text: match.metadata?.text || "",
//     score: match.score,
//     metadata: match.metadata,
//   }));
// }

//   const isFileRelated = await isQueryFileRelated(userQuery, fileDoc.fileName);

//   if (!isFileRelated) {
//     console.log(`[RAG Request] Query intent classified as NOT file-related. Routing to general chat.`);
//     return { type: "general" };
//   }
  
//   console.log(`[RAG Request] Query intent classified as YES file-related. Proceeding with RAG.`);

//   // 3. Embed query
//   let queryVector;
//   try {
//     queryVector = await embedQuery(userQuery);
//   } catch (err) {
//     console.error("RAG embed query failed:", err.message);
//     return { type: "general" }; // safe fallback
//   }

//   const chunks = await queryChunks(
//     queryVector,
//     fileId,
//     userId,
//     fileDoc.namespace
//   );

//   if (!chunks || chunks.length === 0) {
//     console.log(`[RAG Request] ❌ queryChunks returned 0 chunks. Unable to ground prompt! Initializing fallback.`);
//     return { type: "not_found", fileName: fileDoc.fileName };
//   }

//   console.log(`[RAG Request] ✅ Received ${chunks.length} chunks from Pinecone. Constructing LLM context...`);

//   // 5. Build grounded context string from top chunks
//   const context = chunks
//     .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
//     .join("\n\n");
    
//   console.log(`[RAG Request] Context string length being sent to Gemini: ${context.length} characters.`);

//   return { type: "rag", context, fileName: fileDoc.fileName };




import { isQueryFileRelated } from "./classifier.service.js";
import { embedQuery } from "./embedding.service.js";
import { queryChunks } from "./pinecone.service.js";
import fileUploadModel from "../models/fileUpload.model.js";

/**
 * Main RAG pipeline. Called from chat controller when a fileId is present.
 *
 * Returns:
 *  - { type: "rag", context: string, fileName: string }  — if file-related → caller builds grounded prompt
 *  - { type: "general" }                                 — if unrelated → caller uses normal LLM
 *  - { type: "not_found", fileName: string }             — if file-related but no chunks found
 *
 * @param {string} userQuery
 * @param {string} fileId
 * @param {string} userId
 */
export async function handleRagQuery(userQuery, fileId, userId) {
  const fileDoc = await fileUploadModel.findOne({ fileId, userId });

  console.log(`\n[RAG Request] User query: "${userQuery}", active fileId: ${fileId}`);

  if (!fileDoc || fileDoc.status !== "ready") {
    console.log(
      `[RAG Request] File is missing or not ready (status=${fileDoc?.status}). Falling back to general chat.`
    );
    return { type: "general" };
  }

  const isFileRelated = await isQueryFileRelated(userQuery, fileDoc.fileName);

  if (!isFileRelated) {
    console.log(
      `[RAG Request] Query intent classified as NOT file-related. Routing to general chat.`
    );
    return { type: "general" };
  }

  console.log(
    `[RAG Request] Query intent classified as YES file-related. Proceeding with RAG.`
  );

  // 3. Embed query
  let queryVector;
  try {
    queryVector = await embedQuery(userQuery);
  } catch (err) {
    console.error("RAG embed query failed:", err.message);
    return { type: "general" }; // safe fallback
  }

  // 4. Query Pinecone using main filter
  const chunks = await queryChunks(
    queryVector,
    fileId,
    userId,
    fileDoc.namespace
  );

  if (!chunks || chunks.length === 0) {
    console.log(
      `[RAG Request] ❌ queryChunks returned 0 chunks. Trying fallback without userId filter.`
    );

    // Fallback 1: try querying without userId filter (in case of metadata mismatch)
    const fallbackChunks = await queryChunksFallback(
      queryVector,
      fileId,
      fileDoc.namespace
    );

    if (fallbackChunks && fallbackChunks.length > 0) {
      console.log(
        `[RAG Request] ✅ Fallback retrieved ${fallbackChunks.length} chunks from Pinecone!`
      );

      const context = fallbackChunks
        .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
        .join("\n\n");

      console.log(
        `[RAG Request] Context string length: ${context.length} characters.`
      );

      return { type: "rag", context, fileName: fileDoc.fileName };
    }

    // Fallback 2: Use full text from MongoDB
    if (fileDoc.fullText && fileDoc.fullText.length > 0) {
      console.log(
        `[RAG Request] ⚠️ Pinecone empty, using MongoDB fullText fallback (${fileDoc.fullText.length} chars)`
      );

      // Truncate if too large to avoid token limits
      const truncatedText =
        fileDoc.fullText.length > 15000
          ? fileDoc.fullText.substring(0, 15000) +
            "\n\n[... document truncated ...]"
          : fileDoc.fullText;

      const context = `[Full Document Content]:\n${truncatedText}`;
      return { type: "rag", context, fileName: fileDoc.fileName };
    }

    console.log(`[RAG Request] ❌ All fallbacks failed. Returning not_found.`);
    return { type: "not_found", fileName: fileDoc.fileName };
  }

  console.log(
    `[RAG Request] ✅ Received ${chunks.length} chunks from Pinecone. Constructing LLM context...`
  );

  // 5. Build grounded context string from top chunks
  const context = chunks
    .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
    .join("\n\n");

  console.log(
    `[RAG Request] Context string length being sent to Gemini: ${context.length} characters.`
  );

  return { type: "rag", context, fileName: fileDoc.fileName };
}

/**
 * Fallback query that only filters by fileId (no userId filter).
 * Used when the primary query returns 0 results due to metadata mismatch.
 */
async function queryChunksFallback(queryVector, fileId, namespace) {
  const { Pinecone } = await import("@pinecone-database/pinecone");

  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const INDEX_NAME = process.env.PINECONE_INDEX || "shree-vectordb";
  const ns = client.index(INDEX_NAME).namespace(namespace);

  const result = await ns.query({
    vector: queryVector,
    topK: 10,
    includeMetadata: true,
    filter: {
      fileId: { $eq: fileId },
    },
  });

  const matches = result.matches || [];

  return matches.map((match) => ({
    text: match.metadata?.text || "",
    score: match.score,
    metadata: match.metadata,
  }));
}