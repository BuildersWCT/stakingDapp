import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RewardsCalculator } from '../RewardsCalculator';
import { render } from '../../utils/test-utils';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useReadContract: vi.fn(),
}));

const mockUseReadContract = vi.mocked(require('wagmi').useReadContract);

describe('RewardsCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for currentRewardRate
    mockUseReadContract.mockReturnValue({
      data: 500, // 5% APR (500 basis points)
      isLoading: false,
      error: null,
    });
  });

  it('renders the calculator with input fields', () => {
    render(<RewardsCalculator />);

    expect(screen.getByText('Rewards Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText(/stake amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByText('Current APR')).toBeInTheDocument();
    expect(screen.getByText('Projected Rewards')).toBeInTheDocument();
  });

  it('displays current APR correctly', () => {
    render(<RewardsCalculator />);

    expect(screen.getByText('5.00%')).toBeInTheDocument();
  });

  it('calculates projected rewards correctly', async () => {
    render(<RewardsCalculator />);

    const amountInput = screen.getByPlaceholderText('Enter amount to stake');
    const durationInput = screen.getByPlaceholderText('Enter duration');

    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(durationInput, { target: { value: '365' } });

    await waitFor(() => {
      expect(screen.getByText('50.0000 HAPG')).toBeInTheDocument();
    });
  });

  it('updates calculation when duration unit changes', async () => {
    render(<RewardsCalculator />);

    const amountInput = screen.getByPlaceholderText('Enter amount to stake');
    const durationInput = screen.getByPlaceholderText('Enter duration');
    const unitSelect = screen.getByRole('combobox');

    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(durationInput, { target: { value: '1' } });
    fireEvent.change(unitSelect, { target: { value: 'years' } });

    await waitFor(() => {
      expect(screen.getByText('50.0000 HAPG')).toBeInTheDocument();
    });
  });

  it('shows preset buttons for quick selection', () => {
    render(<RewardsCalculator />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('1K')).toBeInTheDocument();
    expect(screen.getByText('10K')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();
    expect(screen.getByText('6 Months')).toBeInTheDocument();
    expect(screen.getByText('1 Year')).toBeInTheDocument();
  });

  it('updates amount when preset button is clicked', async () => {
    render(<RewardsCalculator />);

    const amountInput = screen.getByPlaceholderText('Enter amount to stake');
    const presetButton = screen.getByText('1K');

    fireEvent.click(presetButton);

    await waitFor(() => {
      expect(amountInput).toHaveValue('1000');
    });
  });

  it('updates duration and unit when preset button is clicked', async () => {
    render(<RewardsCalculator />);

    const durationInput = screen.getByPlaceholderText('Enter duration');
    const unitSelect = screen.getByRole('combobox');
    const presetButton = screen.getByText('1 Year');

    fireEvent.click(presetButton);

    await waitFor(() => {
      expect(durationInput).toHaveValue('1');
      expect(unitSelect).toHaveValue('years');
    });
  });

  it('displays total return and ROI when inputs are provided', async () => {
    render(<RewardsCalculator />);

    const amountInput = screen.getByPlaceholderText('Enter amount to stake');
    const durationInput = screen.getByPlaceholderText('Enter duration');

    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(durationInput, { target: { value: '365' } });

    await waitFor(() => {
      expect(screen.getByText(/total return:/i)).toBeInTheDocument();
      expect(screen.getByText(/roi:/i)).toBeInTheDocument();
      expect(screen.getByText('1050.0000 HAPG')).toBeInTheDocument();
      expect(screen.getByText('5.00%')).toBeInTheDocument();
    });
  });

  it('shows loading state for APR', () => {
    mockUseReadContract.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<RewardsCalculator />);

    expect(screen.getByText('Loading APR...')).toBeInTheDocument();
  });
});