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
    connectWebSocket,
    disconnectWebSocket,
    nearbyCaptains,
    fetchNearbyCaptains,
    getLocationAndFetchCaptains,
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

  useEffect(() => {
    if (hasStarted && isConnected) {
      // Get user's current location and fetch captains
      getLocationAndFetchCaptains();

      // Set up interval to update captains periodically
      const intervalId = setInterval(() => {
        getLocationAndFetchCaptains();
      }, 5000); // Update every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [hasStarted, isConnected, getLocationAndFetchCaptains]);

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
            {/* Display nearby captains list */}
            <div className="captains-list">
              <h4>Nearby Captains ({nearbyCaptains.length})</h4>
              {error && <p className="error-message">{error}</p>}

              {nearbyCaptains.length === 0 ? (
                <p className="no-captains">No captains found nearby</p>
              ) : (
                <div className="captains-grid">
                  {nearbyCaptains.map((captain) => (
                    <div key={captain.id} className="captain-card">
                      <div className="captain-info">
                        <h5>Captain ID: {captain.id.substring(0, 8)}...</h5>
                        <div className="captain-location">
                          <span>📍 Location:</span>
                          <p>Lat: {captain.lat.toFixed(6)}</p>
                          <p>Lng: {captain.lng.toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
