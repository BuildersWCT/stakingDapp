import { useEffect, useState } from 'react';
import { HelpIcon, InfoCard } from './ui';

interface NetworkStats {
  totalTransactions: number;
  activeUsers: number;
  totalVolume: string;
  networkHealth: number;
}

export function SubgraphStats() {
  const [stats, setStats] = useState<NetworkStats>({
    totalTransactions: 0,
    activeUsers: 0,
    totalVolume: '0.00',
    networkHealth: 100,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading network analytics data
    const loadStats = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalTransactions: 12847,
        activeUsers: 3421,
        totalVolume: '125.6K',
        networkHealth: 98,
      });
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Network Analytics Overview */}
      <InfoCard
        title="Network Analytics Overview"
        description={
          <div className="space-y-2">
            <p>Real-time network statistics and performance metrics for Crystal Stakes protocol.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Total Transactions:</strong> All protocol interactions since launch</p>
              <p>• <strong>Active Users:</strong> Currently engaged wallet addresses</p>
              <p>• <strong>Total Volume:</strong> Cumulative HAPG tokens transacted</p>
              <p>• <strong>Network Health:</strong> Protocol performance and uptime percentage</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="These metrics are updated in real-time from our subgraph. Network health above 95% indicates optimal protocol performance."
        collapsible={true}
        defaultExpanded={false}
      />

      {/* Network Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Transactions */}
        <div className="group bg-gradient-to-br from-cyan-50 to-blue-100 p-6 rounded-2xl border border-cyan-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <HelpIcon
              content="Total number of transactions processed by the Crystal Stakes protocol since launch."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cyan-900 mb-1" style={{ fontFamily: 'serif' }}>
              Total Transactions
            </h3>
            <p className="text-2xl font-bold text-cyan-700 mb-1">
              {stats.totalTransactions.toLocaleString()}
            </p>
            <p className="text-xs text-cyan-600 font-medium">Protocol interactions</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <HelpIcon
              content="Number of unique wallet addresses that have interacted with the protocol in the last 30 days."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1" style={{ fontFamily: 'serif' }}>
              Active Users
            </h3>
            <p className="text-2xl font-bold text-emerald-700 mb-1">
              {stats.activeUsers.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium">30-day active</p>
          </div>
        </div>

        {/* Total Volume */}
        <div className="group bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <HelpIcon
              content="Cumulative value of HAPG tokens transacted through the staking protocol."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-900 mb-1" style={{ fontFamily: 'serif' }}>
              Total Volume
            </h3>
            <p className="text-2xl font-bold text-purple-700 mb-1">
              {stats.totalVolume}
            </p>
            <p className="text-xs text-purple-600 font-medium">HAPG tokens</p>
          </div>
        </div>

        {/* Network Health */}
        <div className="group bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-2xl border border-amber-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <HelpIcon
              content="Overall protocol health score based on uptime, transaction success rate, and system performance."
              position="top"
              variant="primary"
              size="sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1" style={{ fontFamily: 'serif' }}>
              Network Health
            </h3>
            <p className="text-2xl font-bold text-amber-700 mb-1">
              {stats.networkHealth}%
            </p>
            <p className="text-xs text-amber-600 font-medium">System status</p>
          </div>
        </div>
      </div>

      {/* Additional Network Insights */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'serif' }}>
              Network Insights
            </h3>
            <p className="text-sm text-slate-600">Latest protocol performance indicators</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <span className="text-slate-700 font-medium">Avg. Transaction Time</span>
            <span className="text-slate-900 font-semibold">2.3s</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <span className="text-slate-700 font-medium">Success Rate</span>
            <span className="text-green-600 font-semibold">99.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}