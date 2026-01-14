require("dotenv").config();
const express = require("express");
const cors = require("cors");

// AJUSTE 1: Importa o Prisma em vez do arquivo database.js antigo
const prisma = require("./config/prisma");

const companyRoutes = require("./routes/companyRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", companyRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).send("API do Chatbot (Prisma) está no ar!");
});

// AJUSTE 2: Teste de banco atualizado para sintaxe Prisma
app.get("/test-db", async (req, res) => {
  try {
    // Executa query raw via Prisma para testar conexão
    const result = await prisma.$queryRaw`SELECT NOW()`;

    res.status(200).json({
      message: "Conexão com o banco de dados (Prisma) bem-sucedida!",
      time: result[0].now, // O resultado vem como array de objetos
    });
  } catch (error) {
    console.error("Erro no DB:", error);
    res.status(500).json({
      message: "Erro ao conectar com o banco de dados.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
