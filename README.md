# Projeto de Portfólio: Chatbot Inteligente SaaS

Bem-vindo ao meu projeto de Chatbot Inteligente! Esta é uma aplicação full-stack que simula uma plataforma SaaS onde empresas podem configurar um chatbot com uma base de conhecimento personalizada para responder perguntas de seus clientes.

O projeto é dividido em duas partes principais, contidas neste monorepo:

1.  **`chatbot-backend/`**: Uma API RESTful construída com Node.js, Express e PostgreSQL, responsável por toda a lógica de negócio, persistência de dados e integração com a IA da OpenAI.
2.  **`chatbot-frontend/`**: Um widget de chat moderno e incorporável construído com React e Vite, que consome a API do back-end.

## 🚀 Visão Geral da Arquitetura

- **Front-end**: Um widget de chat dinâmico e estiloso (React) que pode ser facilmente integrado a qualquer site.
- **Back-end**: Uma API robusta (Node.js/Express) que gerencia múltiplos clientes (empresas), sessões de chat e o histórico de conversas.
- **Banco de Dados**: O PostgreSQL, rodando em um container Docker, armazena todas as informações de forma persistente.
- **Inteligência Artificial**: A integração com a API da OpenAI permite que o chatbot forneça respostas inteligentes e contextuais.

![Estrutura do Projeto](https://i.imgur.com/link-para-uma-imagem-da-arquitetura.png)

## ⚙️ Como Executar o Projeto Completo

Para rodar a aplicação, você precisará configurar e iniciar tanto o back-end quanto o front-end.

### **1. Configurando o Back-end**

O back-end é o cérebro da aplicação. Ele precisa ser iniciado primeiro.

➡️ **[Clique aqui para ver as instruções detalhadas no README do Back-end](./chatbot-backend/README.md)**

### **2. Configurando o Front-end**

Com o back-end rodando, você pode iniciar a interface do chat.

➡️ **[Clique aqui para ver as instruções detalhadas no README do Front-end](./chatbot-frontend/README.md)**

---

Este projeto foi desenvolvido para demonstrar minhas habilidades em desenvolvimento full-stack, incluindo design de API, gerenciamento de banco de dados, desenvolvimento de interface com React, integração com serviços de terceiros (IA) e práticas modernas de desenvolvimento como containerização com Docker.
