import React, { createContext, useEffect, useRef } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws");

    socketRef.current.onopen = () => console.log("WebSocket connected");
    socketRef.current.onclose = () => console.log("WebSocket disconnected");

    return () => socketRef.current.close();
  }, []);

  const sendMessage = (msg) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
