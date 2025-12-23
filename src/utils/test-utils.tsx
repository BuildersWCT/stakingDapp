import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock wagmi
vi.mock('../lib/wagmi', () => ({
  wagmiConfig: {
    chains: [],
    connectors: [],
    publicClient: {},
    webSocketPublicClient: {},
  },
}));

// Mock appkit
vi.mock('../lib/appkit', () => ({
  appKit: {
    open: vi.fn(),
    close: vi.fn(),
    subscribeState: vi.fn(() => vi.fn()),
  },
}));

// Mock contracts
vi.mock('../lib/contracts', () => ({
  STAKING_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  TOKEN_CONTRACT_ADDRESS: '0x0987654321098765432109876543210987654321',
  STAKING_CONTRACT_ABI: [],
  TOKEN_CONTRACT_ABI: [],
}));

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
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

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };