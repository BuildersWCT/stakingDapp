import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import AnalyticsDashboard from '../AnalyticsDashboard';
import { render } from '../../utils/test-utils';

// Mock recharts to avoid canvas rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}));

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AnalyticsDashboard />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    // Loading skeleton should be present
    expect(screen.getAllByText('animate-pulse')).toBeTruthy();
  });

  it('renders analytics data after loading', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Current APY')).toBeInTheDocument();
    });

    // Check personal metrics
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('8.7%')).toBeInTheDocument(); // ROI
    expect(screen.getByText('9.2%')).toBeInTheDocument(); // Time-weighted return
    expect(screen.getByText('$850.75')).toBeInTheDocument(); // Profit/Loss

    // Check chart titles
    expect(screen.getByText('APY Trends Over Time')).toBeInTheDocument();
    expect(screen.getByText('Rewards vs Staked Amount')).toBeInTheDocument();
    expect(screen.getByText('Performance vs Protocol Average')).toBeInTheDocument();
    expect(screen.getByText('Protocol Health Breakdown')).toBeInTheDocument();

    // Check export functionality
    expect(screen.getByText('Export Analytics Data')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('displays analytics overview information', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Staking Analytics Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Comprehensive analytics for your staking performance/)).toBeInTheDocument();
    expect(screen.getByText(/Personal Metrics:/)).toBeInTheDocument();
    expect(screen.getByText(/Protocol Stats:/)).toBeInTheDocument();
  });

  it('renders all chart components', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('handles CSV export functionality', async () => {
    // Mock URL.createObjectURL and document methods
    const mockCreateObjectURL = vi.fn(() => 'mock-url');
    const mockClick = vi.fn();
    const mockRemove = vi.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = vi.fn();

    // Mock document methods
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'a') {
        return {
          setAttribute: vi.fn(),
          click: mockClick,
          style: {},
        };
      }
      return originalCreateElement.call(document, tagName);
    });

    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = mockRemove;

    const originalRemoveChild = document.body.removeChild;
    document.body.removeChild = mockRemove;

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Export CSV');
    exportButton.click();

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();

    // Restore original methods
    global.URL.createObjectURL = vi.fn();
    document.createElement = originalCreateElement;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
  });

  it('displays help icons with tooltips', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getAllByTestId('help-icon')).toHaveLength(4); // One for each metric card
    });
  });

  it('shows protocol health metrics', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Protocol Health Breakdown')).toBeInTheDocument();
    });

    // Check that pie chart data is rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders comparative performance data', async () => {
    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Performance vs Protocol Average')).toBeInTheDocument();
    });

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});