import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

let visionModel = null;

const getVisionModel = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      "Missing GOOGLE_API_KEY. Set your Google API key in the environment before using vision features.",
    );
  }
  if (!visionModel) {
    visionModel = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash", // confirmed vision-capable model
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 1500,
    });
  }
  return visionModel;
};

/**
 * Generates an AI response based on an image and optional text prompt.
 *
 * @param {string} text        - User's question / prompt
 * @param {string} base64Image - Raw base64 string (no data URI prefix)
 * @param {string} mimeType    - e.g. "image/jpeg", "image/png", "image/webp"
 * @returns {Promise<string>}  - AI response text
 */
export async function generateVisionResponse(text, base64Image, mimeType) {
  try {
    const prompt = text?.trim() ? text.trim() : "Explain this image in detail.";

    // @langchain/core HumanMessage supports multimodal content arrays
    const message = new HumanMessage({
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    });

    console.log("[Vision] Invoking Gemini 1.5 Flash Vision...");
    const response = await getVisionModel().invoke([message]);

    // Extract text content from response
    if (typeof response.content === "string") return response.content;
    if (response.text) return response.text;
    if (Array.isArray(response.content)) {
      return response.content
        .map((c) => (typeof c === "string" ? c : c.text || ""))
        .join("");
    }
    return JSON.stringify(response);
  } catch (error) {
    console.error("[Vision] Error generating vision response:", error.message);
    throw new Error(
      `Failed to generate image-based response: ${error.message}`,
    );
  }
}
