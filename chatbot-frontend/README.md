# Projeto 1: Widget de Chat (Front-end )

Este é o front-end do projeto de Chatbot Inteligente, construído com React e Vite. O projeto consiste em um widget de chat incorporável que se comunica com a API back-end para fornecer uma experiência de conversação em tempo real.

## ✨ Funcionalidades

- **Interface Moderna**: Design limpo e responsivo, inspirado em aplicativos de mensagem modernos.
- **Componente Reutilizável**: Construído para ser facilmente incorporado em qualquer site.
- **Funcionalidade de Abrir/Fechar**: O chat começa como um ícone e se expande ao ser clicado.
- **Comunicação em Tempo Real**: Envia e recebe mensagens da API, mostrando o status "digitando...".
- **Estilização com CSS Modules**: Garante que os estilos do widget não entrem em conflito com o site hospedeiro.

## 🚀 Tecnologias Utilizadas

- **React**: Biblioteca para construção da interface de usuário.
- **Vite**: Ferramenta de build e desenvolvimento rápido.
- **Axios**: Para fazer as requisições HTTP para a API back-end.
- **React Icons**: Para ícones modernos e leves.
- **CSS Modules**: Para estilização com escopo local.

## ⚙️ Configuração e Instalação

Siga os passos abaixo para rodar o front-end localmente.

### **1. Pré-requisitos**

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- O **back-end** deste projeto deve estar configurado e rodando.

### **2. Instale as Dependências**

Navegue até a pasta do projeto e instale as dependências:

```bash
# Se você estiver clonando o projeto completo
cd chatbot-frontend

npm install
```

### **3. Configure a Conexão com a API**

Antes de iniciar, você precisa conectar o front-end com a API do back-end.

1.  Use o Postman (ou outra ferramenta) para criar uma empresa no back-end enviando uma requisição `POST` para `http://localhost:3001/api/companies`.
2.  Copie a `api_key` retornada na resposta.
3.  Abra o arquivo `src/App.jsx`.
4.  Cole a sua `api_key` na constante `API_KEY`:

    ```javascript
    // src/App.jsx
    const API_KEY = "SUA_API_KEY_AQUI";
    ```

### **4. Inicie o Servidor de Desenvolvimento**

```bash
npm run dev
```

O widget de chat estará visível e funcional em `http://localhost:5173`.
