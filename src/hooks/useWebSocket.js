import { useState, useCallback } from "react";
import io from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Connect WebSocket
  const connectWebSocket = useCallback(
    (token) => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setIsAuthenticated(false);
      }

      console.log("checkig something 1");

      if (!token) {
        console.error("Token required for WebSocket connection");
        setConnectionError("No authentication token");
        return;
      }

      const WS_URL = "http://localhost:3003";
      console.log("🔗 Connecting to WebSocket:", WS_URL);
      console.log("📋 Using token:", token.substring(0, 20) + "...");

      const newSocket = io(WS_URL, {
        transports: ["websocket"],
        auth: {
          token: token,
        },
      });

      newSocket.on("connect", () => {
        console.log("WebSocket Connected:", newSocket.id);
        setIsConnected(true);
        setConnectionError(null);
      });

      newSocket.on("disconnect", () => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);
      });

      setSocket(newSocket);
    },
    [socket],
  );

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
    isAuthenticated,
    connectionError,
    connectWebSocket,
    disconnectWebSocket,
  };
};

export default useWebSocket;
