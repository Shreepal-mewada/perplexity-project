import { MistralAIEmbeddings } from "@langchain/mistralai";

let embeddingsModel = null;

function getEmbeddingsModel() {
  if (!embeddingsModel) {
    embeddingsModel = new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY,
      model: "mistral-embed", // 1024-dim output
    });
  }
  return embeddingsModel;
}

const BATCH_SIZE = 20; // Rate-limit safe batch size

/**
 * Generates embeddings for an array of text strings.
 * Returns an array of float[] vectors (dim=1024 for mistral-embed).
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedTexts(texts) {
  const model = getEmbeddingsModel();
  const allEmbeddings = [];

  // Process in batches to respect rate limits
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    try {
      const batchVectors = await model.embedDocuments(batch);
      allEmbeddings.push(...batchVectors);
    } catch (err) {
      console.error(`Embedding batch ${i}-${i + BATCH_SIZE} failed:`, err.message);
      throw new Error(`EMBEDDING_FAILED: ${err.message}`);
    }

    // Small delay between batches to be safe
    if (i + BATCH_SIZE < texts.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return allEmbeddings;
}

/**
 * Embeds a single query string for similarity search.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function embedQuery(text) {
  try {
    const model = getEmbeddingsModel();
    return await model.embedQuery(text);
  } catch (err) {
    throw new Error(`EMBEDDING_FAILED: ${err.message}`);
  }
}
