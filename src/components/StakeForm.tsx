import { useState } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI, testTokenAddress, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';
import { Tooltip, HelpIcon, InfoCard } from './ui';

export function StakeForm() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'staking'>('idle');
  const { showSuccess, showError } = useNotification();

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
      showError('Minimum Stake Amount', 'Minimum stake amount is 50 HAPG tokens.');
      return;
    }

    // Check if user has sufficient balance
    const stakeAmount = ethers.parseEther(amount);
    if (!userBalance || userBalance < stakeAmount) {
      showError('Insufficient Balance', `You have ${userBalance ? parseFloat(ethers.formatEther(userBalance)).toFixed(2) : '0.00'} HAPG tokens available.`);
      return;
    }

    try {
      setStep('approving');

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
      showSuccess('Staking Successful!', `Successfully staked ${amount} HAPG tokens!`);

    } catch (error: unknown) {
      console.error('Transaction failed:', error);
      setStep('idle');
      showError('Transaction Failed', error instanceof Error ? error.message : 'Transaction failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Staking Explanation */}
      <InfoCard
        title="Understanding Staking"
        description={
          <div className="space-y-2">
            <p>Staking is the process of locking your HAPG tokens in the protocol to earn rewards over time.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Rewards:</strong> Earn passive income through protocol fees</p>
              <p>• <strong>Lock Period:</strong> Tokens are locked until withdrawn</p>
              <p>• <strong>Minimum:</strong> 50 HAPG tokens required to stake</p>
              <p>• <strong>Gas Fees:</strong> Estimated 0.001-0.003 ETH for transactions</p>
            </div>
            <div className="border rounded-lg p-2 mt-2" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'var(--crystal-accent-amber)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--crystal-accent-amber)' }}>⚠️ Safety Warning: Only stake what you can afford to lock up. Large amounts should be staked carefully.</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="Staking helps secure the protocol and provides liquidity. Learn more about DeFi staking risks in our documentation."
        collapsible={true}
        defaultExpanded={true}
      />

      {/* Balance Display */}
      {userBalance && (
        <div className="border rounded-2xl p-4 crystal-glass">
          <p className="text-sm" style={{ color: 'var(--crystal-accent-blue)' }}>
            <span className="font-medium">Available Balance:</span> {parseFloat(ethers.formatEther(userBalance)).toFixed(2)} HAPG tokens
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center space-x-2" style={{ color: 'var(--crystal-text-primary)' }}>
          <span>Amount to Stake (Minimum: 50 HAPG)</span>
          <HelpIcon
            content="Enter the amount of HAPG tokens you want to stake. The minimum amount is 50 tokens. Higher amounts may earn more rewards proportionally."
            position="right"
            variant="subtle"
            size="sm"
          />
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          min="50"
          className="w-full px-4 py-3 crystal-input"
          style={{ color: 'var(--crystal-text-primary)' }}
        />
      </div>
      <Tooltip content="Earn rewards by locking your tokens">
        <button
          onClick={handleStake}
          disabled={!address || !amount || step !== 'idle' || !userBalance || ethers.parseEther(amount || '0') > userBalance || parseFloat(amount || '0') < 50}
          className="w-full btn-crystal-success btn-glow-emerald btn-ripple"
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
      </Tooltip>
    </div>
  );
}
