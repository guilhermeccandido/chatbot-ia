const db = require("../config/database");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handleChatMessage = async (req, res) => {
  const { companyApiKey } = req.params;
  const { userId, message, sessionId } = req.body;

  if (!userId || !message) {
    return res
      .status(400)
      .json({ error: "userId e message são obrigatórios." });
  }

  let currentSessionId = sessionId;

  try {
    const companyQuery =
      "SELECT id, knowledge_base FROM companies WHERE api_key = $1";
    const companyRes = await db.query(companyQuery, [companyApiKey]);

    if (companyRes.rows.length === 0) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }
    const companyId = companyRes.rows[0].id;
    const knowledgeBase = companyRes.rows[0].knowledge_base;

    if (!currentSessionId) {
      const sessionQuery = `
        INSERT INTO chat_sessions (company_id, end_user_id) 
        VALUES ($1, $2) 
        RETURNING id;
      `;
      const sessionRes = await db.query(sessionQuery, [companyId, userId]);
      currentSessionId = sessionRes.rows[0].id;
    }

    const userMessageQuery = `
      INSERT INTO messages (session_id, sender, message_text) 
      VALUES ($1, 'USER', $2);
    `;
    await db.query(userMessageQuery, [currentSessionId, message]);

    const systemPrompt = `Você é um assistente de atendimento ao cliente. Sua única função é responder à pergunta do usuário baseando-se estritamente na seguinte "Base de Conhecimento". Se a resposta não estiver contida no texto abaixo, você deve dizer que não possui essa informação. Não invente respostas.

    Base de Conhecimento:
    ---
    ${knowledgeBase || "Nenhuma base de conhecimento fornecida."}
    ---
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.5,
    });

    const botResponseText = completion.choices[0].message.content.trim();

    const botMessageQuery = `
      INSERT INTO messages (session_id, sender, message_text) 
      VALUES ($1, 'BOT', $2);
    `;
    await db.query(botMessageQuery, [currentSessionId, botResponseText]);

    res.status(200).json({
      reply: botResponseText,
      sessionId: currentSessionId,
    });
  } catch (error) {
    console.error("Erro no chat com IA:", error);
    res.status(500).json({
      error: "Erro interno do servidor ao processar a mensagem com IA.",
    });
  }
};

const getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const query = `
      SELECT id, sender, message_text, created_at 
      FROM messages 
      WHERE session_id = $1 
      ORDER BY created_at ASC;
    `;
    const { rows } = await db.query(query, [sessionId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar mensagens da sessão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  handleChatMessage,
  getMessagesBySession,
};
