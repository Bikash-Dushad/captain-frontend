import React from 'react';

const HeroSection = ({ onStartEarning }) => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h2>Ready to start earning?</h2>
        <p>Click the button below to go online and start accepting rides</p>
        <button
          onClick={onStartEarning}
          className="start-earning-btn"
        >
          Start Earning
        </button>
      </div>
    </div>
  );
};

export default HeroSection;