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
    <div className="space-y-8">
      {/* Prominent Rewards Display */}
      {rewardsAmount > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-800" style={{ fontFamily: 'serif' }}>Accumulated Rewards</h3>
                <p className="text-sm text-yellow-600">Ready to claim!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-yellow-700">{rewardsAmount.toFixed(4)}</p>
              <p className="text-sm text-yellow-600 font-medium">HAPG tokens</p>
            </div>
          </div>
          <div className="bg-yellow-100 rounded-xl p-4">
            <p className="text-sm text-yellow-700 font-medium">
              ✨ Click the Claim Rewards button above to harvest your earnings!
            </p>
          </div>
        </div>
      )}

      {/* Regular Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2" style={{ fontFamily: 'serif' }}>Staked Amount</h3>
            <p className="text-3xl font-bold text-blue-700 mb-2">{ethers.formatEther(stakedAmount)}</p>
            <p className="text-sm text-blue-600 font-medium">HAPG tokens locked</p>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2" style={{ fontFamily: 'serif' }}>Time Until Unlock</h3>
            <p className="text-3xl font-bold text-purple-700 mb-2">
              {timeUntilUnlock > 0 ? formatTimeRemaining(timeUntilUnlock) : 'Unlocked'}
            </p>
            <p className="text-sm text-purple-600 font-medium">
              {timeUntilUnlock > 0 ? 'Remaining lock time' : 'Ready for withdrawal'}
            </p>
          </div>
        </div>

        <div className={`group p-8 rounded-2xl border shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ${canWithdraw ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${canWithdraw ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${canWithdraw ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {canWithdraw ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Withdrawal Status</h3>
            <p className={`text-3xl font-bold mb-2 ${canWithdraw ? 'text-green-600' : 'text-red-600'}`}>
              {canWithdraw ? 'Available' : 'Locked'}
            </p>
            <p className={`text-sm font-medium ${canWithdraw ? 'text-green-600' : 'text-red-600'}`}>
              {canWithdraw ? 'Ready to withdraw' : 'Time locked'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Position Info */}
      {rewardsAmount === 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-8 rounded-2xl border border-slate-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'serif' }}>No Rewards Yet</h3>
              <p className="text-sm text-slate-600">Start staking to earn rewards over time!</p>
            </div>
          </div>
        </div>
      )}

      {/* Staking Progress Indicator */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-indigo-900" style={{ fontFamily: 'serif' }}>Staking Progress</h3>
          <span className="text-sm font-medium text-indigo-600">
            {timeUntilUnlock > 0 ? `${Math.max(0, 100 - Math.floor((timeUntilUnlock / (24 * 60 * 60)) * 10))}% Complete` : '100% Complete'}
          </span>
        </div>
        <div className="w-full bg-indigo-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ 
              width: timeUntilUnlock > 0 ? `${Math.max(0, 100 - Math.floor((timeUntilUnlock / (24 * 60 * 60)) * 10))}%` : '100%' 
            }}
          ></div>
        </div>
        <p className="text-xs text-indigo-600 mt-2 font-medium">
          {timeUntilUnlock > 0 ? 'Keep staking to unlock full benefits' : 'Congratulations! Full benefits unlocked'}
        </p>
      </div>
    </div>
  );
}
