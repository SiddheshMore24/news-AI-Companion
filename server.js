require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const {
  loadModel,
  chunkText,
  storeChunks,
  retrieveRelevant,
  isRelevant,
} = require("./rag");

const { detectIntent, detectDomain, buildPrompt } = require("./mcp");

const app = express();
app.use(cors());
app.use(express.json());

const sessions = {};
const sessionArticles = {}; // Track which article each session uses

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/analyze", async (req, res) => {
  try {
    const { text, query, sessionId } = req.body;

    // Validate inputs
    if (!text || !text.trim()) {
      return res.status(400).json({ 
        error: "Article text is required." 
      });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({ 
        error: "Please ask a question." 
      });
    }

    const id = sessionId || "default";

    // Initialize session if needed
    if (!sessions[id]) {
      sessions[id] = [];
      sessionArticles[id] = null;
    }

    // If article changed, reset context
    if (sessionArticles[id] !== text) {
      sessions[id] = [];
      sessionArticles[id] = text;
    }

    const intent = detectIntent(query);
    const domain = detectDomain(query);

    // Process article
    const chunks = chunkText(text);
     storeChunks(chunks);

    // Check relevance with better threshold
    const relevant = await isRelevant(query);
    if (!relevant) {
      // Still return a response, but indicate it's unrelated
      const response = "This question is not related to the article. Please ask something related to the news article you shared.";
      sessions[id].push({ role: "user", content: query });
      sessions[id].push({ role: "assistant", content: response });
      return res.json({ response });
    }

    // Retrieve relevant context
    const context = (await retrieveRelevant(query, 5)).join("\n\n");

    // Build optimized prompt
    const prompt = buildPrompt(intent, domain, context, query);

    // Build messages with conversation history
    const messages = [
      { role: "system", content: "You are a smart, conversational AI assistant that analyzes news articles. Be concise, clear, and human-like." },
      ...sessions[id].slice(-6), // Keep last 6 messages (3 exchanges) for context
      { role: "user", content: prompt },
    ];

    // Call API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b", // More reliable model
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    clearTimeout(timeout);

    const answer = completion.choices[0].message.content.trim();

    // Store in session history
    sessions[id].push({ role: "user", content: query });
    sessions[id].push({ role: "assistant", content: answer });

    // Keep conversation window manageable (don't keep entire history)
    if (sessions[id].length > 20) {
      sessions[id] = sessions[id].slice(-20);
    }

    res.json({ response: answer });

  } catch (e) {
    console.error("Error:", e.message);
    
    let errorMessage = "An error occurred. Please try again.";
    
    if (e.message.includes("abort")) {
      errorMessage = "Request timed out. Please try again.";
    } else if (e.message.includes("401") || e.message.includes("authentication")) {
      errorMessage = "API authentication error. Check your API key.";
    } else if (e.message.includes("rate")) {
      errorMessage = "Rate limit reached. Please wait a moment.";
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server running" });
});

async function start() {
  try {
    await loadModel();
    app.listen(3000, () => {
      console.log("🚀 Server running on http://localhost:3000");
      console.log("📰 Ready to analyze news articles!");
    });
  } catch (e) {
    console.error("Failed to start server:", e.message);
    process.exit(1);
  }
}

start();