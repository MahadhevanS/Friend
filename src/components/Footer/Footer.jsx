import React, {useEffect} from 'react';
import './Footer.css';

function Footer() {
  useEffect(() => {
    const savedMood = localStorage.getItem('chat_mood');
    if (savedMood){
      document.body.className = '';
      document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
    }
  },[]);

  return (
    <footer className="footer-container">
    <div>  Made with ❤️ by you | <a href="#">About</a> | <a href="#">Contact</a></div>
    </footer>
  )
}

export default Footer;
