import React from 'react';
import { motion } from 'framer-motion';

export interface ErrorMessageProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

// Error icons
const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const getIcon = (variant: 'error' | 'warning' | 'info') => {
  switch (variant) {
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    default:
      return <ErrorIcon />;
  }
};

const getVariantStyles = (variant: 'error' | 'warning' | 'info') => {
  switch (variant) {
    case 'error':
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-400',
        button: 'text-red-700 hover:text-red-900 hover:bg-red-100',
      };
    case 'warning':
      return {
        container: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: 'text-amber-400',
        button: 'text-amber-700 hover:text-amber-900 hover:bg-amber-100',
      };
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-400',
        button: 'text-blue-700 hover:text-blue-900 hover:bg-blue-100',
      };
    default:
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-400',
        button: 'text-red-700 hover:text-red-900 hover:bg-red-100',
      };
  }
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  action,
  variant = 'error',
  className = '',
}) => {
  const styles = getVariantStyles(variant);
  
  return (
    <motion.div
      className={`
        border rounded-lg p-4 mt-3 
        ${styles.container} 
        ${className}
      `}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {getIcon(variant)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">
            {title}
          </h4>
          
          {message && (
            <p className="text-sm opacity-90 mb-2">
              {message}
            </p>
          )}
          
          {action && (
            <button
              onClick={action.onClick}
              className={`
                text-sm font-medium px-3 py-1 rounded-md 
                transition-colors duration-200 
                ${styles.button}
              `}
              aria-label={`${action.label} action`}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Specific error message components for common use cases
export const WalletNotConnectedMessage: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
  <ErrorMessage
    title="Please connect your wallet to continue"
    message="You need to connect your crypto wallet to stake tokens and manage your positions."
    action={{
      label: "Connect Wallet",
      onClick: onConnect,
    }}
    variant="warning"
  />
);

export const InsufficientFundsMessage: React.FC<{ 
  available: string; 
  required: string;
  onGetTokens?: () => void;
}> = ({ available, required, onGetTokens }) => (
  <ErrorMessage
    title="You need more HAPG tokens to stake"
    message={`You have ${available} HAPG tokens available, but you need at least ${required} HAPG tokens to stake.`}
    action={onGetTokens ? {
      label: "Get More Tokens",
      onClick: onGetTokens,
    } : undefined}
    variant="error"
  />
);

export const NetworkErrorMessage: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorMessage
    title="Please check your internet connection"
    message="We're having trouble connecting to the blockchain. Please verify your internet connection and try again."
    action={onRetry ? {
      label: "Retry",
      onClick: onRetry,
    } : undefined}
    variant="warning"
  />
);

export const TransactionFailedMessage: React.FC<{ 
  onRetry?: () => void;
  onContactSupport?: () => void;
}> = ({ onRetry, onContactSupport }) => (
  <ErrorMessage
    title="Transaction failed, please try again"
    message="The blockchain transaction couldn't be completed. This might be due to network congestion or insufficient gas fees."
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry,
    } : onContactSupport ? {
      label: "Contact Support",
      onClick: onContactSupport,
    } : undefined}
    variant="error"
  />
);

export const MinimumAmountMessage: React.FC<{ 
  minimum: string; 
  onAdjust?: () => void;
}> = ({ minimum, onAdjust }) => (
  <ErrorMessage
    title={`Minimum stake amount is ${minimum} HAPG tokens`}
    message={`The minimum amount required to stake is ${minimum} HAPG tokens. Please enter a larger amount to continue.`}
    action={onAdjust ? {
      label: "Set Minimum Amount",
      onClick: onAdjust,
    } : undefined}
    variant="warning"
  />
);

export const NetworkSwitchMessage: React.FC<{ 
  currentNetwork: string; 
  requiredNetwork: string;
  onSwitch?: () => void;
}> = ({ currentNetwork, requiredNetwork, onSwitch }) => (
  <ErrorMessage
    title="Wrong Network"
    message={`You're currently connected to ${currentNetwork}, but this application requires ${requiredNetwork}. Please switch networks to continue.`}
    action={onSwitch ? {
      label: "Switch Network",
      onClick: onSwitch,
    } : undefined}
    variant="warning"
  />
);

export const NetworkSwitchFailedMessage: React.FC<{ 
  onRetry?: () => void;
  onSwitchManually?: () => void;
}> = ({ onRetry, onSwitchManually }) => (
  <ErrorMessage
    title="Network Switch Failed"
    message="We couldn't automatically switch your network. Please try again or switch manually in your wallet settings."
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry,
    } : onSwitchManually ? {
      label: "Switch Manually",
      onClick: onSwitchManually,
    } : undefined}
    variant="error"
  />
);

export const WalletConnectionTimeoutMessage: React.FC<{ 
  onRetry?: () => void;
}> = ({ onRetry }) => (
  <ErrorMessage
    title="Connection Timeout"
    message="The connection to your wallet is taking longer than expected. This might be due to network issues or wallet extension problems."
    action={onRetry ? {
      label: "Try Again",
      onClick: onRetry,
    } : undefined}
    variant="warning"
  />
);

export const GasEstimateMessage: React.FC<{ 
  estimated: string;
  onContinue?: () => void;
}> = ({ estimated, onContinue }) => (
  <ErrorMessage
    title="High Gas Fee Detected"
    message={`The estimated gas fee for this transaction is ${estimated}. This is higher than usual. You can proceed if you accept the cost, or cancel to try later.`}
    action={onContinue ? {
      label: "Continue Anyway",
      onClick: onContinue,
    } : undefined}
    variant="warning"
  />
);

export const UnsupportedWalletMessage: React.FC<{ 
  supportedWallets: string[];
  onGetSupportedWallets?: () => void;
}> = ({ supportedWallets, onGetSupportedWallets }) => (
  <ErrorMessage
    title="Unsupported Wallet"
    message={`This wallet isn't fully supported. Please use one of these wallets: ${supportedWallets.join(', ')} for the best experience.`}
    action={onGetSupportedWallets ? {
      label: "View Supported Wallets",
      onClick: onGetSupportedWallets,
    } : undefined}
    variant="warning"
  />
);