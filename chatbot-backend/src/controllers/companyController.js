const prisma = require("../config/prisma");

const createCompany = async (req, res) => {
  const { name, knowledge_base, system_prompt, ai_provider } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O nome da empresa é obrigatório." });
  }

  try {
    // Cria a empresa usando o Prisma
    const newCompany = await prisma.company.create({
      data: {
        name,
        // Mapeia os campos do JSON para os campos do Schema do Prisma
        knowledgeBase: knowledge_base || null,
        systemPrompt: system_prompt || null,
        aiProvider: ai_provider || "GEMINI",
        // apiKey e createdAt são gerados automaticamente pelo banco/Prisma
      },
    });

    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  createCompany,
};
