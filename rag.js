// rag.js - Hybrid RAG (keyword-based, deployment-friendly)

// 🔥 Chunk text (same as before)
function chunkText(text, size = 200) {
  if (!text || !text.trim()) return [];
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  let chunks = [];

  for (let i = 0; i < words.length; i += size) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks.length > 0 ? chunks : [text];
}

// 🔥 Store chunks (no embeddings now)
let vectorStore = [];

async function storeChunks(chunks) {
  vectorStore = [];

  if (!chunks || chunks.length === 0) return;

  vectorStore = chunks.map(chunk => ({ chunk }));

  console.log(`✅ Stored ${vectorStore.length} chunks (Hybrid RAG)`);
}

// 🔥 Improved keyword scoring
function score(chunk, query) {
  const c = chunk.toLowerCase();
  const q = query.toLowerCase();

  let count = 0;

  const words = q.split(/\s+/);

  words.forEach(word => {
    if (word.length > 2 && c.includes(word)) {
      count++;
    }
  });

  return count;
}

// 🔥 Retrieve relevant chunks
async function retrieveRelevant(query, k = 5) {
  if (!query || vectorStore.length === 0) return [];

  let scored = vectorStore.map(v => ({
    chunk: v.chunk,
    score: score(v.chunk, query)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored
    .slice(0, Math.min(k, scored.length))
    .map(x => x.chunk);
}

// 🔥 Relevance check (smarter)
async function isRelevant(query, threshold = 1) {
  if (!query || vectorStore.length === 0) return false;

  let max = 0;

  for (let v of vectorStore) {
    const s = score(v.chunk, query);
    if (s > max) max = s;
  }

  return max >= threshold;
}

// 🔥 Dummy loadModel (to avoid breaking server.js)
async function loadModel() {
  console.log("⚡ Hybrid RAG mode (no embeddings)");
}

module.exports = {
  loadModel,
  chunkText,
  storeChunks,
  retrieveRelevant,
  isRelevant,
};