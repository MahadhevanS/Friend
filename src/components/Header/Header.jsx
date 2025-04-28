import React, { useEffect} from 'react';
import './Header.css'; // Add this if you want to use the CSS file

function Header() {
  useEffect(() => {
        const savedMood = localStorage.getItem('chat_mood');
        console.log(savedMood)
        if (savedMood) {
          document.body.className = '';
          document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
        }
      }, []);

  return (
    <header className="header-container">
    <h1 className="header-title">The Friend</h1>
    </header>
  )
}

export default Header;
