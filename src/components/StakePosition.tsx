import { useReadContract, useAccount } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';

export function StakePosition() {
  const { address } = useAccount();

  const { data: userInfo } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'userInfo',
    args: [address],
  });

  const { data: minLockDuration } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'minLockDuration',
  });

  const { data: pendingRewards } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getPendingRewards',
    args: [address],
  });

  if (!address) {
    return <p>Please connect your wallet.</p>;
  }

  if (!userInfo || !minLockDuration) {
    return <p>Loading...</p>;
  }

  const [stakedAmount, lastStakeTimestamp] = userInfo as [bigint, bigint, bigint, bigint];
  const currentTime = BigInt(Math.floor(Date.now() / 1000));
  const lockEndTime = lastStakeTimestamp + (minLockDuration as bigint);
  const timeUntilUnlock = lockEndTime > currentTime ? Number(lockEndTime - currentTime) : 0;
  const canWithdraw = timeUntilUnlock === 0;

  const formatTimeRemaining = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const rewardsAmount = pendingRewards ? parseFloat(ethers.formatEther(pendingRewards as bigint)) : 0;

  return (
    <div className="space-y-6">
      {/* Prominent Rewards Display */}
      {rewardsAmount > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl mb-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-yellow-800">Accumulated Rewards</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-700 mb-2">{rewardsAmount.toFixed(4)} tokens</p>
          <p className="text-sm text-yellow-600">Ready to claim! Click the Claim Rewards button above.</p>
        </div>
      )}

      {/* Regular Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-blue-900">Staked Amount</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{ethers.formatEther(stakedAmount)} tokens</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-purple-900">Time Until Unlock</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {timeUntilUnlock > 0 ? formatTimeRemaining(timeUntilUnlock) : 'Unlocked'}
          </p>
        </div>

        <div className={`p-6 rounded-2xl border hover:shadow-lg transition-shadow duration-300 ${canWithdraw ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'}`}>
          <div className="flex items-center mb-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 ${canWithdraw ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-5 h-5 ${canWithdraw ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {canWithdraw ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Withdrawal Status</h3>
          </div>
          <p className={`text-3xl font-bold ${canWithdraw ? 'text-green-600' : 'text-red-600'}`}>
            {canWithdraw ? 'Available' : 'Locked'}
          </p>
        </div>
      </div>

      {/* Additional Rewards Info */}
      {rewardsAmount === 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">No Rewards Yet</p>
              <p className="text-xs text-gray-500">Start staking to earn rewards over time!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
