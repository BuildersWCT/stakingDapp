import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { EnhancedInput, InfoCard, HelpIcon, CardLoader } from './ui';

export function RewardsCalculator() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState<'days' | 'months' | 'years'>('days');
  const [projectedRewards, setProjectedRewards] = useState<string>('0');

  // Fetch current reward rate (APR)
  const { data: currentRewardRate, isLoading: isAprLoading } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'currentRewardRate',
  });

  // Calculate projected rewards when inputs change
  useEffect(() => {
    if (!stakeAmount || !duration || !currentRewardRate) {
      setProjectedRewards('0');
      return;
    }

    const amount = parseFloat(stakeAmount);
    const time = parseFloat(duration);

    if (isNaN(amount) || isNaN(time) || amount <= 0 || time <= 0) {
      setProjectedRewards('0');
      return;
    }

    // Convert duration to years
    let years: number = 0;
    switch (durationUnit) {
      case 'days':
        years = time / 365;
        break;
      case 'months':
        years = time / 12;
        break;
      case 'years':
        years = time;
        break;
    }

    // APR is in basis points (e.g., 500 = 5%), convert to decimal
    const apr = Number(currentRewardRate) / 10000;

    // Calculate compound interest: A = P(1 + r/n)^(nt)
    // Assuming daily compounding for simplicity
    const dailyRate = apr / 365;
    const totalRewards = amount * (Math.pow(1 + dailyRate, 365 * years) - 1);

    setProjectedRewards(totalRewards.toFixed(4));
  }, [stakeAmount, duration, durationUnit, currentRewardRate]);

  const currentAPR = currentRewardRate ? (Number(currentRewardRate) / 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      <InfoCard
        title="Rewards Calculator"
        description="Calculate your potential staking rewards based on amount and duration. This is an estimate and actual rewards may vary."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--crystal-text-primary)' }}>
              Stake Amount (HAPG)
            </label>
            <EnhancedInput
              type="number"
              value={stakeAmount}
              onChange={setStakeAmount}
              placeholder="Enter amount to stake"
              min="0"
              step="0.01"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => setStakeAmount('100')}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                100
              </button>
              <button
                onClick={() => setStakeAmount('1000')}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                1K
              </button>
              <button
                onClick={() => setStakeAmount('10000')}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                10K
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--crystal-text-primary)' }}>
              Duration
            </label>
            <div className="flex space-x-2">
              <EnhancedInput
                type="number"
                value={duration}
                onChange={setDuration}
                placeholder="Enter duration"
                min="0"
                step="1"
                className="flex-1"
              />
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as 'days' | 'months' | 'years')}
                className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                style={{ borderColor: 'var(--crystal-primary-200)' }}
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => {
                  setDuration('30');
                  setDurationUnit('days');
                }}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                30 Days
              </button>
              <button
                onClick={() => {
                  setDuration('6');
                  setDurationUnit('months');
                }}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                6 Months
              </button>
              <button
                onClick={() => {
                  setDuration('1');
                  setDurationUnit('years');
                }}
                className="px-3 py-1 text-xs rounded-md crystal-gradient-primary text-white hover:opacity-80 transition-opacity"
              >
                1 Year
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--crystal-surface)', border: '1px solid var(--crystal-primary-200)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--crystal-text-secondary)' }}>
                Current APR
              </span>
              <HelpIcon
                content="Annual Percentage Rate for staking rewards. This rate may change over time."
              />
            </div>
            {isAprLoading ? (
              <CardLoader message="Loading APR..." />
            ) : (
              <div className="text-2xl font-bold crystal-gradient-text">
                {currentAPR}%
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--crystal-surface)', border: '1px solid var(--crystal-primary-200)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--crystal-text-secondary)' }}>
                Projected Rewards
              </span>
              <HelpIcon
                content="Estimated rewards based on current APR and compound interest calculation."
              />
            </div>
            <div className="text-2xl font-bold crystal-gradient-text">
              {projectedRewards} HAPG
            </div>
          </div>

          {stakeAmount && duration && (
            <div className="p-4 rounded-lg" style={{ background: 'var(--crystal-surface)', border: '1px solid var(--crystal-primary-200)' }}>
              <div className="text-sm" style={{ color: 'var(--crystal-text-secondary)' }}>
                Total Return: <span className="font-bold crystal-gradient-text">
                  {(parseFloat(stakeAmount) + parseFloat(projectedRewards)).toFixed(4)} HAPG
                </span>
              </div>
              <div className="text-sm" style={{ color: 'var(--crystal-text-secondary)' }}>
                ROI: <span className="font-bold crystal-gradient-text">
                  {((parseFloat(projectedRewards) / parseFloat(stakeAmount)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}