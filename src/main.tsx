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

// Listen for service worker messages
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'trigger-background-sync') {
      // Import and trigger background sync
      import('./services/backgroundSync').then(({ backgroundSync }) => {
        backgroundSync.triggerSync();
      });
    } else if (event.data && event.data.type === 'execute-queued-transaction') {
      // Handle queued transaction execution
      const { transaction, messageId } = event.data;

      // Import transaction execution logic
      import('./services/transactionExecutor').then(async ({ executeQueuedTransaction }) => {
        try {
          const result = await executeQueuedTransaction(transaction);
          // Send result back to service worker
          event.ports[0]?.postMessage({
            type: 'transaction-result',
            messageId,
            result
          });
        } catch (error) {
          // Send error back to service worker
          event.ports[0]?.postMessage({
            type: 'transaction-result',
            messageId,
            result: {
              success: false,
              transactionId: transaction.id,
              error: error instanceof Error ? error.message : 'Transaction execution failed'
            }
          });
        }
      });
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
