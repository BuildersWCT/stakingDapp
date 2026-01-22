import { offlineStorage, type TransactionQueue } from './offlineStorage';

// Service Worker type declarations
// Service Worker type declarations
declare const self: ServiceWorkerGlobalScope;

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

declare global {
  interface ServiceWorkerRegistration {
    sync: SyncManager;
  }
}

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
    // Background sync registration is handled by the offlineStorage service
    // when transactions are queued while offline
    console.log('Background sync registration requested');
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
    // Send message to main thread to execute the transaction
    // Since service worker can't access wallet, we delegate to main thread
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      return new Promise((resolve) => {
        const messageId = `tx_${Date.now()}_${Math.random()}`;

        // Listen for response from main thread
        const messageHandler = (event: any) => {
          if (event.data && event.data.type === 'transaction-result' && event.data.messageId === messageId) {
            self.removeEventListener('message', messageHandler);
            resolve(event.data.result);
          }
        };

        self.addEventListener('message', messageHandler as any);

      // Timeout after 60 seconds
      setTimeout(() => {
        resolve({
          success: false,
          transactionId: transaction.id,
          error: 'Transaction execution timeout'
        });
      }, 60000);
    });
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