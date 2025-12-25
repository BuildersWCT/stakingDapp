import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim' | 'emergency';
  amount: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
  status: 'confirmed' | 'pending' | 'failed';
}

export function TransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement subgraph queries
  useEffect(() => {
    if (address) {
      fetchTransactions();
    }
  }, [address]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement actual subgraph query
      // For now, mock data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'stake',
          amount: '1000',
          timestamp: Date.now() - 86400000,
          transactionHash: '0x123...',
          blockNumber: 123456,
          status: 'confirmed'
        }
      ];
      setTransactions(mockTransactions);
    } catch {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
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
        {/* TODO: Add filters and export buttons */}
      </div>

      {loading && <div>Loading transactions...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="text-sm text-gray-600">{tx.amount} tokens</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  tx.status === 'confirmed' ? 'text-green-600' :
                  tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {tx.status}
                </p>
                {/* TODO: Add block explorer link */}
                <p className="text-xs text-gray-500">{tx.transactionHash}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}