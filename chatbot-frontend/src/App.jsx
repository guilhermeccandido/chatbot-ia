import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './css/App.module.css';
import msgStyles from './css/Message.module.css';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const API_KEY = "6b76562f-6010-42b1-961c-ca4b2b3d065d";
const API_URL = `http://localhost:3001/api/chat/${API_KEY}`;

function App( ) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'USER', message_text: inputValue };
    setMessages(prev => [...prev, userMessage]);

    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        userId: 'frontend-user-1',
        message: messageToSend,
        sessionId: sessionId,
      });

      const { reply, sessionId: newSessionId } = response.data;
      const botMessage = { sender: 'BOT', message_text: reply };
      setMessages(prev => [...prev, botMessage]);

      if (!sessionId) {
        setSessionId(newSessionId);
      }
    } catch (error) {
      const errorMessageText = "Desculpe, estou com problemas. Tente novamente mais tarde.";
      const errorMessage = { sender: 'BOT', message_text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatWidgetContainer}>
      {}
      <div className={`${styles.chatWidget} ${!isOpen ? styles.closed : ''}`}>
        <div className={styles.header}>
          <h2>Fale Conosco</h2>
        </div>
        <div className={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${msgStyles.messageBubble} ${msg.sender === 'USER' ? msgStyles.user : msgStyles.bot}`}
            >
              {msg.message_text}
            </div>
          ))}
          {isLoading && <div className={msgStyles.typingIndicator}>Bot está digitando...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <FiSend />
          </button>
        </div>
      </div>

      {}
      <button className={styles.chatToggleButton} onClick={toggleChat}>
        {isOpen ? <FiX /> : <FiMessageSquare />}
      </button>
    </div>
  );
}

export default App;
