import { isQueryFileRelated } from "./classifier.service.js";
import { embedQuery } from "./embedding.service.js";
import { queryChunks } from "./pinecone.service.js";
import fileUploadModel from "../models/fileUpload.model.js";

/**
 * Main RAG pipeline. Called from chat controller when a fileId is present.
 *
 * Returns:
 *  - { type: 'rag', context: string, fileName: string }  — if file-related → caller builds grounded prompt
 *  - { type: 'general' }                                 — if unrelated → caller uses normal LLM
 *  - { type: 'not_found', fileName: string }             — if file-related but no chunks found
 *
 * @param {string} userQuery
 * @param {string} fileId
 * @param {string} userId
 */
export async function handleRagQuery(userQuery, fileId, userId) {
  const fileDoc = await fileUploadModel.findOne({ fileId, userId });

  console.log(`\n[RAG Request] User query: "${userQuery}", active fileId: ${fileId}`);

  if (!fileDoc || fileDoc.status !== "ready") {
    console.log(`[RAG Request] File is missing or not ready (status=${fileDoc?.status}). Falling back to general chat.`);
    // File not ready or not owned by this user — fall back to normal chat
    return { type: "general" };
  }

  const isFileRelated = await isQueryFileRelated(userQuery, fileDoc.fileName);

  if (!isFileRelated) {
    console.log(`[RAG Request] Query intent classified as NOT file-related. Routing to general chat.`);
    return { type: "general" };
  }
  
  console.log(`[RAG Request] Query intent classified as YES file-related. Proceeding with RAG.`);

  // 3. Embed query
  let queryVector;
  try {
    queryVector = await embedQuery(userQuery);
  } catch (err) {
    console.error("RAG embed query failed:", err.message);
    return { type: "general" }; // safe fallback
  }

  const chunks = await queryChunks(
    queryVector,
    fileId,
    userId,
    fileDoc.namespace
  );

  if (!chunks || chunks.length === 0) {
    console.log(`[RAG Request] ❌ queryChunks returned 0 chunks. Unable to ground prompt! Initializing fallback.`);
    return { type: "not_found", fileName: fileDoc.fileName };
  }

  console.log(`[RAG Request] ✅ Received ${chunks.length} chunks from Pinecone. Constructing LLM context...`);

  // 5. Build grounded context string from top chunks
  const context = chunks
    .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
    .join("\n\n");
    
  console.log(`[RAG Request] Context string length being sent to Gemini: ${context.length} characters.`);

  return { type: "rag", context, fileName: fileDoc.fileName };
}
