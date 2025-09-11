import { useState } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';

export function WithdrawForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
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

  const { writeContractAsync: withdraw, data: withdrawTxHash } = useWriteContract();

  const { isLoading: isWithdrawLoading } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  });

  const handleWithdraw = async () => {
    if (!amount || !address) return;

    // Check if user has sufficient staked amount
    const withdrawAmount = ethers.parseEther(amount);
    const stakedAmount = userInfo ? userInfo[0] : BigInt(0);

    if (withdrawAmount > stakedAmount) {
      setNotification({
        type: 'error',
        message: `Insufficient staked amount. You have ${ethers.formatEther(stakedAmount)} tokens staked.`
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      setNotification(null);

      await withdraw({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'withdraw',
        args: [withdrawAmount],
      });

      setAmount('');
      setNotification({
        type: 'success',
        message: `Successfully withdrew ${amount} tokens!`
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error: unknown) {
      console.error('Withdraw failed:', error);
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Withdrawal failed. Please try again.'
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
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Staked Amount:</span> {parseFloat(ethers.formatEther(stakedAmount)).toFixed(2)} HAPG tokens
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Withdraw
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white font-medium"
        />
      </div>
      <button
        onClick={handleWithdraw}
        disabled={!address || !amount || isWithdrawLoading || ethers.parseEther(amount || '0') > stakedAmount}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 disabled:transform-none border-2 border-blue-500/30"
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
    </div>
  );
}
