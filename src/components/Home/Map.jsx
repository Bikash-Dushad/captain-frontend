import React, { useEffect, useRef } from 'react';
import './Map.css';

const Map = ({ location }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        
        script.onload = () => {
          initializeMap();
        };
        
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      // Clear previous map
      if (window.mapInstance) {
        window.mapInstance.remove();
      }

      // Create map
      window.mapInstance = window.L.map(mapRef.current).setView(
        [location.lat, location.lng], 
        13
      );

      // Add tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(window.mapInstance);

      // Add marker
      window.L.marker([location.lat, location.lng])
        .addTo(window.mapInstance)
        .bindPopup(`Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
        .openPopup();
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }
    };
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (window.mapInstance && window.L) {
      window.mapInstance.setView([location.lat, location.lng], 13);
    }
  }, [location]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-canvas" />
    </div>
  );
};

export default Map;