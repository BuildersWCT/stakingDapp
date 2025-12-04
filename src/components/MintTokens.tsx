import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { testTokenAddress, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';

export function MintTokens() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('100');
  const [timeUntilNextMint, setTimeUntilNextMint] = useState(0);
  const [canMint, setCanMint] = useState(false);
  const { showSuccess, showError } = useNotification();

  const { writeContractAsync: mint, data: mintTxHash } = useWriteContract();

  const { isLoading: isMintLoading } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Check user's token balance
  const { data: balance } = useReadContract({
    address: testTokenAddress,
    abi: testTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Check mint eligibility
  useEffect(() => {
    if (!address) return;

    const checkMintEligibility = () => {
      const lastMintKey = `lastMint_${address}`;
      const lastMintTime = localStorage.getItem(lastMintKey);

      if (!lastMintTime) {
        setCanMint(true);
        setTimeUntilNextMint(0);
        return;
      }

      const lastMint = parseInt(lastMintTime);
      const now = Date.now();
      const timeDiff = now - lastMint;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (timeDiff >= twentyFourHours) {
        setCanMint(true);
        setTimeUntilNextMint(0);
      } else {
        setCanMint(false);
        setTimeUntilNextMint(twentyFourHours - timeDiff);
      }
    };

    checkMintEligibility();
    const interval = setInterval(checkMintEligibility, 1000); // Update every second

    return () => clearInterval(interval);
  }, [address]);

  const handleMint = async () => {
    if (!address || !amount || !canMint) return;

    // Validate amount
    const mintAmount = parseFloat(amount);
    if (mintAmount <= 0 || mintAmount > 100) {
      showError('Invalid Amount', 'Please enter an amount between 1 and 100 tokens.');
      return;
    }

    try {
      await mint({
        address: testTokenAddress,
        abi: testTokenABI,
        functionName: 'mint',
        args: [ethers.parseEther(amount.toString())],
      });

      // Store mint timestamp
      const lastMintKey = `lastMint_${address}`;
      localStorage.setItem(lastMintKey, Date.now().toString());

      setAmount('100'); // Reset to default
      showSuccess('Tokens Minted!', `Successfully minted ${amount} HAPG tokens!`);
    } catch (error) {
      console.error('Mint failed:', error);
      showError('Mint Failed', error instanceof Error ? error.message : 'Mint failed. Please try again.');
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mint Test Tokens</h3>
          <p className="text-sm text-gray-600">Get tokens instantly to test staking</p>
        </div>
      </div>

      {address && (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-600">
            Your Balance: <span className="font-semibold text-purple-600">
              {balance ? parseFloat(ethers.formatEther(balance as bigint)).toFixed(2) : '0.00'} HAPG
            </span>
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Mint (Max: 100 tokens)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value > 100) {
                setAmount('100');
              } else if (value < 0) {
                setAmount('0');
              } else {
                setAmount(e.target.value);
              }
            }}
            placeholder="100"
            min="1"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white font-medium"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Rate limit: Once per 24 hours, maximum 100 tokens
          </p>
        </div>

        {!canMint && timeUntilNextMint > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Cooldown Active
                </p>
                <p className="text-sm text-amber-700">
                  Next mint available in: {formatTime(timeUntilNextMint)}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleMint}
          disabled={!address || !amount || !canMint || isMintLoading || parseFloat(amount) > 100}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-500/30 btn-crystal-primary btn-glow-purple btn-ripple shadow-crystal"
        >
          {isMintLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Minting...
            </div>
          ) : !canMint ? (
            'Cooldown Active'
          ) : parseFloat(amount) > 100 ? (
            'Maximum 100 tokens'
          ) : (
            `Mint ${amount || '0'} TEST Tokens`
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Rate Limited:</strong> One mint per 24 hours, maximum 100 tokens
        </p>
        <p className="text-xs text-blue-800 mt-1">
          <strong>Fair Usage:</strong> Prevents spam and ensures everyone gets a chance to test
        </p>
      </div>
    </div>
  );
}
