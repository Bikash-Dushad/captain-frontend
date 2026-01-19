import React, { useState, useEffect } from "react";
import Map from "./Map";
import Navbar from "./Navbar";
import useWebSocket from "../../hooks/useWebSocket";
import "./Home.css";

const Home = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });
  const {
    isConnected,
    isAuthenticated,
    connectionError,
    connectWebSocket,
    disconnectWebSocket,
  } = useWebSocket();
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

    if (!navigator.geolocation) {
      setError("Location permission is required");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude)
        setLocation({ lat: latitude, lng: longitude });
        setHasStarted(true);
        connectWebSocket(token);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setError("Location permission denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError("Location information unavailable");
        } else if (error.code === error.TIMEOUT) {
          setError("Location request timed out");
        } else {
          setError("An unknown error occurred");
        }
      },
    );
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
