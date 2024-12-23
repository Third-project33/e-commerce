import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './Chat.module.css';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sent: boolean; id: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const sock = io('http://localhost:3002');
    setSocket(sock);

    sock.on('chat message', (msg) => {
      setMessages(prev => {
        if (!prev.some(m => m.text === msg)) {
          return [...prev, { text: msg, sent: false, id: Date.now().toString() }];
        }
        return prev;
      });
    });

    return () => {
      sock.disconnect();
    };
  }, []);

  const handelmessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      socket.emit('chat message', inputMessage);  
      
      setMessages(prev => [...prev, { text: inputMessage, sent: true, id: Date.now().toString() }]);
      setInputMessage('');
    }
  };

  return (
    <div className={`${styles.homeChatWidget} ${isOpen ? styles.homeChatWidgetOpen : ''}`}>
      <div className={styles.homeChatHeader}>
        <h3>Chat Support</h3>
        <button className={styles.homeCloseButton} onClick={onClose}>&times;</button>
      </div>
      
      <div className={styles.homeMessageContainer}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles.homeMessage} ${message.sent ? styles.homeSent : styles.homeReceived}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handelmessage} className={styles.homeInputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tapez votre message..."
          className={styles.homeMessageInput}
        />
        <button type="submit" className={styles.homeSendButton}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;