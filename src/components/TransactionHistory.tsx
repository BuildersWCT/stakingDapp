import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { client, GET_USER_TRANSACTIONS } from '../lib/subgraph';

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

  // TODO: Implement subgraph queries
  useEffect(() => {
    if (address) {
      fetchTransactions();
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