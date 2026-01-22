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
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(false);

  useEffect(() => {
    // Service worker registration check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker registered:', registration);
        setOfflineReady(true);

        // Show install banner after service worker is ready and some delay
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setTimeout(() => {
            setShowInstallBanner(true);
          }, 3000); // Show after 3 seconds
        }
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
      setShowInstallBanner(false); // Hide banner when native prompt shows
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

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    setInstallDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleBannerInstall = async () => {
    if (!deferredPrompt) {
      // Manual install instructions for browsers without beforeinstallprompt
      alert('To install Crystal Stakes:\n1. Click the share button in your browser\n2. Select "Add to Home Screen"\n3. Follow the prompts');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed from banner');
      setShowInstallBanner(false);
    } else {
      console.log('PWA installation dismissed from banner');
    }

    setDeferredPrompt(null);
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

  if (showInstallBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <p className="font-semibold">Install Crystal Stakes</p>
              <p className="text-sm opacity-90">Works offline, faster loading, native experience</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleBannerInstall}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Install
            </button>
            <button
              onClick={dismissInstallBanner}
              className="text-white hover:text-gray-200 px-2 transition-colors"
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