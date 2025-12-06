import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAService: React.FC = () => {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Service worker registration check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker registered:', registration);
        setOfflineReady(true);
      }).catch((error) => {
        console.error('Service Worker registration error:', error);
      });
    }

    // Install prompt handler
    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    } else {
      console.log('PWA installation dismissed');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (offlineReady) {
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <span>✅</span>
          <span>App ready to work offline</span>
          <button
            onClick={close}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (needRefresh) {
    return (
      <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <span>🔄</span>
          <span>New content available, click to refresh</span>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100"
          >
            Refresh
          </button>
          <button
            onClick={close}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-purple-500 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>📱</span>
            <div>
              <p className="font-semibold">Install Crystal Stakes</p>
              <p className="text-sm opacity-90">Add to home screen for quick access</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="bg-white text-purple-500 px-4 py-2 rounded hover:bg-gray-100 font-medium"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-white hover:text-gray-200 px-2"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};