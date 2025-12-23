import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../App';
import { 
  mockEthereum, 
  mockAccount, 
  mockChain, 
  mockContractRead, 
  mockContractWrite,
  setupWeb3Mocks, 
  cleanupWeb3Mocks 
} from '../../utils/mock-web3';

// Mock all external dependencies
vi.mock('../../lib/wagmi', () => ({
  wagmiConfig: {
    chains: [],
    connectors: [],
    publicClient: {},
    webSocketPublicClient: {},
  },
}));

vi.mock('../../lib/appkit', () => ({
  appKit: {
    open: vi.fn(),
    close: vi.fn(),
    subscribeState: vi.fn(() => vi.fn()),
  },
}));

vi.mock('../../lib/contracts', () => ({
  STAKING_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  TOKEN_CONTRACT_ADDRESS: '0x0987654321098765432109876543210987654321',
  STAKING_CONTRACT_ABI: [],
  TOKEN_CONTRACT_ABI: [],
}));

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useBalance: vi.fn(),
  useChainId: vi.fn(),
  useContractRead: vi.fn(),
  useContractWrite: vi.fn(),
  useWaitForTransaction: vi.fn(),
}));

import { 
  useAccount, 
  useBalance, 
  useChainId, 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction 
} from 'wagmi';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={{} as any}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  );
};

describe('Web3 Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWeb3Mocks();
    
    // Default mock implementations
    (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
      address: mockAccount.address,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });
    
    (useBalance as vi.MockedFunction<typeof useBalance>).mockReturnValue({
      data: {
        formatted: '10.0',
        value: mockAccount.balance,
        symbol: 'ETH',
      },
      isLoading: false,
      isError: false,
    });
    
    (useChainId as vi.MockedFunction<typeof useChainId>).mockReturnValue(mockChain.id);
    
    (useContractRead as vi.MockedFunction<typeof useContractRead>).mockReturnValue({
      data: mockContractRead.stakeTokenBalance,
      isLoading: false,
      isError: false,
    });
    
    (useContractWrite as vi.MockedFunction<typeof useContractWrite>).mockReturnValue({
      write: mockContractWrite.stake,
      isLoading: false,
      isError: false,
      reset: vi.fn(),
    });
    
    (useWaitForTransaction as vi.MockedFunction<typeof useWaitForTransaction>).mockReturnValue({
      data: { status: 1 },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanupWeb3Mocks();
  });

  describe('Wallet Connection Integration', () => {
    it('handles wallet connection state changes', async () => {
      (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('connect-wallet-button')).toBeInTheDocument();
      
      // Simulate connection
      (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
        address: mockAccount.address,
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('wallet-address')).toBeInTheDocument();
      });
    });

    it('handles account changes', () => {
      const newAddress = '0x0987654321098765432109876543210987654321';
      
      (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
        address: newAddress,
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByText(/0x0987\.\.\.4321/)).toBeInTheDocument();
    });

    it('handles chain changes', () => {
      const newChainId = 137; // Polygon
      
      (useChainId as vi.MockedFunction<typeof useChainId>).mockReturnValue(newChainId);
      (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
        address: mockAccount.address,
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('network-selector')).toBeInTheDocument();
    });
  });

  describe('Contract Reading Integration', () => {
    it('reads staking balance from contract', () => {
      (useContractRead as vi.MockedFunction<typeof useContractRead>).mockReturnValue({
        data: '5000000000000000000', // 5 tokens
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByText(/5\.0/)).toBeInTheDocument();
    });

    it('handles contract read errors', () => {
      (useContractRead as vi.MockedFunction<typeof useContractRead>).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('contract-error')).toBeInTheDocument();
    });

    it('shows loading state during contract reads', () => {
      (useContractRead as vi.MockedFunction<typeof useContractRead>).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Contract Writing Integration', () => {
    it('handles staking transaction', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      const stakeInput = screen.getByLabelText(/amount/i);
      const stakeButton = screen.getByTestId('stake-button');

      await user.clear(stakeInput);
      await user.type(stakeInput, '1');
      await user.click(stakeButton);

      expect(mockContractWrite.stake).toHaveBeenCalledWith({
        args: ['1000000000000000000'], // 1 token in wei
      });
    });

    it('handles transaction confirmation', async () => {
      (useWaitForTransaction as vi.MockedFunction<typeof useWaitForTransaction>).mockReturnValue({
        data: { status: 1, hash: '0x1234567890123456789012345678901234567890123456789012345678901234' },
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('transaction-success')).toBeInTheDocument();
      });
    });

    it('handles transaction failure', () => {
      (useWaitForTransaction as vi.MockedFunction<typeof useWaitForTransaction>).mockReturnValue({
        data: { status: 0 },
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('transaction-failure')).toBeInTheDocument();
    });

    it('shows transaction pending state', () => {
      (useWaitForTransaction as vi.MockedFunction<typeof useWaitForTransaction>).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('transaction-pending')).toBeInTheDocument();
    });
  });

  describe('Balance Integration', () => {
    it('displays user token balance', () => {
      (useBalance as vi.MockedFunction<typeof useBalance>).mockReturnValue({
        data: {
          formatted: '25.5',
          value: '25500000000000000000',
          symbol: 'TOKEN',
        },
        isLoading: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByText(/balance: 25\.5 TOKEN/i)).toBeInTheDocument();
    });

    it('handles balance loading', () => {
      (useBalance as vi.MockedFunction<typeof useBalance>).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('balance-loading')).toBeInTheDocument();
    });

    it('handles balance errors', () => {
      (useBalance as vi.MockedFunction<typeof useBalance>).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('balance-error')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('handles connection errors gracefully', () => {
      (useAccount as vi.MockedFunction<typeof useAccount>).mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('connection-error')).toBeInTheDocument();
    });

    it('handles insufficient gas errors', () => {
      (useContractWrite as vi.MockedFunction<typeof useContractWrite>).mockReturnValue({
        write: vi.fn().mockRejectedValue(new Error('insufficient funds for gas')),
        isLoading: false,
        isError: true,
        reset: vi.fn(),
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
    });

    it('handles user rejection errors', () => {
      (useContractWrite as vi.MockedFunction<typeof useContractWrite>).mockReturnValue({
        write: vi.fn().mockRejectedValue(new Error('User rejected the request')),
        isLoading: false,
        isError: true,
        reset: vi.fn(),
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByText(/transaction rejected/i)).toBeInTheDocument();
    });
  });
});