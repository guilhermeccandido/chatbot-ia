const { startWhatsAppSession } = require("./engine");

// Configure aqui a empresa da sua prima
const CLIENTS = [
  {
    name: "Marcela Candido",
    apiKey: "553cdfc5-4cd4-4205-ad5e-5a590ed195b5",
  },
];

CLIENTS.forEach((c) => startWhatsAppSession(c.name, c.apiKey));
