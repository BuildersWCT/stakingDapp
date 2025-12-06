import { useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';
import { Tooltip, InfoCard } from './ui/index';
import { StepIndicator, claimSteps, ProgressBar, TransactionProgressBar, SkeletonLoader, CircularProgress } from './ui/index';

export function ClaimRewards() {
  const { address } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Check user's pending rewards with loading state
  const { data: pendingRewards, isLoading: isRewardsLoading } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: bigint | undefined; isLoading: boolean };

  const { writeContractAsync: claim, data: claimTxHash } = useWriteContract();

  const { isLoading: isClaimLoading } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  const handleClaim = async () => {
    if (!address) return;

    // Check if user has rewards to claim
    const rewardsAmount = pendingRewards || BigInt(0);
    if (rewardsAmount === BigInt(0)) {
      showError('No Rewards Available', 'You have no rewards available to claim at this time.');
      return;
    }

    try {
      setIsClaiming(true);
      
      await claim({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'claimRewards',
      });

      setIsClaiming(false);
      showSuccess('Rewards Claimed!', `Successfully claimed ${ethers.formatEther(rewardsAmount)} HAPG tokens!`);
    } catch (error: unknown) {
      console.error('Claim failed:', error);
      setIsClaiming(false);
      showError('Claim Failed', error instanceof Error ? error.message : 'Claim failed. Please try again.');
    }
  };

  const rewardsAmount = pendingRewards || BigInt(0);
  const hasRewards = rewardsAmount > BigInt(0);

  // Calculate reward progress (simulated since we don't have historical data)
  const estimatedRewards = hasRewards ? parseFloat(ethers.formatEther(rewardsAmount)) : 0;
  const maxPossibleRewards = Math.max(estimatedRewards, 100); // Assume max of 100 for visualization
  const rewardProgress = (estimatedRewards / maxPossibleRewards) * 100;

  // Get step indicator data
  const steps = claimSteps(isClaiming, hasRewards);

  return (
    <div className="space-y-4">
      {/* Rewards Information */}
      <InfoCard
        title="Understanding Reward Claims"
        description={
          <div className="space-y-2">
            <p>Claim your earned HAPG token rewards from staking in the protocol.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Earning:</strong> Rewards accrue continuously while staked</p>
              <p>• <strong>Timing:</strong> No time limit to claim your rewards</p>
              <p>• <strong>Gas Fees:</strong> Claiming rewards requires a small gas fee</p>
              <p>• <strong>Frequency:</strong> Can be claimed as often as you want</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
              <p className="text-xs text-green-700 font-medium">💡 Tip: Regular claiming doesn't affect your staked principal - only the rewards are distributed.</p>
            </div>
          </div>
        }
        variant="success"
        helpContent="Rewards are automatically calculated based on your staked amount and the protocol's reward rate."
        collapsible={true}
        defaultExpanded={false}
      />

      {/* Progress Step Indicator */}
      {(isClaiming || isClaimLoading) && (
        <div className="crystal-glass rounded-2xl p-4">
          <StepIndicator
            steps={steps}
            variant="horizontal"
            size="md"
            showConnectors={true}
          />
        </div>
      )}

      {/* Transaction Progress Bar */}
      {(isClaiming || isClaimLoading) && (
        <TransactionProgressBar
          status="processing"
          message="Claiming your rewards..."
        />
      )}

      {/* Pending Rewards Display */}
      {isRewardsLoading ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <SkeletonLoader variant="text" width="60%" />
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Pending Rewards:</span> {ethers.formatEther(rewardsAmount)} tokens
            </p>
            <CircularProgress
              value={rewardProgress}
              size={50}
              strokeWidth={4}
              variant={hasRewards ? 'success' : 'warning'}
              showLabel={false}
            />
          </div>
          
          {/* Rewards progress visualization */}
          {hasRewards && (
            <div className="space-y-2">
              <ProgressBar
                value={rewardProgress}
                label="Reward accumulation progress"
                variant="success"
                size="sm"
                animated={true}
              />
              <div className="flex justify-between text-xs text-yellow-700">
                <span>0 tokens</span>
                <span>{maxPossibleRewards.toFixed(2)} tokens (estimated max)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reward Summary */}
      {hasRewards && (
        <div className="crystal-glass rounded-2xl p-4 space-y-3">
          <h4 className="font-medium" style={{ color: 'var(--crystal-text-primary)' }}>
            Reward Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: 'var(--crystal-text-secondary)' }}>Current Rewards</p>
              <p className="font-semibold text-green-600">{ethers.formatEther(rewardsAmount)} HAPG</p>
            </div>
            <div>
              <p style={{ color: 'var(--crystal-text-secondary)' }}>Claim Status</p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${hasRewards ? 'bg-green-500' : 'bg-gray-400'}`} />
                <p className="font-medium">{hasRewards ? 'Available' : 'None'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tooltip content={isClaiming ? "Processing your claim..." : hasRewards ? "Harvest your earned rewards" : "No rewards available to claim"}>
        <button
          onClick={handleClaim}
          disabled={!address || isClaimLoading || isClaiming || rewardsAmount === BigInt(0)}
          className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed btn-crystal-primary btn-glow-yellow btn-ripple shadow-crystal ${(isClaiming || isClaimLoading) ? 'opacity-75' : ''}`}
        >
          {isClaiming || isClaimLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Claiming...
            </div>
          ) : rewardsAmount === BigInt(0) ? (
            'No Rewards Available'
          ) : (
            `Claim ${ethers.formatEther(rewardsAmount)} HAPG Rewards`
          )}
        </button>
      </Tooltip>

      {/* Additional Info for No Rewards */}
      {!hasRewards && !isRewardsLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>No rewards yet?</strong> Stake some HAPG tokens to start earning rewards automatically over time.
          </p>
        </div>
      )}
    </div>
  );
}
