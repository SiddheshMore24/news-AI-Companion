# 📰 News AI Companion - Voice + Chat System

A sophisticated AI system that understands news articles and enables natural conversations through both text and voice interfaces.

## 🎯 Features

### ✨ Core Capabilities
- **Article Analysis**: Processes and understands news articles using RAG (Retrieval Augmented Generation)
- **Natural Language Understanding**: Detects intent and domain automatically
- **Adaptive Responses**: Tailors answers based on query type and topic domain
- **Session-Based Memory**: Maintains conversation context across queries
- **Voice Intelligence**: Sophisticated voice input with silence detection

### 🎤 Voice Features
- **Natural Listening**: Continuous listening with no manual stop needed
- **Silence Detection**: Auto-detects ~1-2 seconds of silence to send query
- **Smart Interruption**: AI stops speaking if user starts talking
- **Clear Audio Feedback**: "Listening..." indicator with visual pulse
- **Volume Control**: Adjustable speech synthesis volume

### 💬 Chat Features
- **ChatGPT-style UI**: Clean, modern interface with message bubbles
- **Conversation History**: Remembers context across exchanges
- **Status Indicators**: Visual feedback for Listening/Speaking/Thinking states
- **Error Handling**: Clear, helpful error messages

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+
- npm or yarn
- API Key for Groq (or modify to use different AI provider)

### 2. Installation

```bash
cd c:\news
npm install
```

### 3. Configuration

Create a `.env` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com

### 4. Start the Server

```bash
npm start
```

or with auto-reload:

```bash
npx nodemon server.js
```

You should see:
```
📦 Loading embedding model...
✅ Model loaded successfully
🚀 Server running on http://localhost:3000
📰 Ready to analyze news articles!
```

### 5. Open the Interface

Visit `http://localhost:3000` in your browser (open `index.html` locally)

## 📖 How to Use

### Text Mode
1. **Paste Article**: Copy and paste a news article into the left panel
2. **Ask Questions**: Type your question in the input field
3. **Press Enter or Click Send**: Get a context-aware response

### Voice Mode
1. **Click the Mic Button** (🎤): Starts listening (button pulses red)
2. **Speak Naturally**: Talk about the article
3. **Pause Naturally**: System detects silence (~1.5 sec) and sends automatically
4. **AI Responds**: Speaks the answer aloud and displays it in chat

### Voice Pro Tips
- Speak clearly but naturally
- Let natural pauses happen - system detects them
- If AI is speaking and you interrupt, it stops immediately
- Use the volume slider to adjust AI speech volume
- Try different question types: summaries, explanations, cause-effect, etc.

## 🧠 Intent Detection

The system automatically understands what you want:

| Intent | Detected When | Response Style |
|--------|--------------|-----------------|
| **summary** | "summarize", "summary", "TLDR", "what is" | 3-5 lines, key points only |
| **explanation** | "explain", "how does", "what does" | Simple, clear breakdown |
| **reasoning** | "why", "cause", "impact", "effect" | Cause-effect relationships |
| **comparison** | "compare", "difference", "vs" | Key differences highlighted |
| **prediction** | "predict", "forecast", "next" | Future outlook based on context |
| **how-to** | "how can", "what can" | Practical, actionable steps |

## 🌍 Domain Detection

Automatically detects and adjusts for:

- **Political** - Strategic reasoning, balanced perspective
- **Economic** - Data points, market impact
- **Personal** - Relatable, lifestyle angle
- **Environmental** - Sustainability, eco-impact
- **Technology** - Simplified for general audience
- **Health** - Accuracy-focused, safety emphasis
- **Business** - Corporate implications
- **General** - Neutral, informative

## 🔧 System Architecture

### Backend (`server.js`)
- Express.js REST API on port 3000
- Groq API integration for LLM
- Session management for conversation history
- Intent & domain detection
- RAG-based context retrieval

### Frontend (`index.html`)
- Responsive split-panel layout
- Real-time chat with smooth animations
- Web Speech API for voice I/O
- Status indicators and visual feedback
- Volume control and settings

### RAG System (`rag.js`)
- Xenova transformers for embeddings
- Semantic chunking (200-word chunks)
- Cosine similarity matching
- Relevance threshold: 0.25 (smart filtering)
- Top-5 chunk retrieval for context

### Intent/Domain Mapper (`mcp.js`)
- Regex-based intent detection
- Multi-keyword domain classification
- Dynamic prompt engineering based on intent + domain
- Optimized system messages for each combination

## ⚙️ Configuration Options

### Relevance Threshold (`rag.js`)
Default: 0.25 (allows slightly related content)
- Lower = more permissive, might include unrelated content
- Higher = more strict, might miss related queries

### Silence Duration (`index.html`)
Default: 1500ms (1.5 seconds)
Change this if you prefer different pause detection:
```javascript
const SILENCE_DURATION = 1500; // milliseconds
```

### Chunk Size (`rag.js`)
Default: 200 words per chunk
Better for long articles. Adjust for different article types:
```javascript
chunkText(text, 200) // Change 200 to your preference
```

### API Model (`server.js`)
Default: "mixtral-8x7b-32768"
Fast, high-quality model from Groq. Alternative models:
- "google/gemma-7b-it"
- "meta-llama/llama2-70b-chat"
- "openai/gpt-oss-120b"

## 🐛 Troubleshooting

### "Server running but can't connect"
- Check if port 3000 is free: `netstat -ano | findstr :3000`
- Use different port in `server.js`: `app.listen(3001, ...)`

### "Mic button not working"
- Check browser supports Web Speech API (Chrome, Edge, Firefox)
- HTTPS required for voice in production
- Check browser permissions for microphone

### "Model takes too long to load"
- First run downloads ~150MB embedding model
- Subsequent runs are instant (cached)
- Check internet connection during first startup

### "API authentication error"
- Verify `GROQ_API_KEY` in `.env` is correct
- Check key is valid at https://console.groq.com
- Restart server after updating `.env`

### "Voice response not speaking"
- Check browser has audio output working
- Adjust volume slider
- Check if speech synthesis is blocked in security settings

### "Article not recognized"
- Ensure article text is pasted (not image/PDF)
- Check if article is English
- Try re-pasting the article

## 📊 Performance Tips

1. **Faster Responses**
   - Use shorter articles (< 3000 words)
   - More specific questions get faster answers
   - First query processes model (~3 sec), subsequent queries ~1 sec

2. **Better Voice Recognition**
   - Speak clearly and at normal pace
   - Reduce background noise
   - Use microphone closer to mouth

3. **Optimal API Cost**
   - Each query costs ~0.001-0.01 USD with Groq
   - Longer articles = more chunks = slightly higher cost
   - But usually negligible for personal use

## 🔐 Security Notes

- API keys stored locally in `.env` (never commit to git)
- Add `.env` to `.gitignore`
- Frontend only connects to your local server
- No article content sent except to local server
- No conversation history stored permanently

## 📝 Example Queries

Try these with a news article:

**Summaries:**
- "Summarize this article"
- "What's the main point?"
- "TLDR"

**Explanations:**
- "Explain what fiscal deficit means"
- "How do interest rates work?"

**Impact Analysis:**
- "Why does this matter?"
- "What's the impact on the economy?"
- "How could this affect me?"

**Comparisons:**
- "Compare this to previous events"
- "What's different about this time?"

**Predictions:**
- "What might happen next?"
- "Where could this lead?"

## 🎨 Customization

### Change Colors
Edit CSS in `index.html`:
```css
background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
/* Change these hex codes to your palette */
```

### Add New Domains
Edit `detectDomain()` in `mcp.js`:
```javascript
if (q.match(/\b(your_keywords)\b/i)) {
  return "your_domain";
}
```

Then add handling in `buildPrompt()`.

### Change Chunk Size
In `rag.js`:
```javascript
chunkText(text, 300) // Increase for longer articles
```

## 🚀 Next Steps

### Optional Enhancements
1. **Streaming Responses**: Show text as it generates
2. **Chat Persistence**: Save conversations to database
3. **Export Summary**: Download/email conversation
4. **Multi-language**: Support non-English articles
5. **Custom Voices**: Select different AI voices
6. **Dark Mode Toggle**: Day/night theme switch
7. **Analytics**: Track which domains/intents are popular

### Production Deployment
1. Use HTTPS/WSS for voice in production
2. Implement rate limiting on API
3. Add user authentication
4. Deploy backend to cloud (Heroku, Railway, Vercel)
5. Use CDN for frontend assets

## 📚 Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3, Web Speech API
- **Backend**: Express.js, Node.js
- **AI/ML**: Groq API (LLM), Xenova Transformers (Embeddings)
- **RAG**: Custom vector store with cosine similarity
- **Voice**: Web Speech API (browser built-in)

## 📄 License

MIT - Feel free to modify and use!

## 🤝 Support

If you encounter issues:
1. Check the Troubleshooting section
2. Look at browser console for errors (F12)
3. Check server logs in terminal
4. Verify all dependencies installed: `npm ls`

---

**Enjoy your News AI Companion! 🚀**

Built with ❤️ for intelligent news exploration
