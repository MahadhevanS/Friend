import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [slides, setSlides] = useState([]);
  useEffect(() => {
      const savedMood = localStorage.getItem('chat_mood');
      console.log(savedMood)
      if (savedMood) {
        document.body.className = '';
        document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
      }
    }, []);
    
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('images')) || [];
    const today = new Date();

    const sameDay = [];
    const sameMonth = [];
    const sameWeek = [];

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    storedImages.forEach((img) => {
      const imgDate = new Date(img.date);
      if (imgDate > today) return;

      if (imgDate.getDate() === today.getDate() && imgDate.getMonth() === today.getMonth()) {
        sameDay.push(img);
      }

      if (imgDate.getMonth() === today.getMonth()) {
        sameMonth.push(img);
      }

      const imgDateCopy = new Date(imgDate);
      imgDateCopy.setFullYear(today.getFullYear());
      if (imgDateCopy >= startOfWeek && imgDateCopy <= endOfWeek) {
        sameWeek.push(img);
      }
    });

    const pickRandom = (arr, count) => {
      const shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const slidesList = [
      ...pickRandom(sameDay, 4).map((img) => ({ ...img, title: "🕰 On This Day" })),
      ...pickRandom(sameMonth, 4).map((img) => ({ ...img, title: "📆 This Month Memory" })),
      ...pickRandom(sameWeek, 4).map((img) => ({ ...img, title: "📂 This Week" })),
      ...pickRandom(storedImages, 4).map((img) => ({ ...img, title: "🎲 Random Throwback" })),
    ];

    setSlides(slidesList);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="home-container">
      <h2>📸 Today's Highlights</h2>
      {slides.length > 0 ? (
        <div className="slideshow">
          <img
            key={slides[currentSlide].url} 
            src={slides[currentSlide].url}
            alt="memory"
            className="slide-image"
          />
          <div className="caption">
            <h3>{slides[currentSlide].title}</h3>
            <p>{slides[currentSlide].momentName}</p>
          </div>
        </div>
      ) : (
        <p className="no-memories">No memories to show today.</p>
      )}
    </div>
  );
};

export default Home;
