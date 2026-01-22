import { useState } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI, testTokenAddress, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';
import {
  Tooltip,
  InfoCard,
  MinimumAmountMessage,
  InsufficientFundsMessage,
  TransactionFailedMessage,
  NetworkSwitchFailedMessage,
  GasEstimateMessage,
  EnhancedInput,
  ButtonSpinner
} from './ui';
import { StepIndicator, stakingSteps, ProgressBar, TransactionProgressBar, SkeletonLoader } from './ui';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useOfflineMode } from '../hooks/useOfflineMode';
import { pushNotifications } from '../services/pushNotifications';

export function StakeForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'staking'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [showMinimumAmountError, setShowMinimumAmountError] = useState(false);
  const [showInsufficientFundsError, setShowInsufficientFundsError] = useState(false);
  const [showTransactionError, setShowTransactionError] = useState(false);
  const [showNetworkSwitchError, setShowNetworkSwitchError] = useState(false);
  const [showGasFeeWarning, setShowGasFeeWarning] = useState(false);
  const [estimatedGasFee, setEstimatedGasFee] = useState('');

  const { showSuccess, showStaking, showTransaction } = useNotification();
  const { isOffline, addToTransactionQueue } = useOfflineMode();

  const {
    handleInsufficientFunds,
    handleTransactionError,
    handleNetworkSwitchError
  } = useErrorHandler({
    onRetry: () => {
      setShowTransactionError(false);
      setShowNetworkSwitchError(false);
      handleStake();
    },
    onGetTokens: () => {
      // This would open a modal or redirect to get tokens
      console.log('Open get tokens modal');
    },
    onSwitchNetwork: () => {
      setShowNetworkSwitchError(false);
      // This would open network switch modal
      console.log('Open network switch modal');
    },
  });

  // Use the test token address directly
  const stakingToken = testTokenAddress;

  // Check user's token balance with loading state
  const { data: userBalance, isLoading: isBalanceLoading } = useReadContract({
    address: stakingToken,
    abi: testTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: bigint | undefined; isLoading: boolean };

  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: stake } = useWriteContract();

  const handleStake = async () => {
    if (!amount || !stakingToken || !address) return;

    // Reset error states
    setShowMinimumAmountError(false);
    setShowInsufficientFundsError(false);
    setShowTransactionError(false);
    setShowNetworkSwitchError(false);
    setShowGasFeeWarning(false);

    // Check minimum stake amount
    const stakeAmountNum = parseFloat(amount);
    if (stakeAmountNum < 50) {
      setShowMinimumAmountError(true);
      return;
    }

    // Check if user has sufficient balance
    const stakeAmount = ethers.parseEther(amount);
    if (!userBalance || userBalance < stakeAmount) {
      const availableAmount = userBalance ? parseFloat(ethers.formatEther(userBalance)).toFixed(2) : '0.00';
      const requiredAmount = parseFloat(amount).toFixed(2);
      setShowInsufficientFundsError(true);
      handleInsufficientFunds(`${availableAmount} HAPG`, `${requiredAmount} HAPG`);
      return;
    }

    // Handle offline mode - queue approval and stake transactions
    if (isOffline) {
      try {
        // Queue approval transaction first
        const approveId = addToTransactionQueue({
          type: 'approve',
          data: {
            amount: stakeAmount.toString(),
            stakingToken: stakingToken,
            spender: stakingContractAddress
          }
        });

        // Queue stake transaction
        const stakeId = addToTransactionQueue({
          type: 'stake',
          data: {
            amount: amount,
            address: address,
            stakingToken: stakingToken,
            stakeAmount: stakeAmount.toString()
          }
        });

        // Show notification for queued transactions
        await pushNotifications.notifyTransactionQueued('stake', amount);

        setAmount('');
        showSuccess('Transactions Queued!', `Approval and staking of ${amount} HAPG tokens will be processed when you're back online. Approval ID: ${approveId}, Stake ID: ${stakeId}`);
        return;
      } catch (error) {
        console.error('Failed to queue transactions:', error);
        setShowTransactionError(true);
        handleTransactionError(error, () => {
          setShowTransactionError(false);
          handleStake();
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      setStep('approving');

      // First, approve the contract to spend the token
      await approve({
        address: stakingToken as `0x${string}`,
        abi: testTokenABI,
        functionName: 'approve',
        args: [stakingContractAddress, stakeAmount],
      });

      showTransaction('Token Approval Confirmed', 'Your token approval has been confirmed on the blockchain.');

      setStep('staking');

      // Then, stake after approval is confirmed
      await stake({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'stake',
        args: [stakeAmount],
      });

      setStep('idle');
      setIsLoading(false);
      setAmount('');
      showStaking('Staking Successful!', `Successfully staked ${amount} HAPG tokens! Your rewards will start accumulating immediately.`);

    } catch (error: unknown) {
      console.error('Transaction failed:', error);
      setStep('idle');
      setIsLoading(false);

      // Enhanced error handling with specific error types
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

      if (errorMessage.includes('network') && errorMessage.includes('switch')) {
        setShowNetworkSwitchError(true);
        handleNetworkSwitchError(() => {
          setShowNetworkSwitchError(false);
          handleStake();
        });
      } else if (errorMessage.includes('gas') && errorMessage.includes('too low')) {
        setShowGasFeeWarning(true);
        setEstimatedGasFee('0.005 ETH');
      } else {
        setShowTransactionError(true);
        handleTransactionError(error, () => {
          setShowTransactionError(false);
          handleStake();
        });
      }
    }
  };

  // Get step indicator data
  const steps = stakingSteps(step);

  return (
    <div className="space-y-4" role="form" aria-label="Staking form">
      {/* Staking Explanation */}
      <InfoCard
        title="Understanding Staking"
        description={
          <div className="space-y-2">
            <p>Staking is the process of locking your HAPG tokens in the protocol to earn rewards over time.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Rewards:</strong> Earn passive income through protocol fees</p>
              <p>• <strong>Lock Period:</strong> Tokens are locked until withdrawn</p>
              <p>• <strong>Minimum:</strong> 50 HAPG tokens required to stake</p>
              <p>• <strong>Gas Fees:</strong> Estimated 0.001-0.003 ETH for transactions</p>
            </div>
            <div className="border rounded-lg p-2 mt-2" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'var(--crystal-accent-amber)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--crystal-accent-amber)' }}>⚠️ Safety Warning: Only stake what you can afford to lock up. Large amounts should be staked carefully.</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="Staking helps secure the protocol and provides liquidity. Learn more about DeFi staking risks in our documentation."
        collapsible={true}
        defaultExpanded={true}
      />

      {/* Progress Step Indicator */}
      {isLoading && (
        <div className="crystal-glass rounded-2xl p-4" role="status" aria-live="polite" aria-label="Staking progress">
          <StepIndicator
            steps={steps}
            variant="horizontal"
            size="md"
            showConnectors={true}
          />
        </div>
      )}

      {/* Transaction Progress Bar */}
      {isLoading && (
        <TransactionProgressBar
          status={step === 'approving' ? 'confirming' : 'processing'}
          message={step === 'approving' ? 'Confirming token approval...' : 'Staking your tokens...'}
        />
      )}

      {/* Balance Display */}
      {isBalanceLoading ? (
        <div className="border rounded-2xl p-4 crystal-glass">
          <SkeletonLoader variant="text" width="60%" />
        </div>
      ) : userBalance ? (
        <div className="border rounded-2xl p-4 crystal-glass">
          <p className="text-sm" style={{ color: 'var(--crystal-accent-blue)' }}>
            <span className="font-medium">Available Balance:</span> {parseFloat(ethers.formatEther(userBalance)).toFixed(2)} HAPG tokens
          </p>
        </div>
      ) : null}

      {/* Error Messages */}
      {showMinimumAmountError && (
        <div role="alert" aria-live="assertive">
          <MinimumAmountMessage
            minimum="50 HAPG"
            onAdjust={() => {
              setAmount('50');
              setShowMinimumAmountError(false);
            }}
          />
        </div>
      )}

      {showInsufficientFundsError && userBalance && (
        <div role="alert" aria-live="assertive">
          <InsufficientFundsMessage
            available={`${parseFloat(ethers.formatEther(userBalance)).toFixed(2)} HAPG`}
            required={`${parseFloat(amount).toFixed(2)} HAPG`}
            onGetTokens={() => {
              // This would open a modal or redirect to get tokens
              console.log('Open get tokens modal');
            }}
          />
        </div>
      )}

      {showTransactionError && (
        <div role="alert" aria-live="assertive">
          <TransactionFailedMessage
            onRetry={() => {
              setShowTransactionError(false);
              handleStake();
            }}
            onContactSupport={() => {
              // This would open support contact modal
              console.log('Open support contact modal');
            }}
          />
        </div>
      )}

      {showNetworkSwitchError && (
        <div role="alert" aria-live="assertive">
          <NetworkSwitchFailedMessage
            onRetry={() => {
              setShowNetworkSwitchError(false);
              handleStake();
            }}
            onSwitchManually={() => {
              // This would open manual network switch instructions
              console.log('Open manual network switch instructions');
            }}
          />
        </div>
      )}

      {showGasFeeWarning && (
        <div role="alert" aria-live="assertive">
          <GasEstimateMessage
            estimated={estimatedGasFee}
            onContinue={() => {
              setShowGasFeeWarning(false);
              handleStake();
            }}
          />
        </div>
      )}

      <div>
        <EnhancedInput
          label="Amount to Stake (Minimum: 50 HAPG)"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            // Clear error messages when user starts typing
            if (showMinimumAmountError || showInsufficientFundsError || showTransactionError || showNetworkSwitchError || showGasFeeWarning) {
              setShowMinimumAmountError(false);
              setShowInsufficientFundsError(false);
              setShowTransactionError(false);
              setShowNetworkSwitchError(false);
              setShowGasFeeWarning(false);
            }
          }}
          placeholder="50.00"
          min="50"
          disabled={isLoading}
          variant="crystal"
          size="lg"
          helpText="Enter the amount of HAPG tokens you want to stake. The minimum amount is 50 tokens. Higher amounts may earn more rewards proportionally."
          error={
            showMinimumAmountError
              ? "Minimum stake amount is 50 HAPG tokens"
              : showInsufficientFundsError
                ? `Insufficient balance. You have ${userBalance ? parseFloat(ethers.formatEther(userBalance)).toFixed(2) : '0.00'} HAPG tokens`
                : undefined
          }
          success={
            amount && parseFloat(amount) >= 50 && userBalance && ethers.parseEther(amount || '0') <= userBalance
              ? true
              : undefined
          }
        />

        {/* Progress bar for stake amount validation */}
        {amount && (
          <div className="mt-3">
            <ProgressBar
              value={Math.min((parseFloat(amount) / 1000) * 100, 100)}
              label={`${parseFloat(amount || '0').toFixed(2)} HAPG tokens`}
              variant={parseFloat(amount) >= 50 ? 'success' : 'warning'}
              size="sm"
              showPercentage={false}
            />
          </div>
        )}
      </div>

      {/* Offline Mode Indicator */}
      {isOffline && (
        <div className="border rounded-2xl p-4 crystal-glass">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium" style={{ color: 'var(--crystal-accent-amber)' }}>
              📱 Offline Mode: Transactions will be queued
            </p>
          </div>
        </div>
      )}

      <Tooltip content={isLoading ? 'Transaction in progress...' : isOffline ? 'Transaction will be queued for later' : 'Earn rewards by locking your tokens'}>
        <button
          onClick={handleStake}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === 'Enter' && !e.defaultPrevented) {
              e.preventDefault();
              handleStake();
            }
          }}
          disabled={!address || !amount || step !== 'idle' || !userBalance || ethers.parseEther(amount || '0') > userBalance || parseFloat(amount || '0') < 50 || isLoading}
          className={`w-full btn-crystal-success btn-glow-emerald btn-ripple mobile-touch-target ${isLoading ? 'opacity-75' : ''}`}
          aria-label={isLoading ? (step === 'approving' ? 'Approving token for staking' : 'Staking tokens in progress') : 'Stake tokens to earn rewards'}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <ButtonSpinner color="white" />
              {step === 'approving' ? 'Approving Token...' : 'Staking Tokens...'}
            </div>
          ) : isOffline ? (
            'Queue Stake Transaction'
          ) : (
            'Stake Tokens'
          )}
        </button>
      </Tooltip>
    </div>
  );
}
