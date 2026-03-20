import { tavily } from "@tavily/core";

let tvly = null;

const getTavilyClient = () => {
  if (!tvly) {
    tvly = tavily({
      apiKey: process.env.TVLY_API_KEY,
    });
  }
  return tvly;
};

export const searchInternet = async ({ query }) => {
  const client = getTavilyClient();
  const response = await client.search(query, {
    maxResults: 5,
    searchDepth: "advanced",
  });
  return JSON.stringify(response);
};
