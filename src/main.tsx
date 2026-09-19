import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "../design/_ds/nocturne-4c471785-2541-4499-9f02-478487a1a07f/styles.css";
import "./app.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Offline support. Refused in sandboxed frames and on plain http:// origins —
// the app runs the same either way, so a failure here is not worth reporting.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => {
    navigator.serviceWorker
      .register(new URL("sw.js", location.href), { scope: "./" })
      .catch(() => {});
  });
}
