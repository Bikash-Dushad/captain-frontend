import { useState, useCallback, useRef } from "react";
import io from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const locationIntervalRef = useRef(null);
  const [nearbyCaptains, setNearbyCaptains] = useState([]);

  // Connect WebSocket
  const connectWebSocket = useCallback(
    (token) => {
      const WS_URL = "http://localhost:3003";

      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }

      if (!token) {
        console.error("Token required for WebSocket connection");
        setConnectionError("No authentication token");
        return;
      }

      const newSocket = io(WS_URL, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
      });
      newSocket.on("connect_error", (err) => {
        console.error("❌ WebSocket connect error:", err.message);
        setConnectionError(err.message);
      });

      newSocket.on("connect", () => {
        console.log("WebSocket Connected:", newSocket.id);
        setIsConnected(true);
        setConnectionError(null);
        locationIntervalRef.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              newSocket.emit("LOCATION_UPDATE", {
                lat: latitude,
                lng: longitude,
              });
            },
            (err) => console.error("Location error:", err),
            { enableHighAccuracy: true },
          );
        }, 2000);
      });

      newSocket.on("NEARBY_CAPTAINS", (captains) => {
        setNearbyCaptains(captains);
      });

      newSocket.on("disconnect", () => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);
        if (locationIntervalRef.current) {
          clearInterval(locationIntervalRef.current);
          locationIntervalRef.current = null;
        }
      });

      setSocket(newSocket);
    },
    [socket],
  );

  // Function to fetch nearby captains with user's location
  const fetchNearbyCaptains = useCallback(
    (lat, lng) => {
      if (!socket || !isConnected) {
        console.error("Socket not connected");
        return;
      }

      socket.emit("USER_LOCATION", {
        lat: lat,
        lng: lng,
      });
      console.log("Requesting nearby captains for location:", lat, lng);
    },
    [socket, isConnected],
  );

  // Helper function to get current location and fetch captains
  const getLocationAndFetchCaptains = useCallback(() => {
    if (!socket || !isConnected) {
      console.error("Socket not connected");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyCaptains(latitude, longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        // You might want to handle this error in your UI
      },
      { enableHighAccuracy: true },
    );
  }, [socket, isConnected, fetchNearbyCaptains]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    connectionError,
    connectWebSocket,
    disconnectWebSocket,
    nearbyCaptains,
    fetchNearbyCaptains, // Send specific location to server
    getLocationAndFetchCaptains, // Get current location and fetch captains
  };
};

export default useWebSocket;
