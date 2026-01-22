import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StakeForm from '../StakeForm';
import { render } from '../../utils/test-utils';
import { mockWagmiHooks, mockContractWrite, setupWeb3Mocks, cleanupWeb3Mocks } from '../../utils/mock-web3';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: mockWagmiHooks.useAccount,
  useBalance: mockWagmiHooks.useBalance,
  useContractWrite: mockWagmiHooks.useContractWrite,
  useWaitForTransaction: mockWagmiHooks.useWaitForTransaction,
}));

describe('StakeForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    setupWeb3Mocks();
    
    // Default mock returns
    mockWagmiHooks.useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    });
    
    mockWagmiHooks.useBalance.mockReturnValue({
      data: {
        formatted: '10.0',
        value: '10000000000000000000',
        symbol: 'TOKEN',
      },
      isLoading: false,
      isError: false,
    });
    
    mockWagmiHooks.useContractWrite.mockReturnValue({
      write: mockContractWrite.stake,
      isLoading: false,
      isError: false,
      reset: vi.fn(),
    });
    
    mockWagmiHooks.useWaitForTransaction.mockReturnValue({
      data: { status: 1 },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanupWeb3Mocks();
  });

  it('renders staking form when wallet is connected', () => {
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('stake-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByTestId('stake-button')).toBeInTheDocument();
  });

  it('displays user balance', () => {
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText(/balance: 10.0 TOKEN/i)).toBeInTheDocument();
  });

  it('validates input amount', async () => {
    const user = userEvent.setup();
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/amount/i);
    const stakeButton = screen.getByTestId('stake-button');
    
    // Test invalid amount (greater than balance)
    await user.clear(input);
    await user.type(input, '15'); // More than balance
    
    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
    expect(stakeButton).toBeDisabled();
  });

  it('allows valid staking amount', async () => {
    const user = userEvent.setup();
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/amount/i);
    const stakeButton = screen.getByTestId('stake-button');
    
    await user.clear(input);
    await user.type(input, '5'); // Valid amount
    
    expect(stakeButton).not.toBeDisabled();
  });

  it('handles max button click', async () => {
    const user = userEvent.setup();
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const maxButton = screen.getByTestId('max-button');
    const input = screen.getByLabelText(/amount/i);
    
    await user.click(maxButton);
    
    expect(input).toHaveValue('10.0');
  });

  it('submits staking transaction', async () => {
    const user = userEvent.setup();
    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/amount/i);
    const stakeButton = screen.getByTestId('stake-button');
    
    await user.clear(input);
    await user.type(input, '5');
    await user.click(stakeButton);
    
    expect(mockContractWrite.stake).toHaveBeenCalledWith({
      args: ['5000000000000000000'], // 5 tokens in wei
    });
  });

  it('shows loading state during transaction', () => {
    mockWagmiHooks.useContractWrite.mockReturnValue({
      write: mockContractWrite.stake,
      isLoading: true,
      isError: false,
      reset: vi.fn(),
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('staking-loading')).toBeInTheDocument();
    expect(screen.getByText(/staking\.\.\./i)).toBeInTheDocument();
  });

  it('handles transaction success', async () => {
    mockWagmiHooks.useWaitForTransaction.mockReturnValue({
      data: { status: 1, hash: '0x1234567890123456789012345678901234567890123456789012345678901234' },
      isLoading: false,
      isError: false,
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles transaction error', () => {
    mockWagmiHooks.useContractWrite.mockReturnValue({
      write: mockContractWrite.stake,
      isLoading: false,
      isError: true,
      reset: vi.fn(),
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('staking-error')).toBeInTheDocument();
    expect(screen.getByText(/staking failed/i)).toBeInTheDocument();
  });

  it('disables form when wallet is not connected', () => {
    mockWagmiHooks.useAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('connect-wallet-prompt')).toBeInTheDocument();
    expect(screen.queryByTestId('stake-form')).not.toBeInTheDocument();
  });

  it('handles balance loading state', () => {
    mockWagmiHooks.useBalance.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('balance-loading')).toBeInTheDocument();
  });

  it('handles balance error state', () => {
    mockWagmiHooks.useBalance.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByTestId('balance-error')).toBeInTheDocument();
  });

  it('resets form after successful transaction', async () => {
    const user = userEvent.setup();
    mockWagmiHooks.useWaitForTransaction.mockReturnValue({
      data: { status: 1 },
      isLoading: false,
      isError: false,
    });

    render(<StakeForm onSuccess={mockOnSuccess} />);
    
    const input = screen.getByLabelText(/amount/i);
    await user.clear(input);
    await user.type(input, '5');
    
    // Simulate successful transaction
    fireEvent.click(screen.getByTestId('stake-button'));
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});