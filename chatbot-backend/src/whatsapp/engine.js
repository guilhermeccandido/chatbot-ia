const wppconnect = require("@wppconnect-team/wppconnect");
const axios = require("axios");

const API_BASE_URL = "http://localhost:3001/api";

async function startWhatsAppSession(sessionName, companyApiKey) {
  console.log(`[${sessionName}] Iniciando...`);

  wppconnect
    .create({
      session: sessionName,
      headless: false,
      logQR: false,
      autoClose: 0,
      browserArgs: ["--no-sandbox"],
    })
    .then((client) => {
      console.log(`[${sessionName}] Conectado!`);
      client.onMessage(async (message) => {
        if (
          !message.isGroupMsg &&
          message.body &&
          message.from !== "status@broadcast"
        ) {
          const userPhone = message.from;
          console.log(`Msg de ${userPhone}: ${message.body}`);

          try {
            await client.startTyping(userPhone);

            // Envia para o seu Backend
            const response = await axios.post(
              `${API_BASE_URL}/chat/${companyApiKey}`,
              {
                userId: userPhone,
                message: message.body,
                sessionId: null, // Deixa o backend criar a sessão numérica no banco
              }
            );

            const replyText = response.data.reply;

            if (replyText) {
              await client.sendText(userPhone, replyText);
            }
          } catch (error) {
            console.error("Erro API:", error.message);
          } finally {
            await client.stopTyping(userPhone);
          }
        }
      });
    })
    .catch((err) => console.error(err));
}

module.exports = { startWhatsAppSession };
