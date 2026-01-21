import React, { useState, useEffect } from "react";
import Map from "./Map";
import Navbar from "./Navbar";
import useWebSocket from "../../hooks/useWebSocket";
import "./Home.css";

const Home = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const { isConnected, connectWebSocket, riderLocation, disconnectWebSocket } =
    useWebSocket();
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("captainToken");
    if (authToken) {
      setToken(authToken);
    } else {
      setError("No authentication token found. Please login first.");
    }
  }, []);

  const handleStart = async () => {
    setError(null);
    setHasStarted(true);
    connectWebSocket(token);
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
              Status: {isConnected ? "Connected" : "Disconnected"}
            </p>
            {error && <p className="error-text">{error}</p>}
          </div>
        ) : (
          <div className="map-section">
            <div className="map-header">
              <h3>Live Location</h3>
              <div className="status-info">
                <span
                  className={`status-dot ${isConnected ? "connected" : "disconnected"}`}
                ></span>
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>

            {!riderLocation ? (
              <p>Fetching your location...</p>
            ) : (
              <Map riderLocation={riderLocation} />
            )}

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
