import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";

let classifierModel = null;

function getClassifierModel() {
  if (!classifierModel) {
    classifierModel = new ChatMistralAI({
      model: "mistral-small-latest",
      apiKey: process.env.MISTRAL_API_KEY,
      temperature: 0,
      maxTokens: 10,
    });
  }
  return classifierModel;
}

/**
 * Classifies whether a user's query is related to an uploaded file.
 * Returns true if file-related, false if general question.
 * @param {string} userQuery
 * @param {string} fileName — name of the active file (e.g. "contract.pdf")
 * @returns {Promise<boolean>}
 */
export async function isQueryFileRelated(userQuery, fileName) {
  try {
    const response = await getClassifierModel().invoke([
      new SystemMessage(
        `You are a query classifier. The user has uploaded a file named "${fileName}".
Respond with only "YES" if the user's question is about the uploaded file or document, or "NO" if it's a general question unrelated to the file.
Examples of file-related: "summarize this document", "what does section 2 say", "key points of the file", "what is this about"
Examples of general: "what is React", "explain Node.js", "latest AI news"
Respond with ONLY the word YES or NO.`
      ),
      new HumanMessage(userQuery),
    ]);

    const text = (response.content || response.text || "").trim().toUpperCase();
    return text.startsWith("YES");
  } catch (err) {
    console.error("Query classifier error:", err.message);
    // Default to general (false) on failure — safe fallback
    return false;
  }
}
