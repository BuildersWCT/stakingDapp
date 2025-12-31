import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { offlineStorage, type StakingData } from '../services/offlineStorage';

export interface StakingPosition {
  stakedAmount: string;
  rewards: string;
  timeUntilUnlock: number;
  canWithdraw: boolean;
  isOffline: boolean;
}

export function useStakingData() {
  const { address } = useAccount();
  const [offlineData, setOfflineData] = useState<StakingData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline data on mount
  useEffect(() => {
    if (address) {
      const cached = offlineStorage.getStakingData();
      if (cached && cached.address === address) {
        setOfflineData(cached);
      }
    }
  }, [address]);

  // Contract reads
  const { data: userInfo, isLoading: userInfoLoading } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'userInfo',
    args: [address],
  });

  const { data: minLockDuration, isLoading: minLockLoading } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'minLockDuration',
  });

  const { data: pendingRewards, isLoading: rewardsLoading } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getPendingRewards',
    args: [address],
  });

  // Save data to offline storage when online data is available
  useEffect(() => {
    if (address && userInfo && pendingRewards && isOnline) {
      const [stakedAmount] = userInfo as [bigint, bigint, bigint, bigint];
      const rewards = pendingRewards as bigint;

      const stakingData: StakingData = {
        address,
        stakedAmount: ethers.formatEther(stakedAmount),
        rewards: ethers.formatEther(rewards),
        lastUpdated: Date.now()
      };

      offlineStorage.saveStakingData(stakingData);
      setOfflineData(stakingData);
    }
  }, [address, userInfo, pendingRewards, isOnline]);

  // Calculate staking position
  const calculatePosition = (): StakingPosition | null => {
    if (!address) return null;

    // Try online data first
    if (userInfo && minLockDuration && !userInfoLoading && !minLockLoading) {
      const [stakedAmount, lastStakeTimestamp] = userInfo as [bigint, bigint, bigint, bigint];
      const currentTime = BigInt(Math.floor(Date.now() / 1000));
      const lockEndTime = lastStakeTimestamp + (minLockDuration as bigint);
      const timeUntilUnlock = lockEndTime > currentTime ? Number(lockEndTime - currentTime) : 0;
      const canWithdraw = timeUntilUnlock === 0;

      const rewardsAmount = pendingRewards ? ethers.formatEther(pendingRewards as bigint) : '0';

      return {
        stakedAmount: ethers.formatEther(stakedAmount),
        rewards: rewardsAmount,
        timeUntilUnlock,
        canWithdraw,
        isOffline: false
      };
    }

    // Fall back to offline data
    if (offlineData && offlineData.address === address) {
      // For offline data, we can't calculate lock time accurately, so assume unlocked
      return {
        stakedAmount: offlineData.stakedAmount,
        rewards: offlineData.rewards,
        timeUntilUnlock: 0,
        canWithdraw: true,
        isOffline: true
      };
    }

    return null;
  };

  const position = calculatePosition();
  const isLoading = userInfoLoading || minLockLoading || rewardsLoading;

  return {
    position,
    isLoading,
    isOnline,
    hasOfflineData: !!offlineData
  };
}