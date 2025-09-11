import { useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';

export function ClaimRewards() {
  const { address } = useAccount();
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Check user's pending rewards
  const { data: pendingRewards } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: bigint | undefined };

  const { writeContractAsync: claim, data: claimTxHash } = useWriteContract();

  const { isLoading: isClaimLoading } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  const handleClaim = async () => {
    if (!address) return;

    // Check if user has rewards to claim
    const rewardsAmount = pendingRewards || BigInt(0);
    if (rewardsAmount === BigInt(0)) {
      setNotification({
        type: 'error',
        message: 'No rewards available to claim.'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      setNotification(null);

      await claim({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'claimRewards',
      });

      setNotification({
        type: 'success',
        message: `Successfully claimed ${ethers.formatEther(rewardsAmount)} tokens!`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error: unknown) {
      console.error('Claim failed:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Claim failed. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const rewardsAmount = pendingRewards || BigInt(0);

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl border-2 ${
          notification.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${
              notification.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Pending Rewards Display */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">Pending Rewards:</span> {ethers.formatEther(rewardsAmount)} tokens
        </p>
      </div>

      <button
        onClick={handleClaim}
        disabled={!address || isClaimLoading || rewardsAmount === BigInt(0)}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 disabled:transform-none"
      >
        {isClaimLoading ? (
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
          'Claim Rewards'
        )}
      </button>
    </div>
  );
}
