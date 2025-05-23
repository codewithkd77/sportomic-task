import React, { useState, useEffect } from 'react';
import './SplashScreen.css';
import SportsAnimation from './SportsAnimation';

function SplashScreen() {
  const [currentSport, setCurrentSport] = useState('football');
  const sports = ['football', 'cricket', 'tennis', 'basketball', 'badminton', 'gym'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSport(prev => {
        const currentIndex = sports.indexOf(prev);
        const nextIndex = (currentIndex + 1) % sports.length;
        return sports[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [sports]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="animation-wrapper">
          <SportsAnimation sport={currentSport} />
        </div>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
}

export default SplashScreen; 