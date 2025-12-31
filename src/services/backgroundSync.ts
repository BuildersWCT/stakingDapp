import { offlineStorage, type TransactionQueue } from './offlineStorage';

interface SyncResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

class BackgroundSyncService {
  private syncInProgress = false;
  private maxRetries = 3;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSync();
  }

  private initializeSync() {
    // Listen for online event to trigger sync
    window.addEventListener('online', () => {
      console.log('Connection restored, triggering background sync...');
      this.triggerSync();
    });

    // Listen for custom sync event
    window.addEventListener('pwa-online-sync', () => {
      this.triggerSync();
    });

    // Periodic sync check (every 5 minutes)
    this.syncInterval = setInterval(() => {
      this.checkAndSync();
    }, 5 * 60 * 1000);

    // Initial sync check after a delay
    setTimeout(() => {
      this.checkAndSync();
    }, 2000);
  }

  private async checkAndSync() {
    if (navigator.onLine && !this.syncInProgress) {
      await this.triggerSync();
    }
  }

  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) {
      return;
    }

    this.syncInProgress = true;
    console.log('Starting background sync...');

    try {
      const queue = offlineStorage.getTransactionQueue();
      console.log(`Found ${queue.length} transactions to sync`);

      for (const transaction of queue) {
        await this.processTransaction(transaction);
      }
    } catch (error) {
      console.error('Background sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Register background sync when queuing transactions
  async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-transactions');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Failed to register background sync:', error);
      }
    }
  }

  private async processTransaction(transaction: TransactionQueue): Promise<void> {
    try {
      const result = await this.executeTransaction(transaction);
      
      if (result.success) {
        console.log(`Transaction ${transaction.id} synced successfully`);
        offlineStorage.removeFromTransactionQueue(transaction.id);
        
        // Dispatch success event
        window.dispatchEvent(new CustomEvent('pwa-transaction-synced', {
          detail: { transactionId: transaction.id, success: true }
        }));
      } else {
        throw new Error(result.error || 'Unknown sync error');
      }
    } catch (error) {
      console.error(`Failed to sync transaction ${transaction.id}:`, error);
      
      // Update retry count
      const newRetryCount = transaction.retryCount + 1;
      
      if (newRetryCount >= this.maxRetries) {
        console.log(`Transaction ${transaction.id} exceeded max retries, removing from queue`);
        offlineStorage.removeFromTransactionQueue(transaction.id);
        
        // Dispatch failure event
        window.dispatchEvent(new CustomEvent('pwa-transaction-failed', {
          detail: { 
            transactionId: transaction.id, 
            error: error instanceof Error ? error.message : 'Unknown error',
            retries: newRetryCount
          }
        }));
      } else {
        offlineStorage.updateTransactionRetryCount(transaction.id);
        
        // Dispatch retry event
        window.dispatchEvent(new CustomEvent('pwa-transaction-retry', {
          detail: { 
            transactionId: transaction.id, 
            retryCount: newRetryCount,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }));
      }
    }
  }

  private async executeTransaction(transaction: TransactionQueue): Promise<SyncResult> {
    // Simulate transaction execution - replace with actual blockchain calls
    switch (transaction.type) {
      case 'stake':
        return await this.executeStakeTransaction(transaction);
      case 'unstake':
        return await this.executeUnstakeTransaction(transaction);
      case 'claim':
        return await this.executeClaimTransaction(transaction);
      default:
        throw new Error(`Unknown transaction type: ${transaction.type}`);
    }
  }

  private async executeStakeTransaction(transaction: TransactionQueue): Promise<SyncResult> {
    // Simulate API call to stake tokens
    try {
      const { amount, address } = transaction.data;
      
      // In a real implementation, this would call your staking contract
      console.log(`Executing stake transaction: ${amount} tokens for ${address}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success (90% success rate for demo)
      if (Math.random() > 0.1) {
        return { success: true, transactionId: transaction.id };
      } else {
        throw new Error('Stake transaction failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Stake failed'
      };
    }
  }

  private async executeUnstakeTransaction(transaction: TransactionQueue): Promise<SyncResult> {
    // Simulate API call to unstake tokens
    try {
      const { amount, address } = transaction.data;
      
      console.log(`Executing unstake transaction: ${amount} tokens for ${address}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success (85% success rate for demo)
      if (Math.random() > 0.15) {
        return { success: true, transactionId: transaction.id };
      } else {
        throw new Error('Unstake transaction failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Unstake failed'
      };
    }
  }

  private async executeClaimTransaction(transaction: TransactionQueue): Promise<SyncResult> {
    // Simulate API call to claim rewards
    try {
      const { address } = transaction.data;
      
      console.log(`Executing claim transaction for ${address}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate success (95% success rate for demo)
      if (Math.random() > 0.05) {
        return { success: true, transactionId: transaction.id };
      } else {
        throw new Error('Claim transaction failed');
      }
    } catch (error) {
      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Claim failed'
      };
    }
  }

  // Cleanup method
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Create singleton instance
export const backgroundSync = new BackgroundSyncService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    backgroundSync.destroy();
  });
}