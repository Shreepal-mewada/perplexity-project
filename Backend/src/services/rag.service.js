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
  // 1. Load file metadata
  const fileDoc = await fileUploadModel.findOne({ fileId, userId });

  if (!fileDoc || fileDoc.status !== "ready") {
    // File not ready or not owned by this user — fall back to normal chat
    return { type: "general" };
  }

  // 2. Classify intent
  const isFileRelated = await isQueryFileRelated(userQuery, fileDoc.fileName);

  if (!isFileRelated) {
    return { type: "general" };
  }

  // 3. Embed query
  let queryVector;
  try {
    queryVector = await embedQuery(userQuery);
  } catch (err) {
    console.error("RAG embed query failed:", err.message);
    return { type: "general" }; // safe fallback
  }

  // 4. Retrieve relevant chunks from Pinecone
  const chunks = await queryChunks(
    queryVector,
    fileId,
    userId,
    fileDoc.namespace
  );

  if (!chunks || chunks.length === 0) {
    return { type: "not_found", fileName: fileDoc.fileName };
  }

  // 5. Build grounded context string from top chunks
  const context = chunks
    .map((c, i) => `[Excerpt ${i + 1}]:\n${c.text}`)
    .join("\n\n");

  return { type: "rag", context, fileName: fileDoc.fileName };
}
