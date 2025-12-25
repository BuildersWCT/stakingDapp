import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from '../components/NotificationProvider';

export const useRewardReminder = () => {
  const { address } = useAccount();
  const { showReward } = useNotification();

  // Check user's pending rewards
  const { data: pendingRewards } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000, // Check every 30 seconds
    },
  }) as { data: bigint | undefined };

  useEffect(() => {
    if (!address || !pendingRewards) return;

    const rewardsAmount = parseFloat(ethers.formatEther(pendingRewards));

    // Send reminder if rewards are significant (> 10 tokens) and haven't been reminded recently
    if (rewardsAmount > 10) {
      const lastReminder = localStorage.getItem(`rewardReminder_${address}`);
      const now = Date.now();

      // Only remind once per day
      if (!lastReminder || now - parseInt(lastReminder) > 24 * 60 * 60 * 1000) {
        showReward(
          'Rewards Available!',
          `You have ${rewardsAmount.toFixed(2)} HAPG tokens ready to claim. Don't forget to harvest your earnings!`
        );
        localStorage.setItem(`rewardReminder_${address}`, now.toString());
      }
    }
  }, [pendingRewards, address, showReward]);
};