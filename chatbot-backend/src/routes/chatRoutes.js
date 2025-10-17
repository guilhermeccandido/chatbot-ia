const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

console.log(">>> Definindo rotas de CHAT <<<"); // <<< ADICIONE ESTA LINHA

router.post("/chat/:companyApiKey", chatController.handleChatMessage);
router.get(
  "/chat/sessions/:sessionId/messages",
  chatController.getMessagesBySession
);
console.log(
  ">>> Rota GET para /chat/sessions/:sessionId/messages DEFINIDA <<<"
); // <<< ADICIONE ESTA LINHA

module.exports = router;
