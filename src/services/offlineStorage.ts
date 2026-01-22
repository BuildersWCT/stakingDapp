export interface StakingData {
  address: string;
  stakedAmount: string;
  rewards: string;
  stakingPosition?: {
    amount: string;
    stakingTime: number;
    rewards: string;
  }[];
  lastUpdated: number;
}

export interface TransactionQueue {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'approve';
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

class OfflineStorageService {
  private readonly STAKING_DATA_KEY = 'crystal_stakes_staking_data';
  private readonly TRANSACTION_QUEUE_KEY = 'crystal_stakes_transaction_queue';
  private readonly OFFLINE_STATUS_KEY = 'crystal_stakes_offline_status';

  // Staking Data Management
  saveStakingData(data: StakingData): void {
    try {
      const serialized = JSON.stringify({
        ...data,
        lastUpdated: Date.now()
      });
      localStorage.setItem(this.STAKING_DATA_KEY, serialized);
    } catch (error) {
      console.error('Failed to save staking data:', error);
    }
  }

  getStakingData(): StakingData | null {
    try {
      const stored = localStorage.getItem(this.STAKING_DATA_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      // Check if data is not older than 24 hours
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (Date.now() - data.lastUpdated > twentyFourHours) {
        console.log('Staking data is stale, clearing...');
        this.clearStakingData();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to retrieve staking data:', error);
      return null;
    }
  }

  clearStakingData(): void {
    localStorage.removeItem(this.STAKING_DATA_KEY);
  }

  // Transaction Queue Management
  addToTransactionQueue(transaction: Omit<TransactionQueue, 'id' | 'timestamp' | 'retryCount'>): string {
    const queueItem: TransactionQueue = {
      ...transaction,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0
    };

    try {
      const queue = this.getTransactionQueue();
      queue.push(queueItem);
      localStorage.setItem(this.TRANSACTION_QUEUE_KEY, JSON.stringify(queue));

      // Register background sync for offline transactions
      if (!navigator.onLine) {
        this.registerBackgroundSync();
      }

      return queueItem.id;
    } catch (error) {
      console.error('Failed to add transaction to queue:', error);
      throw error;
    }
  }

  private async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-transactions');
        console.log('Background sync registered for offline transactions');
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    }
  }

  getTransactionQueue(): TransactionQueue[] {
    try {
      const stored = localStorage.getItem(this.TRANSACTION_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve transaction queue:', error);
      return [];
    }
  }

  removeFromTransactionQueue(id: string): void {
    try {
      const queue = this.getTransactionQueue();
      const filtered = queue.filter(item => item.id !== id);
      localStorage.setItem(this.TRANSACTION_QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove transaction from queue:', error);
    }
  }

  updateTransactionRetryCount(id: string): void {
    try {
      const queue = this.getTransactionQueue();
      const item = queue.find(item => item.id === id);
      if (item) {
        item.retryCount += 1;
        localStorage.setItem(this.TRANSACTION_QUEUE_KEY, JSON.stringify(queue));
      }
    } catch (error) {
      console.error('Failed to update transaction retry count:', error);
    }
  }

  clearTransactionQueue(): void {
    localStorage.removeItem(this.TRANSACTION_QUEUE_KEY);
  }

  // Offline Status Management
  setOfflineStatus(isOffline: boolean): void {
    try {
      localStorage.setItem(this.OFFLINE_STATUS_KEY, JSON.stringify({
        isOffline,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to save offline status:', error);
    }
  }

  getOfflineStatus(): { isOffline: boolean; timestamp: number } | null {
    try {
      const stored = localStorage.getItem(this.OFFLINE_STATUS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve offline status:', error);
      return null;
    }
  }

  // Utility Methods
  private generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Data cleanup for storage management
  cleanupOldData(): void {
    try {
      const queue = this.getTransactionQueue();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * twentyFourHours;

      // Clean old transactions (older than 24 hours)
      const recentTransactions = queue.filter(
        item => Date.now() - item.timestamp < twentyFourHours
      );

      if (recentTransactions.length !== queue.length) {
        localStorage.setItem(this.TRANSACTION_QUEUE_KEY, JSON.stringify(recentTransactions));
      }

      // Clean old staking data (older than 1 week)
      const stakingData = this.getStakingData();
      if (stakingData && Date.now() - stakingData.lastUpdated > oneWeek) {
        this.clearStakingData();
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }
}

export const offlineStorage = new OfflineStorageService();