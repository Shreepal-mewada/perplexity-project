import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import { searchInternet } from "./internet.service.js";

let geminiModel = null;
let mistralModel = null;

const getGeminiModel = () => {
  if (!geminiModel) {
    geminiModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 1000, // 🔥 added for longer responses
    });
  }
  return geminiModel;
};

const getMistralModel = () => {
  if (!mistralModel) {
    mistralModel = new ChatMistralAI({
      model: "mistral-small-latest",
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  return mistralModel;
};

export function buildLLMContext(memoryContext) {
  let contextParts = [];

  if (
    memoryContext &&
    memoryContext.topMemories &&
    memoryContext.topMemories.length > 0
  ) {
    const facts = memoryContext.topMemories
      .map((m) => `- [${m.projectKey}] ${m.content}`)
      .join("\n");
    contextParts.push(
      `[LONG-TERM USER FACTS]\nThese are durable facts about the user's preferences, projects, and stack:\n${facts}`
    );
  }

  if (memoryContext && memoryContext.shortTermMemory) {
    const sm = memoryContext.shortTermMemory;
    const topics = sm.activeTopics?.join(", ");
    const uq = sm.unresolvedQuestions?.join(", ");
    contextParts.push(
      `[CURRENT SHORT-TERM CHAT CONTEXT]\nActive Topics: ${
        topics || "none"
      }\nUnresolved Questions: ${uq || "none"}\nRecent Conversation Summary: ${
        sm.recentSummary || "This is the start of the conversation."
      }`
    );
  }

  return contextParts.join("\n\n");
}

export async function generateResponse(message, memoryContext = null) {
  try {
    const messagesArray = Array.isArray(message) ? message : [message];

    const conversationHistory = messagesArray
      .map((msg) => {
        try {
          const msgObj = msg.toObject ? msg.toObject() : msg;
          if (msgObj.role === "user") {
            return new HumanMessage(msgObj.content);
          } else if (msgObj.role === "ai") {
            return new AIMessage(msgObj.content);
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const contextBlock = memoryContext ? buildLLMContext(memoryContext) : "";

    // 🔥 UPDATED SYSTEM PROMPT (MAIN FIX)
    const systemPrompt = new SystemMessage(
      `You are WebCore AI, a highly intelligent and professional AI assistant similar to ChatGPT.

${
  contextBlock
    ? `\n=========================================\nMEMORY CONTEXT AVAILABLE:\n${contextBlock}\n=========================================\n`
    : ""
}

RESPONSE STYLE:
- Always provide detailed, well-structured answers
- Use headings and subheadings where appropriate
- Explain concepts step-by-step when needed
- Include examples when helpful
- Do NOT give very short answers unless explicitly asked
- Expand responses to ensure clarity and depth

FORMATTING:
- Use proper markdown formatting (headings, bold, spacing)
- Use bullet points for lists
- Use tables ONLY when necessary (not for every answer)
- If the answer can be structured, ALWAYS use headings

TONE:
- Professional, clear, and human-like
- Not robotic, not overly verbose, but informative

IMPORTANT:
- Default to detailed explanations unless user asks for "brief"

INTERNET SEARCH:
If the user asks about current events, recent news, real-time data, or time-sensitive information, respond with:
[SEARCH: your search query here]

After search results are provided, give a structured, detailed answer based on them.`
    );

    let allMessages = [systemPrompt, ...conversationHistory];

    console.log("Invoking Gemini...");

    let response = await getGeminiModel().invoke(allMessages);
    let responseText = await extractText(response);

    console.log("Initial response:", responseText);

    const searchMatch = responseText.match(/\[SEARCH:\s*([^\]]+)\]/);

    if (searchMatch) {
      const searchQuery = searchMatch[1].trim();
      console.log("Model requested search for:", searchQuery);

      try {
        const searchResult = await searchInternet({ query: searchQuery });

        allMessages.push(response);
        allMessages.push(
          new HumanMessage(
            `Here are the search results for "${searchQuery}":\n\n${searchResult}\n\nProvide a detailed, structured answer based on these results.`
          )
        );

        response = await getGeminiModel().invoke(allMessages);
        responseText = await extractText(response);

        responseText = responseText.replace(/\[SEARCH:[^\]]*\]/g, "").trim();
      } catch (searchError) {
        responseText =
          responseText.replace(/\[SEARCH:[^\]]*\]/g, "").trim() ||
          "I couldn't fetch the information. Please try again.";
      }
    }

    return responseText;
  } catch (error) {
    console.error("Error generating response:", error.message, error.stack);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

async function extractText(response) {
  try {
    if (typeof response.content === "string") return response.content;
    if (response.text) return response.text;
    if (Array.isArray(response.content)) {
      return response.content
        .map((c) => (typeof c === "string" ? c : c.text || ""))
        .join("");
    }
    return JSON.stringify(response);
  } catch {
    return "";
  }
}

export async function generateChatTitle(message) {
  try {
    const response = await getMistralModel().invoke([
      new SystemMessage(`Generate a short 2-3 word title for the message.`),
      new HumanMessage(`generate a title for: ${message}`),
    ]);
    return response.text;
  } catch (error) {
    console.error("Error generating title:", error);
    throw error;
  }
}

/**
 * Generates a RAG-grounded response using retrieved document chunks as context.
 * Strictly instructs the model not to hallucinate content outside the excerpts.
 *
 * @param {string} question       — user's message
 * @param {string} documentContext — joined chunk excerpts
 * @param {string} fileName        — for attribution in system prompt
 * @param {object} memoryContext   — existing memory context (unchanged)
 */
export async function generateRagResponse(
  question,
  documentContext,
  fileName,
  memoryContext = null
) {
  try {
    const contextBlock = memoryContext ? buildLLMContext(memoryContext) : "";

    const ragSystemPrompt = new SystemMessage(
      `You are WebCore AI, a highly intelligent document analyst.

The user has uploaded a document named "${fileName}". Answer ONLY based on the document excerpts provided below.
Do NOT hallucinate or add information not present in these excerpts.
If the answer is not found in the excerpts, respond: "This information was not found in the uploaded document '${fileName}'."

${contextBlock ? `\nUSER MEMORY CONTEXT:\n${contextBlock}\n` : ""}

DOCUMENT EXCERPTS:
-----------------------------------------
${documentContext}
-----------------------------------------

RESPONSE STYLE:
- Provide clear, structured answers based on the excerpts above
- Use headings and bullet points where appropriate
- Cite which excerpt supports your answer when helpful
- If partially found, state what was found and what was not
- Remain professional and informative`
    );

    const userMsg = new HumanMessage(question);
    const response = await getGeminiModel().invoke([ragSystemPrompt, userMsg]);
    return await extractText(response);
  } catch (error) {
    console.error("RAG response generation error:", error.message);
    throw new Error(
      `Failed to generate document-based response: ${error.message}`
    );
  }
}
