import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain";

import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  try {
    const response = await geminiModel.invoke(
      messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    );
    return response.text;
  } catch (error) {
    console.error("Error generating response:", error);

    throw error;
  }
}

export async function generateChatTitle(message) {
  try {
    const response = await mistralModel.invoke([
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
