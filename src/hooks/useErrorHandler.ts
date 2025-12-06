import { useCallback } from 'react';
import { useNotification } from '../components/NotificationProvider';

// Error types for better categorization
export type ErrorType = 
  | 'wallet_not_connected'
  | 'insufficient_funds'
  | 'network_error'
  | 'transaction_failed'
  | 'minimum_amount'
  | 'network_mismatch'
  | 'user_rejected'
  | 'gas_too_low'
  | 'contract_error'
  | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  title: string;
  message: string;
  userMessage: string;
  actionLabel?: string;
  shouldNotify: boolean;
}

// Error message templates
const ERROR_MESSAGES: Record<ErrorType, Omit<ErrorInfo, 'shouldNotify'>> = {
  wallet_not_connected: {
    type: 'wallet_not_connected',
    title: 'Wallet Not Connected',
    message: 'Please connect your wallet to continue',
    userMessage: 'You need to connect your crypto wallet to perform this action. Click "Connect Wallet" to get started.',
  },
  insufficient_funds: {
    type: 'insufficient_funds',
    title: 'Insufficient Funds',
    message: 'You need more HAPG tokens to perform this action',
    userMessage: 'You don\'t have enough HAPG tokens to complete this transaction. You may need to acquire more tokens or reduce the amount.',
  },
  network_error: {
    type: 'network_error',
    title: 'Network Connection Error',
    message: 'Please check your internet connection',
    userMessage: 'We\'re having trouble connecting to the blockchain. Please check your internet connection and try again.',
  },
  transaction_failed: {
    type: 'transaction_failed',
    title: 'Transaction Failed',
    message: 'Transaction failed, please try again',
    userMessage: 'The blockchain transaction couldn\'t be completed. This might be due to network congestion, insufficient gas fees, or contract issues.',
  },
  minimum_amount: {
    type: 'minimum_amount',
    title: 'Amount Too Small',
    message: 'Amount is below minimum required',
    userMessage: 'The amount you entered is below the minimum required for this action. Please increase the amount and try again.',
  },
  network_mismatch: {
    type: 'network_mismatch',
    title: 'Wrong Network',
    message: 'Please switch to the correct network',
    userMessage: 'You\'re connected to the wrong blockchain network. Please switch to the supported network to continue.',
  },
  user_rejected: {
    type: 'user_rejected',
    title: 'Transaction Cancelled',
    message: 'You cancelled the transaction',
    userMessage: 'You cancelled the transaction in your wallet. You can try again whenever you\'re ready.',
  },
  gas_too_low: {
    type: 'gas_too_low',
    title: 'Gas Fee Too Low',
    message: 'Please increase gas fee',
    userMessage: 'The gas fee is too low for this transaction. Please try again with a higher gas fee.',
  },
  contract_error: {
    type: 'contract_error',
    title: 'Smart Contract Error',
    message: 'Contract interaction failed',
    userMessage: 'There was an issue with the smart contract. This might be due to contract state or parameters.',
  },
  unknown: {
    type: 'unknown',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred',
    userMessage: 'An unexpected error occurred. Please try again, and if the problem persists, contact support.',
  },
};

// Action labels for different error types
const ACTION_LABELS: Record<ErrorType, string | undefined> = {
  wallet_not_connected: 'Connect Wallet',
  insufficient_funds: 'Get More Tokens',
  network_error: 'Retry',
  transaction_failed: 'Try Again',
  minimum_amount: 'Set Minimum',
  network_mismatch: 'Switch Network',
  user_rejected: 'Try Again',
  gas_too_low: 'Retry with Higher Gas',
  contract_error: 'Try Again',
  unknown: 'Try Again',
};

interface UseErrorHandlerOptions {
  onRetry?: () => void;
  onConnectWallet?: () => void;
  onGetTokens?: () => void;
  onSwitchNetwork?: () => void;
  onContactSupport?: () => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { showError, showWarning } = useNotification();

  // Parse error to determine type
  const parseError = useCallback((error: unknown): ErrorType => {
    if (!error) return 'unknown';
    
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    
    // Wallet connection errors
    if (errorMessage.includes('not connected') || errorMessage.includes('no wallet')) {
      return 'wallet_not_connected';
    }
    
    // Insufficient funds errors
    if (errorMessage.includes('insufficient') || errorMessage.includes('not enough')) {
      return 'insufficient_funds';
    }
    
    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('fetch')) {
      return 'network_error';
    }
    
    // User rejected
    if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
      return 'user_rejected';
    }
    
    // Gas related
    if (errorMessage.includes('gas') || errorMessage.includes('underpriced')) {
      return 'gas_too_low';
    }
    
    // Contract errors
    if (errorMessage.includes('contract') || errorMessage.includes('execution reverted')) {
      return 'contract_error';
    }
    
    return 'unknown';
  }, []);

  // Handle different error types
  const handleError = useCallback((error: unknown, context?: string) => {
    const errorType = parseError(error);
    const errorTemplate = ERROR_MESSAGES[errorType];
    
    // Show user-friendly error message
    showError(
      errorTemplate.title,
      errorTemplate.userMessage
    );
    
    // Log technical details for debugging
    console.error(`Error in ${context || 'application'}:`, {
      type: errorType,
      message: errorTemplate.message,
      technical: error,
    });
    
    return errorType;
  }, [parseError, showError]);

  // Handle specific error scenarios with actions
  const handleWalletError = useCallback(() => {
    showWarning(
      'Wallet Required',
      'Please connect your wallet to continue with this action.',
    );
  }, [showWarning]);

  const handleInsufficientFunds = useCallback((available: string, required: string) => {
    showError(
      'Insufficient Balance',
      `You have ${available} HAPG tokens available, but you need ${required} tokens for this action.`,
    );
  }, [showError]);

  const handleNetworkError = useCallback((onRetry?: () => void) => {
    showError(
      'Connection Error',
      'Please check your internet connection and try again.',
    );
    
    // Optional retry functionality
    if (onRetry) {
      setTimeout(onRetry, 1000);
    }
  }, [showError]);

  const handleTransactionError = useCallback((error: unknown, onRetry?: () => void) => {
    const errorType = parseError(error);
    
    if (errorType === 'user_rejected') {
      showWarning(
        'Transaction Cancelled',
        'You cancelled the transaction. You can try again whenever you\'re ready.',
      );
    } else if (errorType === 'gas_too_low') {
      showError(
        'Gas Fee Too Low',
        'Please try again with a higher gas fee to ensure your transaction processes quickly.',
      );
    } else {
      showError(
        'Transaction Failed',
        'The transaction couldn\'t be completed. Please try again or contact support if the issue persists.',
      );
    }
    
    if (onRetry && errorType !== 'user_rejected') {
      setTimeout(onRetry, 2000);
    }
  }, [parseError, showError, showWarning]);

  // Create actionable error messages for UI components
  const createErrorMessage = useCallback((errorType: ErrorType, context?: any) => {
    const template = ERROR_MESSAGES[errorType];
    const actionLabel = ACTION_LABELS[errorType];
    
    let actionHandler: (() => void) | undefined;
    
    switch (errorType) {
      case 'wallet_not_connected':
        actionHandler = options.onConnectWallet;
        break;
      case 'insufficient_funds':
        actionHandler = options.onGetTokens;
        break;
      case 'network_error':
      case 'transaction_failed':
      case 'user_rejected':
        actionHandler = options.onRetry;
        break;
      case 'network_mismatch':
        actionHandler = options.onSwitchNetwork;
        break;
      default:
        actionHandler = options.onRetry;
    }
    
    return {
      title: template.title,
      message: template.userMessage,
      action: actionLabel && actionHandler ? {
        label: actionLabel,
        onClick: actionHandler,
      } : undefined,
      variant: errorType === 'wallet_not_connected' || errorType === 'minimum_amount' ? 'warning' : 'error' as const,
    };
  }, [options]);

  return {
    handleError,
    handleWalletError,
    handleInsufficientFunds,
    handleNetworkError,
    handleTransactionError,
    parseError,
    createErrorMessage,
  };
};