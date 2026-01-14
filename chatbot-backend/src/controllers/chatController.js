// Importa o cliente Prisma configurado (certifique-se de ter criado o arquivo src/config/prisma.js)
const prisma = require("../config/prisma");
const { getAIResponse } = require("../services/ai/aiFactory");

const handleChatMessage = async (req, res) => {
  const { companyApiKey } = req.params;
  const { userId, message, sessionId } = req.body;

  if (!userId || !message) {
    return res
      .status(400)
      .json({ error: "userId e message são obrigatórios." });
  }

  try {
    // 1. Busca empresa
    const company = await prisma.company.findUnique({
      where: { apiKey: companyApiKey },
    });

    if (!company) {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }

    // 2. Gerencia Sessão
    let chatSession;

    // Cenário 1: Widget Web (Manda sessionId)
    if (sessionId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: Number(sessionId) },
      });
    }

    // Cenário 2: WhatsApp (sessionId null) ou Fallback
    if (!chatSession) {
      // Busca última sessão ativa deste usuário
      chatSession = await prisma.chatSession.findFirst({
        where: { companyId: company.id, endUserId: userId },
        orderBy: { createdAt: "desc" },
      });

      // Se não existir, cria nova
      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: { companyId: company.id, endUserId: userId },
        });
      }
    }

    // 3. Salva Msg User
    await prisma.message.create({
      data: {
        sessionId: chatSession.id,
        sender: "USER",
        messageText: message,
      },
    });

    // 4. Chama IA (Factory)
    const botResponse = await getAIResponse(company, message);

    // 5. Salva Msg Bot
    await prisma.message.create({
      data: {
        sessionId: chatSession.id,
        sender: "BOT",
        messageText: botResponse,
      },
    });

    res.status(200).json({
      reply: botResponse,
      sessionId: chatSession.id,
    });
  } catch (error) {
    console.error("Erro Chat Controller:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { sessionId: Number(sessionId) },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar mensagens." });
  }
};

module.exports = { handleChatMessage, getMessagesBySession };
