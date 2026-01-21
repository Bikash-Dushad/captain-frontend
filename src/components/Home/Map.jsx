import React, { useEffect, useRef } from "react";
import "./Map.css";

const Map = ({ riderLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      if (window.mapInstance) window.mapInstance.remove();

      window.mapInstance = window.L.map(mapRef.current).setView(
        [riderLocation.lat, riderLocation.lng],
        15
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(window.mapInstance);

      // Add marker
      const riderMarker = window.L.marker([riderLocation.lat, riderLocation.lng], {
        icon: window.L.icon({
          iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          iconSize: [32, 32],
        }),
      }).addTo(window.mapInstance);

      markerRef.current = riderMarker;
    };

    loadLeaflet();

    return () => {
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }
    };
  }, []);

  // Update marker when riderLocation changes
  useEffect(() => {
    if (window.L && window.mapInstance && markerRef.current && riderLocation) {
      markerRef.current.setLatLng([riderLocation.lat, riderLocation.lng]);
      window.mapInstance.setView([riderLocation.lat, riderLocation.lng]);
    }
  }, [riderLocation]);

  return <div className="map-container" ref={mapRef} />;
};

export default Map;
