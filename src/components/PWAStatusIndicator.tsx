import React from 'react';
import { useOfflineMode } from '../hooks/useOfflineMode';

export const PWAStatusIndicator: React.FC = () => {
  const { isOffline, transactionQueue, isOnline } = useOfflineMode();

  if (isOnline && transactionQueue.length === 0) {
    return null; // Don't show anything when online and no pending transactions
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Offline Status Indicator */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">📱 Offline Mode</span>
          <span className="text-xs opacity-90">Transactions will be queued</span>
        </div>
      )}

      {/* Transaction Queue Indicator */}
      {transactionQueue.length > 0 && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            ⏳ {transactionQueue.length} queued transaction{transactionQueue.length !== 1 ? 's' : ''}
          </span>
          {isOnline && (
            <span className="text-xs opacity-90">(syncing...)</span>
          )}
        </div>
      )}

      {/* Success/Error Messages */}
      <div className="space-y-2">
        {/* Additional status messages can be added here */}
      </div>
    </div>
  );
};