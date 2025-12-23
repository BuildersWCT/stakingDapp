import { vi } from 'vitest';

// Mock window.ethereum
export const mockEthereum = {
  isMetaMask: true,
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  isConnected: vi.fn(() => true),
  selectedAddress: '0x1234567890123456789012345678901234567890',
};

// Mock ethereum provider
export const mockProvider = {
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  isConnected: vi.fn(() => true),
  selectedAddress: '0x1234567890123456789012345678901234567890',
};

// Mock account data
export const mockAccount = {
  address: '0x1234567890123456789012345678901234567890',
  balance: '1000000000000000000', // 1 ETH in wei
  chainId: 1,
};

// Mock chain data
export const mockChain = {
  id: 1,
  name: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.infura.io/v3/'],
};

// Mock transaction data
export const mockTransaction = {
  hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
  from: '0x1234567890123456789012345678901234567890',
  to: '0x0987654321098765432109876543210987654321',
  value: '1000000000000000000', // 1 ETH in wei
  gasPrice: '20000000000', // 20 gwei
  gasLimit: '21000',
};

// Mock contract interactions
export const mockContractRead = {
  stakeTokenBalance: '5000000000000000000', // 5 tokens
  stakingRewards: '1000000000000000000', // 1 token reward
  totalStaked: '100000000000000000000', // 100 tokens total
  isStakingPaused: false,
  emergencyWithdrawEnabled: false,
};

// Mock contract write operations
export const mockContractWrite = {
  stake: vi.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: vi.fn().mockResolvedValue({ status: 1 }),
  }),
  withdraw: vi.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: vi.fn().mockResolvedValue({ status: 1 }),
  }),
  claimRewards: vi.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: vi.fn().mockResolvedValue({ status: 1 }),
  }),
  emergencyWithdraw: vi.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: vi.fn().mockResolvedValue({ status: 1 }),
  }),
};

// Setup global mocks
export const setupWeb3Mocks = () => {
  // Mock window.ethereum
  Object.defineProperty(window, 'ethereum', {
    value: mockEthereum,
    writable: true,
  });

  // Mock ethereum.request for different methods
  mockEthereum.request.mockImplementation((args: any) => {
    switch (args.method) {
      case 'eth_accounts':
        return Promise.resolve([mockAccount.address]);
      case 'eth_chainId':
        return Promise.resolve('0x1'); // Chain ID 1
      case 'eth_getBalance':
        return Promise.resolve(mockAccount.balance);
      case 'eth_sendTransaction':
        return Promise.resolve(mockTransaction.hash);
      default:
        return Promise.resolve(null);
    }
  });

  // Mock ethereum.on for event listeners
  mockEthereum.on.mockImplementation((event: string, callback: any) => {
    if (event === 'accountsChanged') {
      // Simulate account change
      setTimeout(() => callback([mockAccount.address]), 100);
    }
    if (event === 'chainChanged') {
      // Simulate chain change
      setTimeout(() => callback('0x1'), 100);
    }
  });
};

// Cleanup mocks
export const cleanupWeb3Mocks = () => {
  vi.clearAllMocks();
};

// Mock wagmi hooks
export const mockWagmiHooks = {
  useAccount: vi.fn(() => ({
    address: mockAccount.address,
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
  })),
  useChainId: vi.fn(() => mockChain.id),
  useBalance: vi.fn(() => ({
    data: {
      formatted: '1.0',
      value: mockAccount.balance,
      symbol: 'ETH',
    },
    isLoading: false,
    isError: false,
  })),
  useWaitForTransaction: vi.fn(() => ({
    data: { status: 1 },
    isLoading: false,
    isError: false,
  })),
  useContractRead: vi.fn(() => ({
    data: mockContractRead.stakeTokenBalance,
    isLoading: false,
    isError: false,
  })),
  useContractWrite: vi.fn(() => ({
    write: vi.fn(),
    isLoading: false,
    isError: false,
  })),
};

// Mock viem client
export const mockPublicClient = {
  getBalance: vi.fn().mockResolvedValue(BigInt(mockAccount.balance)),
  getBlockNumber: vi.fn().mockResolvedValue(BigInt(1000000)),
  getTransactionCount: vi.fn().mockResolvedValue(BigInt(42)),
  readContract: vi.fn().mockResolvedValue(BigInt(mockContractRead.stakeTokenBalance)),
  simulateContract: vi.fn().mockResolvedValue({
    result: BigInt(100000),
    request: {},
  }),
};