require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const companyRoutes = require("./routes/companyRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", companyRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).send("API do Chatbot está no ar!");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.status(200).json({
      message: "Conexão com o banco de dados bem-sucedida!",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao conectar com o banco de dados.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
