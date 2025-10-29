import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // ✅ Use Vite env variable or fallback to localhost for dev
    const backendURL =
      import.meta.env.VITE_BACKEND_URL ||
      process.env.REACT_APP_BACKEND_URL ||
      "http://localhost:5000";

    console.log("🔗 Connecting to socket at:", backendURL);

    const newSocket = io(backendURL, {
      withCredentials: true,
      transports: ["websocket"], // ✅ ensure real-time connection (not polling)
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
