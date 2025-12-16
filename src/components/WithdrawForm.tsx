import { useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';
import { 
  Tooltip, 
  HelpIcon, 
  InfoCard, 
  ErrorMessage,
  InsufficientFundsMessage,
  TransactionFailedMessage,
  EnhancedInput
} from './ui';
import { useErrorHandler } from '../hooks/useErrorHandler';

export function WithdrawForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [showInsufficientStakedError, setShowInsufficientStakedError] = useState(false);
  const [showTransactionError, setShowTransactionError] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const { showSuccess } = useNotification();
  const { 
    handleTransactionError,
    handleInsufficientStakedAmount
  } = useErrorHandler({
    onRetry: () => {
      setShowTransactionError(false);
      setShowNetworkError(false);
      handleWithdraw();
    },
    onContactSupport: () => {
      // This would open support contact modal
      console.log('Open support contact modal');
    },
  });

  // Check user's staked amount
  const { data: userInfo } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'userInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: [bigint, bigint, bigint, bigint] | undefined };

  const { writeContractAsync: withdraw, data: withdrawTxHash } = useWriteContract();

  const { isLoading: isWithdrawLoading } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  });

  const handleWithdraw = async () => {
    if (!amount || !address) return;

    // Reset error states
    setShowInsufficientStakedError(false);
    setShowTransactionError(false);
    setShowNetworkError(false);

    // Check if user has sufficient staked amount
    const withdrawAmount = ethers.parseEther(amount);
    const stakedAmount = userInfo ? userInfo[0] : BigInt(0);

    if (withdrawAmount > stakedAmount) {
      const availableAmount = parseFloat(ethers.formatEther(stakedAmount)).toFixed(2);
      const requiredAmount = parseFloat(amount).toFixed(2);
      setShowInsufficientStakedError(true);
      handleInsufficientStakedAmount(`${availableAmount} HAPG`, `${requiredAmount} HAPG`);
      return;
    }

    try {
      await withdraw({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'withdraw',
        args: [withdrawAmount],
      });

      setAmount('');
      showSuccess('Withdrawal Successful!', `Successfully withdrew ${amount} HAPG tokens!`);
    } catch (error: unknown) {
      console.error('Withdraw failed:', error);
      
      // Enhanced error handling with specific error types
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
      
      if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        setShowNetworkError(true);
        handleTransactionError(error, () => {
          setShowNetworkError(false);
          handleWithdraw();
        });
      } else {
        setShowTransactionError(true);
        handleTransactionError(error, () => {
          setShowTransactionError(false);
          handleWithdraw();
        });
      }
    }
  };

  const stakedAmount = userInfo ? userInfo[0] : BigInt(0);

  return (
    <div className="space-y-4">
      {/* Withdrawal Information */}
      <InfoCard
        title="Understanding Withdrawals"
        description={
          <div className="space-y-2">
            <p>Withdraw allows you to retrieve your staked HAPG tokens from the protocol.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Process:</strong> Get your staked tokens back to your wallet</p>
              <p>• <strong>Timing:</strong> Withdrawals are processed immediately</p>
              <p>• <strong>Gas Fees:</strong> Estimated 0.001-0.003 ETH for transaction</p>
              <p>• <strong>Rewards:</strong> Any unclaimed rewards will remain in the protocol</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
              <p className="text-xs text-blue-700 font-medium">💡 Tip: Consider claiming rewards before withdrawing to maximize your earnings.</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="You can withdraw any amount up to your total staked tokens. Remember to claim any earned rewards first."
        collapsible={true}
        defaultExpanded={false}
      />

      {/* Staked Amount Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Staked Amount:</span> {parseFloat(ethers.formatEther(stakedAmount)).toFixed(2)} HAPG tokens
        </p>
      </div>

      {/* Error Messages */}
      {showInsufficientStakedError && (
        <ErrorMessage
          title="Insufficient Staked Amount"
          message={`You have ${parseFloat(ethers.formatEther(stakedAmount)).toFixed(2)} HAPG tokens staked, but you're trying to withdraw ${parseFloat(amount).toFixed(2)} HAPG tokens.`}
          action={{
            label: "Set Maximum Amount",
            onClick: () => {
              setAmount(ethers.formatEther(stakedAmount));
              setShowInsufficientStakedError(false);
            },
          }}
          variant="error"
        />
      )}

      {showTransactionError && (
        <ErrorMessage
          title="Withdrawal failed, please try again"
          message="The blockchain transaction couldn't be completed. This might be due to network congestion or insufficient gas fees."
          action={{
            label: "Try Again",
            onClick: () => {
              setShowTransactionError(false);
              handleWithdraw();
            },
          }}
          variant="error"
        />
      )}

      <div>
        <EnhancedInput
          label="Amount to Withdraw"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            // Clear error messages when user starts typing
            if (showInsufficientStakedError || showTransactionError || showNetworkError) {
              setShowInsufficientStakedError(false);
              setShowTransactionError(false);
              setShowNetworkError(false);
            }
          }}
          placeholder="0.00"
          max={ethers.formatEther(stakedAmount)}
          disabled={isWithdrawLoading}
          variant="crystal"
          size="lg"
          helpText="Enter the amount of HAPG tokens you want to withdraw from staking. You can withdraw up to your total staked amount."
          error={
            showInsufficientStakedError
              ? `You only have ${parseFloat(ethers.formatEther(stakedAmount)).toFixed(2)} HAPG tokens staked`
              : showTransactionError
              ? "Transaction failed. Please try again."
              : showNetworkError
              ? "Network error. Please check your connection."
              : undefined
          }
          success={
            amount && parseFloat(amount) > 0 && ethers.parseEther(amount || '0') <= stakedAmount
              ? true
              : undefined
          }
        />
      </div>
      <Tooltip content="Get your staked tokens back">
        <button
          onClick={handleWithdraw}
          disabled={!address || !amount || isWithdrawLoading || ethers.parseEther(amount || '0') > stakedAmount}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500/30 btn-crystal-primary btn-glow-blue btn-ripple shadow-crystal"
        >
          {isWithdrawLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Withdrawing...
            </div>
          ) : (
            'Withdraw Tokens'
          )}
        </button>
      </Tooltip>
    </div>
  );
}
