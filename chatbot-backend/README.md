# Projeto 1: API do Chatbot Inteligente

Esta é a API back-end para o projeto de Chatbot Inteligente, construída com Node.js, Express e PostgreSQL. A API é responsável por gerenciar empresas, sessões de chat, salvar mensagens e se integrar com a API da OpenAI para gerar respostas inteligentes.

## ✨ Funcionalidades

- **Multi-empresa**: A API é projetada para servir múltiplos clientes, cada um com sua própria `api_key` e base de conhecimento.
- **Gerenciamento de Sessão**: Cria e gerencia sessões de chat individuais para cada usuário final.
- **Persistência de Dados**: Todas as conversas são salvas em um banco de dados PostgreSQL.
- **Integração com IA**: Utiliza a API da OpenAI para gerar respostas contextuais com base em uma base de conhecimento fornecida.
- **Ambiente Dockerizado**: O banco de dados PostgreSQL roda em um container Docker para facilitar a configuração do ambiente.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para construção da API.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Para containerização do banco de dados.
- **OpenAI API**: Para a geração de respostas de IA.
- **Bibliotecas Node**: `pg`, `dotenv`, `cors`.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente.

### **1. Pré-requisitos**

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Docker](https://www.docker.com/get-started) e Docker Compose

### **2. Clone o Repositório**

```bash
# Se você estiver clonando o projeto completo
git clone https://github.com/guilhermeccandido/chatbot-ia.git
cd chatbot-backend
```

### **3. Instale as Dependências**

```bash
npm install
```

### **4. Configure as Variáveis de Ambiente**

Crie um arquivo chamado `.env` na raiz da pasta `chatbot-backend` e adicione as seguintes variáveis, substituindo pelos seus próprios valores:

```env
# Configurações do Banco de Dados PostgreSQL
DB_USER=seu_usuario_aqui
DB_HOST=localhost
DB_DATABASE=chatbot_db
DB_PASSWORD=sua_senha_segura_aqui
DB_PORT=5432

# Chave da API da OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Porta do Servidor
PORT=3001
```

### **5. Inicie o Banco de Dados com Docker**

Com o Docker em execução na sua máquina, execute o seguinte comando para criar e iniciar o container do PostgreSQL:

```bash
docker-compose up -d
```

### **6. Execute as Migrations**

Para criar as tabelas no banco de dados, execute o script de migração em Python (certifique-se de ter Python e `psycopg2-binary` instalados):

```bash
# Instale a dependência do Python, se necessário
pip install psycopg2-binary

# Execute o script
python ./migration/migration-chatbot.py
```

### **7. Inicie o Servidor**

Finalmente, inicie o servidor da API em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`.

## Endpoints da API

- `POST /api/companies`: Cria uma nova empresa.
- `POST /api/chat/:companyApiKey`: Envia uma mensagem para o chat de uma empresa.
- `GET /api/chat/sessions/:sessionId/messages`: Obtém o histórico de mensagens de uma sessão.
