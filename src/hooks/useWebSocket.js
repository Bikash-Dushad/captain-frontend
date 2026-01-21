import { useState, useCallback, useRef, useEffect } from "react";
import io from "socket.io-client";

const hasMovedEnough = (prev, next) => {
  if (prev.lat === null || prev.lng === null) return true;

  const distance =
    Math.abs(prev.lat - next.lat) + Math.abs(prev.lng - next.lng);

  return distance > 0.00005; // ~5 meters
};

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const lastLocationRef = useRef({ lat: null, lng: null });
  const watchIdRef = useRef(null);

  // Connect WebSocket
  const connectWebSocket = useCallback(
    (token) => {
      const wsUrl = "http://localhost:3003";

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

      const newSocket = io(wsUrl, {
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("✅ WebSocket connected:", newSocket.id);
        setIsConnected(true);
        setConnectionError(null);

        // Start watching location
        if (!watchIdRef.current && navigator.geolocation) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const nextLocation = {
                lat: latitude,
                lng: longitude,
              };
              if (hasMovedEnough(lastLocationRef.current, nextLocation)) {
                lastLocationRef.current = nextLocation;

                setRiderLocation(nextLocation);

                newSocket.emit("LOCATION_UPDATE", nextLocation);
              }
            },
            (err) => {
              console.error("❌ Location error:", err);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 1000,
              timeout: 5000,
            },
          );
        }
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        setIsConnected(false);

        // Stop watching location on disconnect
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ WebSocket connect error:", err.message);
        setConnectionError(err.message);
      });

      setSocket(newSocket);
    },
    [socket],
  );

  // 2️⃣ Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
  }, [socket]);

  // 3️⃣ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [socket]);

  return {
    socket,
    isConnected,
    connectionError,
    riderLocation,
    connectWebSocket,
    disconnectWebSocket,
  };
};

export default useWebSocket;
