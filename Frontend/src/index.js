import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";  // 🆕 Add Redux Provider
import { PersistGate } from 'redux-persist/integration/react'; // 🆕 Add PersistGate
import { store, persistor } from "./redux/store";  // 🆕 Import store
import App from "./App";
import "./styles/Login.css";
import { SocketProvider } from "./ContextApi/SocketContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>  {/* 🆕 Wrap with Redux Provider */}
    <PersistGate loading={null} persistor={persistor}>  {/* 🆕 Add PersistGate */}
      <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);