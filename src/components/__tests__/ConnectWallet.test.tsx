import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectWallet from '../ConnectWallet';
import { render } from '../../utils/test-utils';
import { mockWagmiHooks, setupWeb3Mocks, cleanupWeb3Mocks } from '../../utils/mock-web3';

// Mock the appkit
vi.mock('../../lib/appkit', () => ({
  appKit: {
    open: vi.fn(),
    close: vi.fn(),
    subscribeState: vi.fn(() => vi.fn()),
  },
}));

describe('ConnectWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWeb3Mocks();
    // Mock wagmi hooks
    mockWagmiHooks.useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
    });
    mockWagmiHooks.useChainId.mockReturnValue(1);
  });

  afterEach(() => {
    cleanupWeb3Mocks();
  });

  it('renders connect wallet button when not connected', () => {
    render(<ConnectWallet />);
    
    expect(screen.getByTestId('connect-wallet-button')).toBeInTheDocument();
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
  });

  it('opens wallet modal when connect button is clicked', async () => {
    const user = userEvent.setup();
    const { appKit } = await import('../../lib/appkit');
    
    render(<ConnectWallet />);
    
    await user.click(screen.getByTestId('connect-wallet-button'));
    
    expect(appKit.open).toHaveBeenCalledTimes(1);
  });

  it('displays wallet address when connected', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    expect(screen.getByTestId('wallet-address')).toBeInTheDocument();
    expect(screen.getByText(/0x1234\.\.\.7890/)).toBeInTheDocument();
  });

  it('shows disconnect option when wallet is connected', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    expect(screen.getByTestId('disconnect-wallet-button')).toBeInTheDocument();
  });

  it('shows loading state during connection', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: true,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    expect(screen.getByTestId('connecting-wallet')).toBeInTheDocument();
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();
  });

  it('handles wallet connection error gracefully', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    // Component should still render without errors
    expect(screen.getByTestId('connect-wallet-button')).toBeInTheDocument();
  });

  it('displays network information when connected', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    expect(screen.getByTestId('network-info')).toBeInTheDocument();
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument();
  });

  it('formats wallet address correctly', () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    mockWagmiHooks.useAccount.mockReturnValue({
      address: testAddress,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });

    render(<ConnectWallet />);
    
    const addressElement = screen.getByText(/0x1234\.\.\.7890/);
    expect(addressElement).toBeInTheDocument();
  });
});