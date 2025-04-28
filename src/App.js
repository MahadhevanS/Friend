import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import './styles.css';
import Home from './pages/Home/Home';
import Reminders from './pages/Reminders/Reminders';
import Chatbot from './pages/Chatbot/Chatbot';
import Memories from './pages/Memories/Memories';

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const currentMood = localStorage.getItem('chat_mood');
    if (!currentMood) return;

    const moodTracks = {
      happy: '/audio/happy.mp3',
      calm: '/audio/calm.mp3',
      nostalgic: '/audio/nostalgic.mp3',
      sad: '/audio/sad.mp3',
      // Add more moods if needed
    };

    const track = moodTracks[currentMood.toLowerCase()];
    if (!track) return;

    const bgMusic = new Audio(track);
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(err => console.warn('Auto-play blocked:', err));

    audioRef.current = bgMusic;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const savedMood = localStorage.getItem('chat_mood');
    console.log(savedMood)
    if (savedMood) {
      document.body.className = '';
      document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
    }
  }, []); 

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/memories" element={<Memories />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
