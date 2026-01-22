import { useState, useEffect, useCallback } from 'react';
import { offlineStorage, type StakingData, type TransactionQueue } from '../services/offlineStorage';

interface UseOfflineModeReturn {
  isOffline: boolean;
  stakingData: StakingData | null;
  transactionQueue: TransactionQueue[];
  saveStakingData: (data: StakingData) => void;
  clearStakingData: () => void;
  addToTransactionQueue: (transaction: Omit<TransactionQueue, 'id' | 'timestamp' | 'retryCount'>) => string;
  removeFromTransactionQueue: (id: string) => void;
  updateTransactionRetryCount: (id: string) => void;
  clearTransactionQueue: () => void;
  cleanupOldData: () => void;
  isOnline: boolean;
}

export const useOfflineMode = (): UseOfflineModeReturn => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [transactionQueue, setTransactionQueue] = useState<TransactionQueue[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      offlineStorage.setOfflineStatus(false);
      // Trigger sync when coming back online
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pwa-online-sync'));
      }, 1000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      offlineStorage.setOfflineStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status
    offlineStorage.setOfflineStatus(isOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data on mount and when coming online
  useEffect(() => {
    loadStakingData();
    loadTransactionQueue();
  }, []);

  const loadStakingData = useCallback(() => {
    const data = offlineStorage.getStakingData();
    setStakingData(data);
  }, []);

  const loadTransactionQueue = useCallback(() => {
    const queue = offlineStorage.getTransactionQueue();
    setTransactionQueue(queue);
  }, []);

  const saveStakingData = useCallback((data: StakingData) => {
    offlineStorage.saveStakingData(data);
    setStakingData(data);
  }, []);

  const clearStakingData = useCallback(() => {
    offlineStorage.clearStakingData();
    setStakingData(null);
  }, []);

  const addToTransactionQueue = useCallback((transaction: Omit<TransactionQueue, 'id' | 'timestamp' | 'retryCount'>) => {
    const id = offlineStorage.addToTransactionQueue(transaction);
    loadTransactionQueue(); // Refresh the queue
    return id;
  }, [loadTransactionQueue]);

  const removeFromTransactionQueue = useCallback((id: string) => {
    offlineStorage.removeFromTransactionQueue(id);
    loadTransactionQueue(); // Refresh the queue
  }, [loadTransactionQueue]);

  const updateTransactionRetryCount = useCallback((id: string) => {
    offlineStorage.updateTransactionRetryCount(id);
    loadTransactionQueue(); // Refresh the queue
  }, [loadTransactionQueue]);

  const clearTransactionQueue = useCallback(() => {
    offlineStorage.clearTransactionQueue();
    setTransactionQueue([]);
  }, []);

  const cleanupOldData = useCallback(() => {
    offlineStorage.cleanupOldData();
    loadStakingData();
    loadTransactionQueue();
  }, [loadStakingData, loadTransactionQueue]);

  // Auto cleanup on mount and periodically
  useEffect(() => {
    cleanupOldData();
    const interval = setInterval(cleanupOldData, 24 * 60 * 60 * 1000); // Daily cleanup
    return () => clearInterval(interval);
  }, [cleanupOldData]);

  return {
    isOffline,
    stakingData,
    transactionQueue,
    saveStakingData,
    clearStakingData,
    addToTransactionQueue,
    removeFromTransactionQueue,
    updateTransactionRetryCount,
    clearTransactionQueue,
    cleanupOldData,
    isOnline: !isOffline
  };
};