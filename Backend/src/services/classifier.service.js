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
Your job is to decide if the user's question should be answered using the uploaded document's content.

Rules:
- If the question is vague, generic, or could refer to the uploaded file → YES
- If the question explicitly mentions "this", "the file", "the document", "it", "summarize", "explain", "what is in" → YES
- If the question is clearly about an external topic unrelated to any document → NO
- When in doubt, prefer YES (the user likely wants info from their uploaded file)

Examples of YES: "summarize this", "what is this about", "key points", "explain this document", "what does it say about X", "give me an overview", "what are the main topics", "tell me about this"
Examples of NO: "what is React", "explain Node.js architecture", "latest AI news 2026", "how to cook pasta"

Respond with ONLY the word YES or NO.`
      ),
      new HumanMessage(userQuery),
    ]);

    const text = (response.content || response.text || "").trim().toUpperCase();
    return text.startsWith("YES");
  } catch (err) {
    console.error("Query classifier error:", err.message);
    return true;
  }
}
