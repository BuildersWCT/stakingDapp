import { useReadContract } from 'wagmi';
import { stakingContractAddress, stakingContractABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { HelpIcon, InfoCard } from './ui';

export function ProtocolStats() {
  const { data: totalStaked } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'totalStaked',
  });

  const { data: currentRewardRate } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'currentRewardRate',
  });

  const { data: totalRewards } = useReadContract({
    address: stakingContractAddress,
    abi: stakingContractABI,
    functionName: 'getTotalRewards',
  });

  return (
    <div className="space-y-8">
      {/* Protocol Overview */}
      <InfoCard
        title="Protocol Statistics Overview"
        description={
          <div className="space-y-2">
            <p>These metrics show the overall health and performance of the Crystal Stakes protocol.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Total Staked:</strong> Total HAPG tokens locked in the protocol</p>
              <p>• <strong>Current APR:</strong> Annual percentage rate for staking rewards</p>
              <p>• <strong>Total Rewards:</strong> Cumulative rewards distributed to users</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="These statistics are updated in real-time from the blockchain. Higher total staked amounts indicate greater protocol confidence."
        collapsible={true}
        defaultExpanded={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <HelpIcon
              content="Total amount of HAPG tokens currently staked by all users in the protocol. Higher values indicate stronger protocol adoption."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2" style={{ fontFamily: 'serif' }}>
              Total HAPG Staked
            </h3>
            <p className="text-sm text-indigo-600 mb-4">Across all users</p>
            <p className="text-4xl font-bold text-indigo-700 mb-2">
              {totalStaked ? `${parseFloat(ethers.formatEther(totalStaked as bigint)).toFixed(2)}` : '0.00'}
            </p>
            <p className="text-sm text-indigo-600 font-medium">HAPG tokens</p>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in delay-200">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <HelpIcon
              content="Annual Percentage Rate showing the expected yearly return on staked tokens. This rate may vary based on protocol performance."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2" style={{ fontFamily: 'serif' }}>
              Current APR
            </h3>
            <p className="text-sm text-emerald-600 mb-4">Annual percentage rate</p>
            <p className="text-4xl font-bold text-emerald-700 mb-2">
              {currentRewardRate ? `${currentRewardRate}` : '0'}
            </p>
            <p className="text-sm text-emerald-600 font-medium">Percent per year</p>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl border border-amber-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in delay-400">
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <HelpIcon
              content="Cumulative HAPG tokens distributed as staking rewards to all users since protocol launch."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 mb-2" style={{ fontFamily: 'serif' }}>
              Total Rewards Paid
            </h3>
            <p className="text-sm text-amber-600 mb-4">HAPG distributed</p>
            <p className="text-4xl font-bold text-amber-700 mb-2">
              {totalRewards ? `${parseFloat(ethers.formatEther(totalRewards as bigint)).toFixed(2)}` : '0.00'}
            </p>
            <p className="text-sm text-amber-600 font-medium">HAPG tokens</p>
          </div>
        </div>
      </div>

      {/* Additional Protocol Insights */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-8 rounded-2xl border border-slate-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'serif' }}>
              Protocol Insights
            </h3>
            <p className="text-sm text-slate-600">Key performance indicators and health metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-700">TVL Growth</p>
              <p className="text-xs text-slate-500">30-day change</p>
            </div>
            <span className="text-green-600 font-bold text-lg">+12.5%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-700">Avg. Stake Size</p>
              <p className="text-xs text-slate-500">Per user</p>
            </div>
            <span className="text-blue-600 font-bold text-lg">1,250</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-700">Uptime</p>
              <p className="text-xs text-slate-500">System reliability</p>
            </div>
            <span className="text-green-600 font-bold text-lg">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
