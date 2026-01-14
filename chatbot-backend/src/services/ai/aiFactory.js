const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const OpenAI = require("openai");

// --- Implementação Gemini (Com Filtros Desativados) ---
async function generateGeminiResponse(fullPrompt, userMessage) {
  if (!process.env.GEMINI_API_KEY)
    throw new Error("GEMINI_API_KEY não configurada");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // Configuração para NÃO bloquear nada (Anti-censura para palavras comuns)
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const finalInput = `${fullPrompt}\n\nPergunta do usuário: ${userMessage}`;

  try {
    const result = await model.generateContent(finalInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Se der erro de bloqueio mesmo assim, retorna algo amigável
    console.error("Erro Gemini Detalhado:", JSON.stringify(error, null, 2));
    throw new Error("Conteúdo bloqueado ou erro de API.");
  }
}

// --- Implementação OpenAI ---
async function generateOpenAIResponse(fullPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY)
    throw new Error("OPENAI_API_KEY não configurada");

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: fullPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return completion.choices[0].message.content;
}

// --- Factory Principal ---
async function getAIResponse(company, userMessage) {
  const { systemPrompt, knowledgeBase, aiProvider } = company;

  const masterPrompt = `
    INSTRUÇÕES:
    ${systemPrompt || "Seja um assistente útil."}

    BASE DE CONHECIMENTO:
    ---
    ${knowledgeBase || "Sem dados extras."}
    ---
    
    Responda apenas com base no texto acima.
  `;

  try {
    const provider = aiProvider || process.env.AI_PROVIDER || "GEMINI";

    if (provider.toUpperCase() === "OPENAI") {
      return await generateOpenAIResponse(masterPrompt, userMessage);
    } else {
      return await generateGeminiResponse(masterPrompt, userMessage);
    }
  } catch (error) {
    console.error(`Erro AI Factory (${aiProvider}):`, error.message);
    // Retorna string vazia ou mensagem genérica
    return "Desculpe, não entendi. Pode reformular?";
  }
}

module.exports = { getAIResponse };
