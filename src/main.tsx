import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@reown/appkit/styles.css";
import "./styles/appkit.css";
import "./styles/button-animations.css";
import App from "./App.tsx";
import { Providers } from "./components/Providers.tsx";

// Initialize PWA services
import './services/backgroundSync';
import { pushNotifications } from './services/pushNotifications';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Request notification permission on app start
pushNotifications.requestPermission();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
