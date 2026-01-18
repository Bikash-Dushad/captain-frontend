import React, { useState } from "react";
import Map from "./Map";
import Navbar from "./Navbar";
import useWebSocket from "../../hooks/useWebSocket";
import "./Home.css";

const Home = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });
  const { isConnected, connectWebSocket, disconnectWebSocket } = useWebSocket();

  const handleStart = async () => {
    connectWebSocket();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setHasStarted(true);
        },
        (error) => {
          console.error("Location error:", error);
          setHasStarted(true);
        },
      );
    } else {
      setHasStarted(true);
    }
  };

  const handleStop = () => {
    disconnectWebSocket();
    setHasStarted(false);
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        {!hasStarted ? (
          <div className="start-section">
            <h2>Ready to Start?</h2>
            <button className="start-button" onClick={handleStart}>
              Start
            </button>
            <p className="status-text">
              WebSocket: {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        ) : (
          <div className="map-section">
            <div className="map-header">
              <h3>Live Location</h3>
              <div className="status-info">
                <span
                  className={`status-dot ${isConnected ? "connected" : "disconnected"}`}
                ></span>
                <span>
                  WebSocket: {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <Map location={location} />

            <div className="controls">
              <button className="stop-button" onClick={handleStop}>
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
