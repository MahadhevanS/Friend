import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [mood, setMood] = useState(() => {
    const saved = localStorage.getItem('chat_mood');
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (mood) {
      document.body.className = ''; // Clear any existing theme
      document.body.classList.add(`${mood.toLowerCase()}-theme`);
      localStorage.setItem('chat_mood', mood);
    }
  }, [mood]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botReplyText = data.reply || 'Hmm, I’m not sure how to respond!';
      const moodValue = data.mood || '';
      setMood(moodValue);
      console.log(moodValue);

      const botMessage = {
        sender: 'bot',
        text: botReplyText
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! Something went wrong.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-title">💬 Chat with Your Friend</h2>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.sender}`}>
            <span className={`chatbot-bubble ${msg.sender}`}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chatbot-input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="chatbot-input"
          placeholder="Tell me what’s up..."
        />
        <button onClick={sendMessage} className="chatbot-button">Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
