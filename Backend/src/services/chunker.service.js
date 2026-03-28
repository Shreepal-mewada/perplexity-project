/**
 * Splits extracted document text into overlapping chunks.
 * Each chunk preserves metadata for Pinecone upsert.
 */

const CHUNK_SIZE = 400;    // characters per chunk
const CHUNK_OVERLAP = 150;  // overlap between consecutive chunks

/**
 * @param {string} text         — full document text
 * @param {object} metadata     — { fileId, fileName, userId }
 * @returns {Array<{ text, metadata }>}
 */
export function chunkText(text, metadata) {
  const chunks = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunkText = text.slice(start, end).trim();

    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        metadata: {
          ...metadata,
          chunkIndex: index,
          sourceType: "uploaded_file",
          createdAt: new Date().toISOString(),
        },
      });
      index++;
    }

    // Move forward by CHUNK_SIZE - CHUNK_OVERLAP for overlap
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}
