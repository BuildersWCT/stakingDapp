import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { client, GET_USER_TRANSACTIONS } from '../lib/subgraph';
import { LoadingSpinner, ErrorMessage } from './ui';

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'emergency';
  amount: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
  status: 'confirmed' | 'pending' | 'failed';
}

interface SubgraphStake {
  id: string;
  user: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  blockNumber: string;
}

interface SubgraphWithdrawal {
  id: string;
  user: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  blockNumber: string;
  rewardsAccrued: string;
}

interface SubgraphRewardClaim {
  id: string;
  user: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  blockNumber: string;
}

interface SubgraphEmergencyWithdrawal {
  id: string;
  user: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  blockNumber: string;
  penalty: string;
}

export function TransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TODO: Implement subgraph queries
  useEffect(() => {
    if (address) {
      fetchTransactions();
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [address]);

  const fetchTransactions = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await client.query({
        query: GET_USER_TRANSACTIONS,
        variables: {
          user: address.toLowerCase(),
          first: 50,
          skip: 0,
          orderBy: 'timestamp',
          orderDirection: 'desc'
        }
      });

      // Combine and transform data
      const allTransactions: Transaction[] = [
        ...data.stakes.map((stake: SubgraphStake) => ({
          id: stake.id,
          type: 'stake' as const,
          amount: stake.amount,
          timestamp: parseInt(stake.timestamp),
          transactionHash: stake.transactionHash,
          blockNumber: parseInt(stake.blockNumber),
          status: 'confirmed' as const
        })),
        ...data.withdrawals.map((withdrawal: SubgraphWithdrawal) => ({
          id: withdrawal.id,
          type: 'unstake' as const,
          amount: withdrawal.amount,
          timestamp: parseInt(withdrawal.timestamp),
          transactionHash: withdrawal.transactionHash,
          blockNumber: parseInt(withdrawal.blockNumber),
          status: 'confirmed' as const
        })),
        ...data.rewardClaims.map((claim: SubgraphRewardClaim) => ({
          id: claim.id,
          type: 'claim' as const,
          amount: claim.amount,
          timestamp: parseInt(claim.timestamp),
          transactionHash: claim.transactionHash,
          blockNumber: parseInt(claim.blockNumber),
          status: 'confirmed' as const
        })),
        ...data.emergencyWithdrawals.map((emergency: SubgraphEmergencyWithdrawal) => ({
          id: emergency.id,
          type: 'emergency' as const,
          amount: emergency.amount,
          timestamp: parseInt(emergency.timestamp),
          transactionHash: emergency.transactionHash,
          blockNumber: parseInt(emergency.blockNumber),
          status: 'confirmed' as const
        }))
      ].sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(allTransactions);
    } catch {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const txDate = new Date(tx.timestamp * 1000);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const matchesDateFrom = !fromDate || txDate >= fromDate;
    const matchesDateTo = !toDate || txDate <= toDate;
    return matchesType && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Type', 'Amount', 'Date', 'Status', 'Transaction Hash', 'Block Number'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        tx.type,
        tx.amount,
        new Date(tx.timestamp * 1000).toISOString(),
        tx.status,
        tx.transactionHash,
        tx.blockNumber
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!address) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Connect your wallet to view transaction history</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="stake">Stake</option>
              <option value="unstake">Unstake</option>
              <option value="claim">Claim Rewards</option>
              <option value="emergency">Emergency Withdraw</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {paginatedTransactions.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No transactions found matching your filters.
          </div>
        )}
        {paginatedTransactions.map((tx) => (
          <div key={tx.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.type === 'stake' ? 'bg-green-100 text-green-800' :
                    tx.type === 'unstake' ? 'bg-blue-100 text-blue-800' :
                    tx.type === 'claim' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.type}
                  </span>
                  <span className={`text-sm font-medium ${
                    tx.status === 'confirmed' ? 'text-green-600' :
                    tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <p className="text-lg font-semibold">{tx.amount} tokens</p>
                <p className="text-sm text-gray-600">
                  {new Date(tx.timestamp * 1000).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Block #{tx.blockNumber}</p>
              </div>
              <div className="text-right">
                <a
                  href={`https://etherscan.io/tx/${tx.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View on Etherscan
                </a>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  {tx.transactionHash.slice(0, 10)}...{tx.transactionHash.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}