import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { testTokenAddress, testTokenABI } from '../lib/contracts';
import { ethers } from 'ethers';
import { useNotification } from './NotificationProvider';
import { Tooltip, HelpIcon, InfoCard, EnhancedInput, ButtonSpinner } from './ui';
import { StepIndicator, mintingSteps, ProgressBar, TransactionProgressBar, SkeletonLoader, CircularProgress } from './ui/index';

export function MintTokens() {
  const { address } = useAccount();
  const [amount, setAmount] = useState('100');
  const [timeUntilNextMint, setTimeUntilNextMint] = useState(0);
  const [canMint, setCanMint] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { showSuccess, showError } = useNotification();

  const { writeContractAsync: mint, data: mintTxHash } = useWriteContract();

  const { isLoading: isMintLoading } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Check user's token balance with loading state
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
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
      setIsMinting(true);
      
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
      setIsMinting(false);
      showSuccess('Tokens Minted!', `Successfully minted ${amount} HAPG tokens!`);
    } catch (error) {
      console.error('Mint failed:', error);
      setIsMinting(false);
      showError('Mint Failed', error instanceof Error ? error.message : 'Mint failed. Please try again.');
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Calculate cooldown progress
  const cooldownProgress = timeUntilNextMint > 0 
    ? ((24 * 60 * 60 * 1000 - timeUntilNextMint) / (24 * 60 * 60 * 1000)) * 100 
    : 100;

  // Get step indicator data
  const steps = mintingSteps(isMinting);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Mint Test Tokens</h3>
          <p className="text-sm text-gray-600">Get tokens instantly to test staking</p>
        </div>
        <HelpIcon
          content="Mint free test HAPG tokens for demo purposes. These tokens work exactly like real tokens but have no real value."
          position="left"
          variant="primary"
          size="sm"
        />
      </div>

      {/* Minting Information */}
      <InfoCard
        title="About Test Token Minting"
        description={
          <div className="space-y-2">
            <p>Mint free HAPG test tokens to explore the Crystal Stakes protocol without using real funds.</p>
            <div className="text-xs space-y-1">
              <p>• <strong>Purpose:</strong> Testing and demonstration only</p>
              <p>• <strong>Value:</strong> No real monetary value</p>
              <p>• <strong>Rate Limit:</strong> Once per 24 hours to prevent abuse</p>
              <p>• <strong>Gas Fees:</strong> No gas fees required for minting</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
              <p className="text-xs text-amber-700 font-medium">⚠️ Note: Test tokens are for demo purposes only and cannot be exchanged for real value.</p>
            </div>
          </div>
        }
        variant="info"
        helpContent="Test tokens allow you to experience the full staking workflow safely without financial risk."
        collapsible={true}
        defaultExpanded={false}
      />

      {/* Progress Step Indicator */}
      {isMinting && (
        <div className="mb-4 crystal-glass rounded-2xl p-4">
          <StepIndicator
            steps={steps}
            variant="horizontal"
            showConnectors={true}
          />
        </div>
      )}

      {/* Transaction Progress Bar */}
      {(isMinting || isMintLoading) && (
        <div className="mb-4">
          <TransactionProgressBar
            status="processing"
            message="Minting your test tokens..."
          />
        </div>
      )}

      {/* Balance Display */}
      {isBalanceLoading ? (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <SkeletonLoader variant="text" width="60%" />
        </div>
      ) : address && balance ? (
        <div className="mb-4 p-3 bg-white rounded-lg border">
          <p className="text-sm text-gray-600">
            Your Balance: <span className="font-semibold text-purple-600">
              {parseFloat(ethers.formatEther(balance as bigint)).toFixed(2)} HAPG
            </span>
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <EnhancedInput
            label="Amount to Mint (Max: 100 tokens)"
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
            disabled={isMinting}
            variant="crystal"
            size="lg"
            helpText="Enter the number of test tokens you want to mint. Minimum 1 token, maximum 100 tokens per 24-hour period."
            error={
              parseFloat(amount) > 100 
                ? "Maximum 100 tokens allowed per mint"
                : parseFloat(amount) < 1 && amount !== ""
                ? "Minimum 1 token required"
                : !canMint 
                ? "Mint cooldown active"
                : undefined
            }
            success={
              amount && parseFloat(amount) >= 1 && parseFloat(amount) <= 100 && canMint
                ? true
                : undefined
            }
          />
          
          {/* Progress bar for mint amount */}
          {amount && (
            <div className="mt-3">
              <ProgressBar
                value={Math.min((parseFloat(amount) / 100) * 100, 100)}
                label={`${amount} tokens (${parseFloat(amount)}% of max)`}
                variant={parseFloat(amount) <= 100 ? 'success' : 'danger'}
                size="sm"
                showPercentage={false}
              />
            </div>
          )}
          
          <p className="text-xs text-white/70 mt-2 flex items-center space-x-1">
            <span>💡</span>
            <span>Rate limit: Once per 24 hours, maximum 100 tokens</span>
          </p>
        </div>

        {/* Cooldown Timer with Progress */}
        {!canMint && timeUntilNextMint > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
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
              <CircularProgress
                value={cooldownProgress}
                size={50}
                strokeWidth={4}
                variant="warning"
                showLabel={false}
              />
            </div>
            
            {/* Cooldown progress bar */}
            <ProgressBar
              value={cooldownProgress}
              label="Time until next mint"
              variant="warning"
              size="sm"
              animated={true}
            />
          </div>
        )}

        {/* Rate limit progress for minting frequency */}
        {canMint && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Ready to mint!</span>
              <CircularProgress
                value={100}
                size={30}
                strokeWidth={3}
                variant="success"
                showLabel={false}
              />
            </div>
            <ProgressBar
              value={100}
              label="Mint available"
              variant="success"
              size="sm"
              animated={true}
            />
          </div>
        )}

        <Tooltip content={isMinting ? "Creating your test tokens..." : "Get test tokens for the demo"}>
          <button
            onClick={handleMint}
            disabled={!address || !amount || !canMint || isMintLoading || isMinting || parseFloat(amount) > 100}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-500/30 btn-crystal-primary btn-glow-purple btn-ripple shadow-crystal ${(isMinting || isMintLoading) ? 'opacity-75' : ''}`}
          >
            {isMinting || isMintLoading ? (
              <div className="flex items-center justify-center">
                <ButtonSpinner color="white" />
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
        </Tooltip>
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
