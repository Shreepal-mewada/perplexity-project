import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "langchain";
import chatMemoryModel from "../models/chatMemory.model.js";
import userMemoryModel from "../models/userMemory.model.js";
import messageModel from "../models/message.model.js";

const getMemoryLLM = () => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash", // Using standard flash for reliable JSON capabilities and context window
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.1, // Low temperature for deterministic classification
  });
};

/**
 * Asynchronously processes new messages in a chat and extracts/updates memories.
 */
export async function processNewMessages(chatId, userId) {
  try {
    // 1. Fetch or Initialize ChatMemory with ownership verification
    let chatMemory = await chatMemoryModel.findOne({ chat: chatId, user: userId });
    if (!chatMemory) {
      chatMemory = await chatMemoryModel.create({ chat: chatId, user: userId });
    }

    // 2. Fetch unprocessed messages
    const query = { chat: chatId };
    if (chatMemory.lastProcessedMessage) {
      const lastProcessed = await messageModel.findById(chatMemory.lastProcessedMessage);
      if (lastProcessed) {
        query.createdAt = { $gt: lastProcessed.createdAt };
      }
    }

    const unprocessedMessages = await messageModel.find(query).sort({ createdAt: 1 });
    if (unprocessedMessages.length === 0) return;

    const messagesText = unprocessedMessages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // 3. Fetch existing UserMemories for project inference and replacement lookup
    const existingMemories = await userMemoryModel.find({ user: userId, status: "active" }).lean();

    // Create a compact list of existing long-term memories for the LLM to understand what already exists
    const existingMemoryGlossary = existingMemories
      .map(m => `[ID: ${m._id}] [Project: ${m.projectKey}] [Confidence: ${m.confidenceScore}] ${m.content}`)
      .join("\n");

    // 4. Construct prompt for Classification Pipeline
    const systemPrompt = new SystemMessage(`
You are a highly analytical Memory Classification System.
Your job is to analyze the new messages in a conversation, update the short term chat summary, and strictly classify long-term memory facts.

Current Chat Short-Term State:
- recentSummary: "${chatMemory.recentSummary}"
- keyPoints: ${JSON.stringify(chatMemory.keyPoints)}
- unresolvedQuestions: ${JSON.stringify(chatMemory.unresolvedQuestions)}
- activeTopics: ${JSON.stringify(chatMemory.activeTopics)}

Existing Active Long-Term Memories (for reference & replacement logic):
${existingMemoryGlossary || "None"}

INSTRUCTIONS:
You must return your output strictly as a JSON object matching the following structure exactly (do not wrap in markdown tags like \`\`\`json):
{
  "updatedShortTermState": {
    "shortSummary": "1 sentence overall summary",
    "recentSummary": "compact summary of the current conversational context",
    "keyPoints": ["point1", "point2"],
    "decisions": ["dec1"],
    "unresolvedQuestions": ["q1"],
    "activeTopics": ["topic1", "topic2"],
    "importantEntities": ["entity1"]
  },
  "longTermMemoryActions": [
    {
      "action": "IGNORE" | "SHORT_TERM_ONLY" | "LONG_TERM_ADD" | "LONG_TERM_UPDATE",
      "memoryType": "project" | "preference" | "goal" | "fact" | "constraint" | "stack" | "decision",
      "content": "The explicit fact...",
      "tags": ["tag1", "tag2"],
      "projectKey": "identified or inferred project name string",
      "importanceScore": 8, // 1 to 10
      "confidenceScore": 0.9, // 0.0 to 1.0,
      "replacedMemoryId": "only if action is LONG_TERM_UPDATE, provide the [ID: ...] of the existing memory it replaces"
    }
  ]
}

RULES:
- "IGNORE": Small talk, greetings, filler. (Output empty longTermMemoryActions if there's nothing useful).
- "SHORT_TERM_ONLY": Temporarily relevant to immediate task but not a durable cross-chat fact.
- "LONG_TERM_ADD": A brand new, durable fact about the user's projects, preferences, identity, stack, etc.
- "LONG_TERM_UPDATE": A newer detail that supersedes or enriches a specific existing long-term memory ID. You must provide the \`replacedMemoryId\`.
- projectKey logic: Infer the projectKey carefully. If multiple projects exist, keep them separate. If none, use 'general'.
`);

    const userPrompt = new HumanMessage(`Here are the unprocessed messages:\n\n${messagesText}`);

    // Call Gemini
    const llm = getMemoryLLM();
    const response = await llm.invoke([systemPrompt, userPrompt]);
    let responseText = typeof response.content === "string" ? response.content : response.text;

    // Clean markdown if present
    responseText = responseText.replace(/^```json/g, "").replace(/```$/g, "").trim();

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse LLM memory analysis JSON:", err, "Response was:", responseText);
      return;
    }

    // 5. Update ChatMemory
    const short = analysis.updatedShortTermState || {};
    chatMemory.shortSummary = short.shortSummary || chatMemory.shortSummary;
    chatMemory.recentSummary = short.recentSummary || chatMemory.recentSummary;
    chatMemory.keyPoints = short.keyPoints || chatMemory.keyPoints;
    chatMemory.decisions = short.decisions || chatMemory.decisions;
    chatMemory.unresolvedQuestions = short.unresolvedQuestions || chatMemory.unresolvedQuestions;
    chatMemory.activeTopics = short.activeTopics || chatMemory.activeTopics;
    chatMemory.importantEntities = short.importantEntities || chatMemory.importantEntities;
    chatMemory.lastProcessedMessage = unprocessedMessages[unprocessedMessages.length - 1]._id;
    chatMemory.summaryVersion += 1;
    chatMemory.lastSummarizedAt = new Date();
    await chatMemory.save();

    // 6. Handle Long-Term Memory Actions
    const actions = analysis.longTermMemoryActions || [];
    for (const action of actions) {
      if (action.action === "IGNORE" || action.action === "SHORT_TERM_ONLY") {
        continue;
      }

      if (action.action === "LONG_TERM_ADD") {
        await userMemoryModel.create({
          user: userId,
          memoryType: action.memoryType || "fact",
          content: action.content,
          tags: action.tags || [],
          projectKey: action.projectKey || "general",
          importanceScore: action.importanceScore || 5,
          confidenceScore: action.confidenceScore || 0.8,
          status: "active",
          sourceChat: chatId
        });
      }

      if (action.action === "LONG_TERM_UPDATE" && action.replacedMemoryId) {
        // Mark old as replaced
        await userMemoryModel.findByIdAndUpdate(action.replacedMemoryId, { status: "replaced" });

        // Add new
        await userMemoryModel.create({
          user: userId,
          memoryType: action.memoryType || "fact",
          content: action.content,
          tags: action.tags || [],
          projectKey: action.projectKey || "general",
          importanceScore: action.importanceScore || 5,
          confidenceScore: action.confidenceScore || 0.9,
          status: "active",
          sourceChat: chatId
        });
      }
    }

  } catch (error) {
    console.error("Error in processNewMessages async pipeline:", error);
  }
}

/**
 * Multi-factor relevance scoring framework to retrieve top context.
 */
export async function getRelevantMemories(userId, currentMessageText, activeTopics = []) {
  try {
    // 1. Fetch Cap: Top 50 by text match (assuming text index exists on content/tags)
    // If MongoDB text index is too strict or not setup, we fallback to regex or all active memories.
    // For production without a vector DB, pulling all active memories for a user is usually fine until 1000+ items.
    let candidates = [];

    // We try $text search first if there are actual words in the query
    const words = currentMessageText.split(/\s+/).filter(w => w.length > 3);
    if (words.length > 0) {
      try {
        candidates = await userMemoryModel.find(
          { user: userId, status: "active", $text: { $search: currentMessageText } },
          { score: { $meta: "textScore" } }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(50)
          .lean();
      } catch (e) {
        // If text index is not created yet, fallback to generic fetch
        candidates = await userMemoryModel.find({ user: userId, status: "active" }).limit(100).lean();
      }
    } else {
      candidates = await userMemoryModel.find({ user: userId, status: "active" }).limit(100).lean();
    }

    if (candidates.length === 0) return [];

    const queryLower = currentMessageText.toLowerCase();

    // 2. Custom Ranking Algorithm
    const scoredMemories = candidates.map(mem => {
      let score = 0;
      const memContent = mem.content.toLowerCase();

      // A. Keyword/Tag overlap (Basic token match)
      const tags = mem.tags || [];
      for (const t of tags) {
        if (queryLower.includes(t.toLowerCase())) score += 2;
      }
      for (const w of words) {
        if (memContent.includes(w.toLowerCase())) score += 0.5;
      }

      // B. Project/Topic match boost
      if (activeTopics.some(topic => topic.toLowerCase() === mem.projectKey?.toLowerCase())) {
        score += 5; // Major boost if matching current active topic/project
      }

      // C. Importance & Confidence multipliers
      const baseValue = (mem.importanceScore || 5) * (mem.confidenceScore || 1.0);
      score += (baseValue * 0.5);

      // D. Recency boost (last accessed within 24 hours gets a slight bump)
      const daysSinceAccess = (Date.now() - new Date(mem.lastAccessedAt || mem.createdAt).getTime()) / (1000 * 3600 * 24);
      if (daysSinceAccess < 1) {
        score += 2;
      } else if (daysSinceAccess < 7) {
        score += 1;
      }

      return { ...mem, finalScore: score };
    });

    // 3. Sort and limit to Top 3-5
    scoredMemories.sort((a, b) => b.finalScore - a.finalScore);
    const topMemories = scoredMemories.slice(0, 5);

    // 4. Update lastAccessedAt in background
    if (topMemories.length > 0) {
      const ids = topMemories.map(m => m._id);
      userMemoryModel.updateMany({ _id: { $in: ids } }, { $set: { lastAccessedAt: new Date() } }).exec();
    }

    return topMemories;
  } catch (error) {
    console.error("Error in getRelevantMemories:", error);
    return [];
  }
}
