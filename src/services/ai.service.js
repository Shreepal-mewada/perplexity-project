import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});
export async function generateResponse(req, res) {
  model.invoke("give me 20 random words").then((response) => {
    console.log(response.text);
  });
} 