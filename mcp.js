// mcp.js

function detectIntent(q = "") {
  q = q.toLowerCase();

  // Query analysis
  if (q.match(/^\s*(summarize|summary|tldr|what is|tell me about)/i)) return "summary";
  if (q.match(/^\s*(explain|how does|what does)/i)) return "explanation";
  if (q.match(/\b(why|cause|reason|because|impact|effect|consequence|result|what (?:would|will) happen)\b/i)) return "reasoning";
  if (q.match(/\b(compare|differ|difference|similar|vs|versus)\b/i)) return "comparison";
  if (q.match(/\b(predict|forecast|future|next|upcoming|expect)\b/i)) return "prediction";
  if (q.match(/\b(how can|how do|what can)\b/i)) return "how-to";

  return "general";
}

function detectDomain(q = "") {
  q = q.toLowerCase();

  // Political domain
  if (q.match(/\b(trump|biden|democrat|republican|congress|senate|house|parliament|legislation|politics|political|election|vote|government|state department|policy|administration)\b/i)) {
    return "political";
  }

  // Economic domain
  if (q.match(/\b(economy|economic|inflation|gdp|stock|market|prices|spending|budget|tax|wages|unemployment|recession|currency|trade|fed|interest rate|investment)\b/i)) {
    return "economic";
  }

  // Personal/Social domain
  if (q.match(/\b(me|my|i|family|personal|social|community|people|society|culture|lifestyle)\b/i)) {
    return "personal";
  }

  // Environmental domain
  if (q.match(/\b(environment|climate|pollution|green|sustainability|carbon|fossil|energy|renewable|weather|nature|ecosystem)\b/i)) {
    return "environmental";
  }

  // Technology domain
  if (q.match(/\b(tech|technology|ai|artificial intelligence|data|digital|software|app|blockchain|crypto|internet|online)\b/i)) {
    return "technology";
  }

  // Health domain
  if (q.match(/\b(health|medical|disease|pandemic|covid|vaccine|doctor|hospital|treatment|wellness|mental|virus)\b/i)) {
    return "health";
  }

  // Business/Corporate domain
  if (q.match(/\b(business|company|corporate|ceo|profit|revenue|startup|industry|sector|enterprise|shareholder)\b/i)) {
    return "business";
  }

  return "general";
}

function buildPrompt(intent, domain, context, query) {
  let instructions = `You are a smart, conversational AI assistant.`;

  // Tailor based on intent
  switch (intent) {
    case "summary":
      instructions += ` Provide a concise summary in 3-5 lines. Focus on key points only.`;
      break;
    case "explanation":
      instructions += ` Explain clearly in simple terms. Break down concepts. Use 4-5 lines max.`;
      break;
    case "reasoning":
      instructions += ` Explain cause and effect relationships. Be logical. Keep it to 4-5 lines.`;
      break;
    case "comparison":
      instructions += ` Compare the items clearly with key differences. Use 4-5 lines.`;
      break;
    case "prediction":
      instructions += ` Provide a reasonable prediction based on context. Explain the logic. 3-4 lines.`;
      break;
    case "how-to":
      instructions += ` Provide practical steps if applicable. Keep it concise and actionable.`;
      break;
    default:
      instructions += ` Answer clearly and concisely. Keep answers to 5-6 lines maximum.`;
  }

  // Add domain context
  switch (domain) {
    case "political":
      instructions += ` Use strategic, balanced reasoning. Reference facts from the context.`;
      break;
    case "economic":
      instructions += ` Include economic impacts and data points when relevant.`;
      break;
    case "personal":
      instructions += ` Make it relatable to the user's perspective and daily life.`;
      break;
    case "environmental":
      instructions += ` Focus on environmental impact and sustainability angle.`;
      break;
    case "technology":
      instructions += ` Explain technical concepts clearly for general audience.`;
      break;
    case "health":
      instructions += ` Prioritize accuracy and safety. Recommend consulting professionals where needed.`;
      break;
    case "business":
      instructions += ` Focus on business implications and market dynamics.`;
      break;
  }

  instructions += `\n\nIMPORTANT:\n- Answer ONLY what was asked\n- Do NOT repeat the article\n- Be conversational and human-like\n- Avoid jargon\n- Keep response length: 5-6 lines MAX`;

  return `${instructions}\n\nContext from article:\n${context}\n\nQuestion: ${query}\n\nAnswer:`;
}

module.exports = { detectIntent, detectDomain, buildPrompt };