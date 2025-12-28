import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppKit, useAppKitState } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { HelpIcon, WalletNotConnectedMessage, WalletConnectionTimeoutMessage, UnsupportedWalletMessage, ButtonSpinner } from './ui';
import { useErrorHandler } from '../hooks/useErrorHandler';

export function ConnectWallet() {
  const { t } = useTranslation();
  const { open } = useAppKit();
  const { address, isConnected, isConnecting } = useAccount();
  const { selectedNetworkId } = useAppKitState();
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [showTimeoutError, setShowTimeoutError] = useState(false);
  const [showUnsupportedWalletError, setShowUnsupportedWalletError] = useState(false);
  const { 
    handleWalletError,
    handleConnectionTimeout
  } = useErrorHandler({
    onConnectWallet: () => open({ view: 'Connect' }),
    onRetry: () => {
      setShowTimeoutError(false);
      setShowConnectionError(false);
      setShowUnsupportedWalletError(false);
      open({ view: 'Connect' });
    },
    onContactSupport: () => {
      // This would open support contact modal
      console.log('Open support contact modal');
    },
  });

  const handleConnectClick = () => {
    setShowConnectionError(false);
    setShowTimeoutError(false);
    setShowUnsupportedWalletError(false);
    open({ view: 'Connect' });
    
    // Set a timeout to detect connection issues
    setTimeout(() => {
      if (!isConnected && !isConnecting) {
        setShowTimeoutError(true);
        handleConnectionTimeout(() => {
          setShowTimeoutError(false);
          handleConnectClick();
        });
      }
    }, 10000); // 10 second timeout
  };

  const handleConnectError = (errorType?: 'timeout' | 'unsupported' | 'general') => {
    switch (errorType) {
      case 'timeout':
        setShowTimeoutError(true);
        handleConnectionTimeout(() => {
          setShowTimeoutError(false);
          handleConnectClick();
        });
        break;
      case 'unsupported':
        setShowUnsupportedWalletError(true);
        break;
      default:
        setShowConnectionError(true);
        handleWalletError();
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex justify-end mb-8 space-x-2 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-600">
            {selectedNetworkId ? `${t('wallet.network')}: ${selectedNetworkId}` : ''}
          </span>
          <HelpIcon
            content="Current blockchain network you're connected to. Different networks may have different transaction costs."
            position="bottom"
            variant="subtle"
            size="sm"
          />
        </div>
        <button
          onClick={() => open({ view: 'Account' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium btn-crystal-secondary btn-glow-blue btn-ripple mobile-touch-target"
          title="View account details, transaction history, and disconnect wallet"
          aria-label={`View account details for ${address.slice(0, 6)}...${address.slice(-4)}`}
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        <button
          onClick={() => open({ view: 'Networks' })}
          className="bg-gray-600 hover:bg-gray-700 text-white px-2 sm:px-3 py-2 rounded-lg text-sm btn-crystal-utility btn-glow-gray btn-ripple mobile-touch-target"
          title="Switch to a different blockchain network for transactions"
          aria-label="Switch to a different blockchain network"
        >
          <span aria-hidden="true">🔗</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={handleConnectClick}
        disabled={isConnecting}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium btn-crystal-secondary btn-glow-blue btn-ripple mobile-touch-target ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Connect your crypto wallet to start using Crystal Stakes. Your wallet will store your HAPG tokens and handle transactions securely."
        aria-label={isConnecting ? "Connecting wallet" : "Connect wallet"}
      >
        {isConnecting ? (
          <div className="flex items-center justify-center">
            <ButtonSpinner />
            {t('wallet.connecting')}
          </div>
        ) : (
          t('wallet.connectWallet')
        )}
      </button>
      
      {/* Show error messages */}
      {showConnectionError && (
        <div className="flex justify-end" role="alert" aria-live="assertive">
          <WalletNotConnectedMessage onConnect={() => handleConnectError('general')} />
        </div>
      )}

      {showTimeoutError && (
        <div className="flex justify-end" role="alert" aria-live="assertive">
          <WalletConnectionTimeoutMessage onRetry={() => handleConnectError('timeout')} />
        </div>
      )}

      {showUnsupportedWalletError && (
        <div className="flex justify-end" role="alert" aria-live="assertive">
          <UnsupportedWalletMessage
            supportedWallets={['MetaMask', 'WalletConnect', 'Coinbase Wallet']}
            onGetSupportedWallets={() => {
              // This would open a modal with supported wallets
              console.log('Open supported wallets modal');
            }}
          />
        </div>
      )}
    </div>
  );
}
