// Mock window.ethereum
export const mockEthereum = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isConnected: jest.fn(() => true),
  selectedAddress: '0x1234567890123456789012345678901234567890',
};

// Mock ethereum provider
export const mockProvider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isConnected: jest.fn(() => true),
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
  stake: jest.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: jest.fn().mockResolvedValue({ status: 1 }),
  }),
  withdraw: jest.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: jest.fn().mockResolvedValue({ status: 1 }),
  }),
  claimRewards: jest.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: jest.fn().mockResolvedValue({ status: 1 }),
  }),
  emergencyWithdraw: jest.fn().mockResolvedValue({
    hash: mockTransaction.hash,
    wait: jest.fn().mockResolvedValue({ status: 1 }),
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
  jest.clearAllMocks();
};

// Mock wagmi hooks
export const mockWagmiHooks = {
  useAccount: jest.fn(() => ({
    address: mockAccount.address,
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
  })),
  useChainId: jest.fn(() => mockChain.id),
  useBalance: jest.fn(() => ({
    data: {
      formatted: '1.0',
      value: mockAccount.balance,
      symbol: 'ETH',
    },
    isLoading: false,
    isError: false,
  })),
  useWaitForTransaction: jest.fn(() => ({
    data: { status: 1 },
    isLoading: false,
    isError: false,
  })),
  useContractRead: jest.fn(() => ({
    data: mockContractRead.stakeTokenBalance,
    isLoading: false,
    isError: false,
  })),
  useContractWrite: jest.fn(() => ({
    write: jest.fn(),
    isLoading: false,
    isError: false,
  })),
};

// Mock viem client
export const mockPublicClient = {
  getBalance: jest.fn().mockResolvedValue(BigInt(mockAccount.balance)),
  getBlockNumber: jest.fn().mockResolvedValue(BigInt(1000000)),
  getTransactionCount: jest.fn().mockResolvedValue(BigInt(42)),
  readContract: jest.fn().mockResolvedValue(BigInt(mockContractRead.stakeTokenBalance)),
  simulateContract: jest.fn().mockResolvedValue({
    result: BigInt(100000),
    request: {},
  }),
};