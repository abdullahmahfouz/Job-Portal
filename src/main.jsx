import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.background = '#1a1a1a';
  document.body.style.background = '#1a1a1a';
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
