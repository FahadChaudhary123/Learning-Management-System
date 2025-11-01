// frontend/contextApi/SocketProvider.js
import React, { createContext } from "react";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={null}>
      {children}
    </SocketContext.Provider>
  );
};
