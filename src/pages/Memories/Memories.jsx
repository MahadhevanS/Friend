import React, { useState, useEffect } from 'react';
import './Memories.css';

const Memories = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [momentName, setMomentName] = useState('');
  const [momentInput, setMomentInput] = useState('');
  const [currentMomentImages, setCurrentMomentImages] = useState([]);

  useEffect(() => {
      const savedMood = localStorage.getItem('chat_mood');
      console.log(savedMood)
      if (savedMood) {
        document.body.className = '';
        document.body.classList.add(`${savedMood.toLowerCase()}-theme`);
      }
    }, []);
    
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('images')) || [];
    setImages(savedImages);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (imageFile && momentName) {
      const newImage = {
        url: imageFile,
        date: new Date().toISOString(),
        momentName: momentName,
      };
      setCurrentMomentImages((prevImages) => [...prevImages, newImage]);
      setImageFile(null);
    }
  };

  const handleMomentComplete = () => {
    if (currentMomentImages.length > 0) {
      const updatedImages = [...images, ...currentMomentImages];
      setImages(updatedImages);
      localStorage.setItem('images', JSON.stringify(updatedImages)); // 🔥 immediate save
      setCurrentMomentImages([]);
      setMomentName('');
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, idx) => idx !== indexToDelete);
    setImages(updatedImages);
    localStorage.setItem('images', JSON.stringify(updatedImages)); // 🔥 also update after delete
  };

  const getUniqueMoments = () => {
    const moments = images.map((image) => image.momentName);
    return [...new Set(moments)];
  };

  const getMomentImages = (moment) => {
    return images.filter((image) => image.momentName === moment);
  };

  const getMomentThumbnails = (moment) => {
    const momentImages = getMomentImages(moment);
    return momentImages.length > 0 ? momentImages[0].url : '';
  };

  return (
    <div className="memories-container">
      <h2>🖼️ Memories</h2>

      <div className="upload-section">
        {momentName ? (
          <p><strong>Current Moment: {momentName}</strong></p>
        ) : (
          <input
            type="text"
            placeholder="Enter Moment Name"
            value={momentInput}
            onChange={(e) => setMomentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setMomentName(momentInput.trim());
                setMomentInput('');
              }
            }}
            autoFocus
          />
        )}

        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          disabled={!momentName}
        />

        <button onClick={handleUpload} disabled={!imageFile || !momentName}>
          Upload Image
        </button>

        {currentMomentImages.length > 0 && (
          <button
            onClick={handleMomentComplete}
            className="complete-btn"
          >
            Complete Moment
          </button>
        )}
      </div>

      <div className="moments-section">
        {getUniqueMoments().map((moment, idx) => (
          <div key={idx} className="moment-group">
            <h3>{moment}</h3>
            <div className="moment-images">
              <img
                src={getMomentThumbnails(moment)}
                alt={moment}
                className="moment-thumbnail"
                onClick={() => handleImageClick(getMomentImages(moment)[0])}
              />
              <p>{getMomentImages(moment).length} Photos</p>
            </div>
          </div>
        ))}
      </div>

      <div className="image-grid">
        {images.length > 0 ? (
          images.map((image, idx) => (
            <div key={idx} className="image-item">
              <img src={image.url} alt="Memory" onClick={() => handleImageClick(image)} />
              <div className="image-date">{new Date(image.date).toLocaleString()}</div>
              <button
                className="delete-button"
                onClick={() => handleDeleteImage(idx)}
              >
                ❌ Delete
              </button>
            </div>
          ))
        ) : (
          <p>No memories uploaded yet!</p>
        )}
      </div>

      {selectedImage && (
        <div className="image-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={selectedImage.url} alt="Selected Memory" />
            <p>{new Date(selectedImage.date).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memories;
