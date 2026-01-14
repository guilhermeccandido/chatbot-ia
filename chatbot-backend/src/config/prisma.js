const { PrismaClient } = require("@prisma/client");

// Cria uma única instância do Prisma para não estourar conexões no banco
const prisma = new PrismaClient();

module.exports = prisma;
