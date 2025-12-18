import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MeetingProvider } from "./context/MeetingContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <AuthProvider>
      <MeetingProvider>
        <App />
      </MeetingProvider>
    </AuthProvider>
    </Provider>
  </React.StrictMode>
);
