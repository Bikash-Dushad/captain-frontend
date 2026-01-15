import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import MapSection from "./MapSection";
import "./Home.css";

const HomePage = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  const [ws, setWs] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize Google Maps when online and location is available
  useEffect(() => {
    if (isOnline && location && !mapRef.current) {
      initMap();
    }
  }, [isOnline, location]);

  const initMap = () => {
    if (typeof google === "undefined") {
      loadGoogleMapsScript();
      return;
    }

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    mapRef.current = new google.maps.Map(mapElement, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 15,
      disableDefaultUI: false,
      zoomControl: true,
    });

    markerRef.current = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapRef.current,
      title: "Your Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });
  };

  const loadGoogleMapsScript = () => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    document.head.appendChild(script);
  };

  const handleStartEarning = () => {
    setIsOnline(true);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location (e.g., Delhi)
          setLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    } else {
      // Fallback location (Delhi)
      setLocation({ lat: 28.6139, lng: 77.209 });
    }

    // Initialize WebSocket
    // Uncomment when backend is ready
    // const websocket = new WebSocket('ws://localhost:3001');
    // websocket.onopen = () => console.log('WebSocket connected');
    // websocket.onmessage = (event) => console.log('Message:', event.data);
    // websocket.onerror = (error) => console.error('WebSocket error:', error);
    // setWs(websocket);

    console.log("WebSocket would be initialized here");
  };

  const handleStopEarning = () => {
    setIsOnline(false);
    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  return (
    <div className="home-page">
      <Navbar isOnline={isOnline} />

      <main className="home-main">
        {!isOnline ? (
          <HeroSection onStartEarning={handleStartEarning} />
        ) : (
          <div className="online-content">
            <div className="online-header">
              <div className="status-indicator">
                <div className="status-dot online"></div>
                <span className="status-text">You're Online</span>
              </div>
              <button onClick={handleStopEarning} className="stop-earning-btn">
                Stop Earning
              </button>
            </div>

            <MapSection location={location} />

            {/* Placeholder for future content */}
            <div className="additional-info">
              <h3>Additional Information</h3>
              <p>Content to be decided...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
