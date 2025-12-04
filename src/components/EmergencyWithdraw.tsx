import { useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';

export function EmergencyWithdraw() {
  const { address } = useAccount();
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

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

  const { writeContractAsync: emergencyWithdraw, data: emergencyTxHash } = useWriteContract();

  const { isLoading: isEmergencyLoading } = useWaitForTransactionReceipt({
    hash: emergencyTxHash,
  });

  const handleEmergencyWithdraw = async () => {
    if (!address) return;

    // Check if user has staked amount
    const stakedAmount = userInfo ? userInfo[0] : BigInt(0);
    if (stakedAmount === BigInt(0)) {
      setNotification({
        type: 'error',
        message: 'No staked tokens to withdraw.'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      setNotification(null);

      await emergencyWithdraw({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'emergencyWithdraw',
      });

      setNotification({
        type: 'success',
        message: `Emergency withdrawal successful! ${ethers.formatEther(stakedAmount)} tokens withdrawn (with penalty).`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error: unknown) {
      console.error('Emergency withdraw failed:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Emergency withdrawal failed. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const stakedAmount = userInfo ? userInfo[0] : BigInt(0);

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

      {/* Staked Amount Display */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <p className="text-sm text-red-800">
          <span className="font-medium">Staked Amount:</span> {ethers.formatEther(stakedAmount)} tokens
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-red-800">
            Emergency withdrawal includes a penalty fee. Use only when necessary.
          </p>
        </div>
      </div>

      <button
        onClick={handleEmergencyWithdraw}
        disabled={!address || isEmergencyLoading || stakedAmount === BigInt(0)}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed btn-crystal-primary btn-glow-red btn-ripple shadow-crystal"
      >
        {isEmergencyLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Withdrawing...
          </div>
        ) : stakedAmount === BigInt(0) ? (
          'No Tokens to Withdraw'
        ) : (
          'Emergency Withdraw'
        )}
      </button>
    </div>
  );
}
