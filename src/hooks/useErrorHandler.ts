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
  | 'network_switch_failed'
  | 'connection_timeout'
  | 'high_gas_fee'
  | 'unsupported_wallet'
  | 'insufficient_staked_amount'
  | 'withdrawal_failed'
  | 'staking_failed'
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
  network_switch_failed: {
    type: 'network_switch_failed',
    title: 'Network Switch Failed',
    message: 'Could not switch network automatically',
    userMessage: 'We couldn\'t automatically switch your network. Please try again or switch manually in your wallet settings.',
  },
  connection_timeout: {
    type: 'connection_timeout',
    title: 'Connection Timeout',
    message: 'Wallet connection is taking too long',
    userMessage: 'The connection to your wallet is taking longer than expected. This might be due to network issues or wallet extension problems.',
  },
  high_gas_fee: {
    type: 'high_gas_fee',
    title: 'High Gas Fee',
    message: 'Gas fee estimate is unusually high',
    userMessage: 'The estimated gas fee is higher than usual. You can proceed if you accept the cost, or try again later when fees are lower.',
  },
  unsupported_wallet: {
    type: 'unsupported_wallet',
    title: 'Unsupported Wallet',
    message: 'Current wallet is not fully supported',
    userMessage: 'This wallet isn\'t fully supported. Please use MetaMask, WalletConnect, or another supported wallet for the best experience.',
  },
  insufficient_staked_amount: {
    type: 'insufficient_staked_amount',
    title: 'Insufficient Staked Amount',
    message: 'Not enough tokens are staked',
    userMessage: 'You don\'t have enough HAPG tokens staked to withdraw this amount. Please check your staked balance and try again.',
  },
  withdrawal_failed: {
    type: 'withdrawal_failed',
    title: 'Withdrawal Failed',
    message: 'Could not process withdrawal',
    userMessage: 'The withdrawal transaction failed. Please check your staked amount and try again, or contact support if the issue persists.',
  },
  staking_failed: {
    type: 'staking_failed',
    title: 'Staking Failed',
    message: 'Could not process staking',
    userMessage: 'The staking transaction failed. Please check your token balance and try again, or contact support if the issue persists.',
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
  network_switch_failed: 'Try Again',
  connection_timeout: 'Retry Connection',
  high_gas_fee: 'Continue Anyway',
  unsupported_wallet: 'Get Supported Wallets',
  insufficient_staked_amount: 'Set Maximum',
  withdrawal_failed: 'Try Again',
  staking_failed: 'Try Again',
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
    
    // Network switch errors
    if (errorMessage.includes('switch') && errorMessage.includes('network')) {
      return 'network_switch_failed';
    }
    
    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'connection_timeout';
    }
    
    // High gas fee
    if (errorMessage.includes('high') && errorMessage.includes('gas')) {
      return 'high_gas_fee';
    }
    
    // Unsupported wallet
    if (errorMessage.includes('unsupported') || errorMessage.includes('not supported')) {
      return 'unsupported_wallet';
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

  const handleNetworkSwitchError = useCallback((onRetry?: () => void, onSwitchManually?: () => void) => {
    showError(
      'Network Switch Failed',
      'We couldn\'t automatically switch your network. Please try again or switch manually in your wallet settings.',
    );
    
    if (onRetry) {
      setTimeout(onRetry, 2000);
    }
  }, [showError]);

  const handleConnectionTimeout = useCallback((onRetry?: () => void) => {
    showWarning(
      'Connection Timeout',
      'The connection to your wallet is taking longer than expected. This might be due to network issues or wallet extension problems.',
    );
    
    if (onRetry) {
      setTimeout(onRetry, 3000);
    }
  }, [showWarning]);

  const handleInsufficientStakedAmount = useCallback((available: string, required: string) => {
    showError(
      'Insufficient Staked Amount',
      `You have ${available} HAPG tokens staked, but you're trying to withdraw ${required} tokens. Please check your staked balance.`,
    );
  }, [showError]);

  // Create actionable error messages for UI components
  const createErrorMessage = useCallback((errorType: ErrorType) => {
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
      case 'network_switch_failed':
      case 'connection_timeout':
      case 'withdrawal_failed':
      case 'staking_failed':
        actionHandler = options.onRetry;
        break;
      case 'network_mismatch':
        actionHandler = options.onSwitchNetwork;
        break;
      case 'high_gas_fee':
        actionHandler = options.onRetry;
        break;
      case 'unsupported_wallet':
        actionHandler = options.onContactSupport;
        break;
      case 'insufficient_staked_amount':
        actionHandler = options.onRetry;
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
    handleNetworkSwitchError,
    handleConnectionTimeout,
    handleInsufficientStakedAmount,
    parseError,
    createErrorMessage,
  };
};