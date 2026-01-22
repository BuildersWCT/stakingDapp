import React, { useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { type TransactionQueue } from '../services/offlineStorage';
import { pushNotifications } from '../services/pushNotifications';

interface TransactionResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

export const TransactionExecutor: React.FC = () => {
  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: stake } = useWriteContract();
  const { writeContractAsync: unstake } = useWriteContract();
  const { writeContractAsync: claim } = useWriteContract();

  useEffect(() => {
    const handleExecuteQueuedTransaction = async (event: CustomEvent) => {
      const { transaction, resolve }: { transaction: TransactionQueue; resolve: (result: TransactionResult) => void } = event.detail;

      try {
        const result = await executeTransaction(transaction);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          transactionId: transaction.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    window.addEventListener('execute-queued-transaction', handleExecuteQueuedTransaction as EventListener);

    return () => {
      window.removeEventListener('execute-queued-transaction', handleExecuteQueuedTransaction as EventListener);
    };
  }, [approve, stake, unstake, claim]);

  const executeTransaction = async (transaction: TransactionQueue): Promise<TransactionResult> => {
    switch (transaction.type) {
      case 'approve':
        return await executeApproveTransaction(transaction);
      case 'stake':
        return await executeStakeTransaction(transaction);
      case 'unstake':
        return await executeUnstakeTransaction(transaction);
      case 'claim':
        return await executeClaimTransaction(transaction);
      default:
        throw new Error(`Unknown transaction type: ${transaction.type}`);
    }
  };

  const executeApproveTransaction = async (transaction: TransactionQueue): Promise<TransactionResult> => {
    try {
      const { amount, spender } = transaction.data as { amount: string; spender: string };

      console.log(`Executing queued approve transaction: ${amount} tokens for ${spender}`);

      const amountBigInt = ethers.parseEther(amount);

      await approve({
        address: spender as `0x${string}`,
        abi: testTokenABI,
        functionName: 'approve',
        args: [spender, amountBigInt],
      });

      await pushNotifications.notifyTransactionSuccess('approve', amount);

      return {
        success: true,
        transactionId: transaction.id
      };
    } catch (error) {
      await pushNotifications.notifyTransactionFailed('approve', error instanceof Error ? error.message : 'Unknown error', 1);

      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Approve transaction failed'
      };
    }
  };

  const executeStakeTransaction = async (transaction: TransactionQueue): Promise<TransactionResult> => {
    try {
      const { amount, stakingToken } = transaction.data as { amount: string; stakingToken: string; stakeAmount?: string };

      console.log(`Executing queued stake transaction: ${amount} tokens`);

      const stakeAmountBigInt = ethers.parseEther(amount);

      // First approve if needed
      await approve({
        address: stakingToken as `0x${string}`,
        abi: testTokenABI,
        functionName: 'approve',
        args: [stakingContractAddress, stakeAmountBigInt],
      });

      // Then stake
      await stake({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'stake',
        args: [stakeAmountBigInt],
      });

      await pushNotifications.notifyTransactionSuccess('stake', amount);

      return {
        success: true,
        transactionId: transaction.id
      };
    } catch (error) {
      await pushNotifications.notifyTransactionFailed('stake', error instanceof Error ? error.message : 'Unknown error', 1);

      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Stake transaction failed'
      };
    }
  };

  const executeUnstakeTransaction = async (transaction: TransactionQueue): Promise<TransactionResult> => {
    try {
      const { amount } = transaction.data as { amount: string };

      console.log(`Executing queued unstake transaction: ${amount} tokens`);

      const unstakeAmountBigInt = ethers.parseEther(amount);

      await unstake({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'unstake',
        args: [unstakeAmountBigInt],
      });

      await pushNotifications.notifyTransactionSuccess('unstake', amount);

      return {
        success: true,
        transactionId: transaction.id
      };
    } catch (error) {
      await pushNotifications.notifyTransactionFailed('unstake', error instanceof Error ? error.message : 'Unknown error', 1);

      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Unstake transaction failed'
      };
    }
  };

  const executeClaimTransaction = async (transaction: TransactionQueue): Promise<TransactionResult> => {
    try {
      console.log('Executing queued claim transaction');

      await claim({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'claimRewards',
        args: [],
      });

      await pushNotifications.notifyTransactionSuccess('claim');

      return {
        success: true,
        transactionId: transaction.id
      };
    } catch (error) {
      await pushNotifications.notifyTransactionFailed('claim', error instanceof Error ? error.message : 'Unknown error', 1);

      return {
        success: false,
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Claim transaction failed'
      };
    }
  };

  // This component doesn't render anything
  return null;
};