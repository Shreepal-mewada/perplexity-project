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

  if (memoryContext && memoryContext.topMemories && memoryContext.topMemories.length > 0) {
    const facts = memoryContext.topMemories.map(m => `- [${m.projectKey}] ${m.content}`).join("\n");
    contextParts.push(`[LONG-TERM USER FACTS]\nThese are durable facts about the user's preferences, projects, and stack:\n${facts}`);
  }

  if (memoryContext && memoryContext.shortTermMemory) {
    const sm = memoryContext.shortTermMemory;
    const topics = sm.activeTopics?.join(", ");
    const uq = sm.unresolvedQuestions?.join(", ");
    contextParts.push(`[CURRENT SHORT-TERM CHAT CONTEXT]\nActive Topics: ${topics || 'none'}\nUnresolved Questions: ${uq || 'none'}\nRecent Conversation Summary: ${sm.recentSummary || 'This is the start of the conversation.'}`);
  }

  return contextParts.join("\n\n");
}

export async function generateResponse(message, memoryContext = null) {
  try {
    // Convert Mongoose documents to plain objects if needed
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

    // Create a system prompt
    const systemPrompt = new SystemMessage(
      `You are a helpful AI assistant with excellent formatting skills.

${contextBlock ? `\n=========================================\nMEMORY CONTEXT AVAILABLE:\n${contextBlock}\n=========================================\n` : ''}

IMPORTANT TABLE FORMATTING RULES:
- When presenting data, comparisons, schedules, lists of items, or any structured information, ALWAYS use markdown tables
- Format tables clearly with proper headers and aligned columns
- Include emojis or relevant symbols when appropriate to make tables visually appealing
- Use proper markdown table syntax:
  | Header 1 | Header 2 | Header 3 |
  |----------|----------|----------|
  | Data 1   | Data 2   | Data 3   |

INTERNET SEARCH:
If the user asks about current events, recent news, real-time data, or time-sensitive information, respond with:
[SEARCH: your search query here]

For example: "[SEARCH: latest IPL schedule 2024]" or "[SEARCH: current stock prices]"

After providing the [SEARCH:...] tag, the system will fetch the information and provide you the results. Then format the results in a well-structured markdown table.

RESPONSE STYLE:
- Be concise but informative
- Use tables for any structured data
- Add context and explanation before or after tables
- Use proper markdown formatting for headers, bold text, and emphasis`,
    );

    // Combine system prompt with conversation history
    let allMessages = [systemPrompt, ...conversationHistory];

    console.log("Invoking Gemini...");

    // Get response from model
    let response = await getGeminiModel().invoke(allMessages);
    let responseText = await extractText(response);

    console.log("Initial response:", responseText);

    // Check if response contains a search request
    const searchMatch = responseText.match(/\[SEARCH:\s*([^\]]+)\]/);

    if (searchMatch) {
      const searchQuery = searchMatch[1].trim();
      console.log("Model requested search for:", searchQuery);

      try {
        // Execute the search
        const searchResult = await searchInternet({ query: searchQuery });
        console.log("Search completed successfully");

        // Add search result to conversation
        allMessages.push(response);
        allMessages.push(
          new HumanMessage(
            `Here are the search results for "${searchQuery}":\n\n${searchResult}\n\nPlease provide a comprehensive answer based on these search results.`,
          ),
        );

        // Get final response with search results
        response = await getGeminiModel().invoke(allMessages);
        responseText = await extractText(response);

        // Remove the search tag if it appears again
        responseText = responseText.replace(/\[SEARCH:[^\]]*\]/g, "").trim();

        console.log("Final response after search:", responseText);
      } catch (searchError) {
        console.error("Search error:", searchError.message);
        // If search fails, return the original response without search
        responseText =
          responseText.replace(/\[SEARCH:[^\]]*\]/g, "").trim() ||
          "I apologize, I couldnt fetch the information. Could you try asking something else?";
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
    if (typeof response.content === "string") {
      return response.content;
    }
    if (response.text) {
      return response.text;
    }
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
      new SystemMessage(`
        you are a helpful assistant that generates a title for the given message in 2- 3 words  . The title should be concise and capture the essence of the message.
        `),
      new HumanMessage(`generate a title for: ${message}`),
    ]);
    return response.text;
  } catch (error) {
    console.error("Error generating title:", error);
    throw error;
  }
}
