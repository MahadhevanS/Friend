import React, { useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the styles
function Sidebar() {
  useEffect(() => {
      const savedMood = localStorage.getItem('chat_mood');
      console.log(savedMood)
      if (savedMood) {
        document.body.className = '';
        document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
      }
    }, []);

    return (
      <aside className="sidebar">
    <Link to="/">🏠 Home</Link>
    <Link to="/reminders">⏰ Reminders</Link>
    <Link to="/chatbot">💬 Chatbot</Link>
    <Link to="/memories">🖼️ Memories</Link>
    </aside>
    )
}
export default Sidebar;
