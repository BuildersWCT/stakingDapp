import { useState } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI, testTokenAddress, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';

export function StakeForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'staking'>('idle');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Use the test token address directly
  const stakingToken = testTokenAddress;

  // Check user's token balance
  const { data: userBalance } = useReadContract({
    address: stakingToken,
    abi: testTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: bigint | undefined };

  const { writeContractAsync: approve } = useWriteContract();
  const { writeContractAsync: stake } = useWriteContract();


  const handleStake = async () => {
    if (!amount || !stakingToken || !address) return;

    // Check minimum stake amount
    const stakeAmountNum = parseFloat(amount);
    if (stakeAmountNum < 50) {
      setNotification({
        type: 'error',
        message: 'Minimum stake amount is 50 HAPG tokens.'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Check if user has sufficient balance
    const stakeAmount = ethers.parseEther(amount);
    if (!userBalance || userBalance < stakeAmount) {
      setNotification({
        type: 'error',
        message: `Insufficient balance. You have ${userBalance ? parseFloat(ethers.formatEther(userBalance)).toFixed(2) : '0.00'} HAPG tokens available.`
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      setStep('approving');
      setNotification(null);

      // First, approve the contract to spend the token
      await approve({
        address: stakingToken as `0x${string}`,
        abi: testTokenABI,
        functionName: 'approve',
        args: [stakingContractAddress, stakeAmount],
      });

      setStep('staking');

      // Then, stake after approval is confirmed
      await stake({
        address: stakingContractAddress,
        abi: stakingContractABI,
        functionName: 'stake',
        args: [stakeAmount],
      });

      setStep('idle');
      setAmount('');
      setNotification({
        type: 'success',
        message: `Successfully staked ${amount} HappyGurl tokens!`
      });
      setTimeout(() => setNotification(null), 5000);

    } catch (error: unknown) {
      console.error('Transaction failed:', error);
      setStep('idle');
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Transaction failed. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

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

      {/* Balance Display */}
      {userBalance && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Available Balance:</span> {parseFloat(ethers.formatEther(userBalance)).toFixed(2)} HAPG tokens
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Stake (Minimum: 50 HAPG)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          min="50"
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white font-medium"
        />
      </div>
      <button
        onClick={handleStake}
        disabled={!address || !amount || step !== 'idle' || !userBalance || ethers.parseEther(amount || '0') > userBalance || parseFloat(amount || '0') < 50}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 disabled:transform-none border-2 border-green-500/30"
      >
        {step === 'approving' ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Approving Token...
          </div>
        ) : step === 'staking' ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Staking Tokens...
          </div>
        ) : (
          'Stake Tokens'
        )}
      </button>
    </div>
  );
}
