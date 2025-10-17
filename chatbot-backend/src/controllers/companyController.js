const db = require("../config/database");

const createCompany = async (req, res) => {
  const { name, knowledge_base } = req.body;

  if (!name) {
    return res.status(400).json({ error: "O nome da empresa é obrigatório." });
  }

  try {
    const query = `
      INSERT INTO companies (name, knowledge_base) 
      VALUES ($1, $2) 
      RETURNING id, name, api_key, created_at;
    `;
    const params = [name, knowledge_base || null];

    const { rows } = await db.query(query, params);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  createCompany,
};
