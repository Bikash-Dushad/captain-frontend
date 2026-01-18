import { useState, useCallback } from "react";
import io from "socket.io-client";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (socket) return;

    const WS_URL = import.meta.env.WEBSOCKET_URL;

    const newSocket = io(WS_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("WebSocket Connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    });

    setSocket(newSocket);
  }, [socket]);

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
    connectWebSocket,
    disconnectWebSocket,
  };
};

export default useWebSocket;
