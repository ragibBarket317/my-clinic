import React, { useState, useEffect } from 'react';

const ImageSlider = ({ imageNames, autoPlayInterval = 3000, imageWidth, imageHeight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = imageNames.map((imageName) => `${imageName}`);
  const totalSlides = images.length;


  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoPlayInterval]);


  return (
    <div className="image-slider relative">
      
      <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="w-full" style={{ width: imageWidth, height: imageHeight }}/>
      
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div key={index} className={`w-3 h-3 rounded-full bg-white ${index === currentIndex ? 'bg-blue-500' : 'bg-white'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;