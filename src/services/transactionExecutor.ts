import { type TransactionQueue } from './offlineStorage';

interface TransactionResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

// This function dispatches an event to trigger transaction execution in React component context
export async function executeQueuedTransaction(transaction: TransactionQueue): Promise<TransactionResult> {
  return new Promise((resolve) => {
    // Dispatch custom event that React components can listen to
    const event = new CustomEvent('execute-queued-transaction', {
      detail: {
        transaction,
        resolve
      }
    });

    window.dispatchEvent(event);

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
