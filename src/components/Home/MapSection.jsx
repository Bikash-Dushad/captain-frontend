import React, { useEffect, useRef } from 'react';

const MapSection = ({ location }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (location && window.google) {
      initializeMap();
    }
  }, [location]);

  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: location,
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: location,
      map: map,
      title: 'Your Location',
    });
  };

  return (
    <div className="map-section">
      <h3>Your Current Location</h3>
      <div ref={mapContainerRef} className="map-container" id="map"></div>
    </div>
  );
};

export default MapSection;