import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, useNotifications } from '../NotificationProvider';
import { render } from '../../utils/test-utils';

// Test component to access notifications context
const TestComponent = () => {
  const { addNotification, removeNotification, notifications } = useNotifications();

  return (
    <div>
      <button 
        data-testid="add-success" 
        onClick={() => addNotification('success', 'Test success message')}
      >
        Add Success
      </button>
      <button 
        data-testid="add-error" 
        onClick={() => addNotification('error', 'Test error message')}
      >
        Add Error
      </button>
      <button 
        data-testid="add-warning" 
        onClick={() => addNotification('warning', 'Test warning message')}
      >
        Add Warning
      </button>
      <button 
        data-testid="add-info" 
        onClick={() => addNotification('info', 'Test info message')}
      >
        Add Info
      </button>
      <div data-testid="notifications-count">{notifications.length}</div>
      {notifications.map((notification, index) => (
        <div key={notification.id} data-testid={`notification-${index}`}>
          <span>{notification.message}</span>
          <button 
            data-testid={`remove-${index}`}
            onClick={() => removeNotification(notification.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

const TestWrapper = () => (
  <NotificationProvider>
    <TestComponent />
  </NotificationProvider>
);

describe('NotificationProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NotificationProvider />);
  });

  it('provides notifications context to children', () => {
    render(<TestWrapper />);
    
    expect(screen.getByTestId('add-success')).toBeInTheDocument();
    expect(screen.getByTestId('add-error')).toBeInTheDocument();
    expect(screen.getByTestId('add-warning')).toBeInTheDocument();
    expect(screen.getByTestId('add-info')).toBeInTheDocument();
  });

  it('adds success notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-success'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  it('adds error notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-error'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('adds warning notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-warning'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    expect(screen.getByText('Test warning message')).toBeInTheDocument();
  });

  it('adds info notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-info'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    expect(screen.getByText('Test info message')).toBeInTheDocument();
  });

  it('removes notifications when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    // Add a notification
    await user.click(screen.getByTestId('add-success'));
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    
    // Remove the notification
    await user.click(screen.getByTestId('remove-0'));
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  it('handles multiple notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-success'));
    await user.click(screen.getByTestId('add-error'));
    await user.click(screen.getByTestId('add-warning'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('3');
    expect(screen.getAllByText(/Test (success|error|warning) message/)).toHaveLength(3);
  });

  it('auto-removes notifications after timeout', async () => {
    vi.useFakeTimers();
    
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-success'));
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    
    // Fast forward time by 5 seconds (default timeout)
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
    });
    
    vi.useRealTimers();
  });

  it('generates unique IDs for notifications', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-success'));
    await user.click(screen.getByTestId('add-success'));
    
    const notificationElements = screen.getAllByText('Test success message');
    expect(notificationElements).toHaveLength(2);
    
    // Check that both notifications are rendered (they have different IDs internally)
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('2');
  });

  it('handles empty notification list initially', () => {
    render(<TestWrapper />);
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  it('does not crash when trying to remove non-existent notification', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    // Try to remove notification with non-existent ID
    const { removeNotification } = useNotifications();
    expect(() => removeNotification('non-existent-id')).not.toThrow();
  });

  it('applies correct CSS classes for different notification types', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    await user.click(screen.getByTestId('add-success'));
    const notification = screen.getByText('Test success message').closest('[data-testid^="notification-"]');
    
    expect(notification).toHaveClass('notification', 'notification--success');
  });

  it('handles rapid notification additions and removals', async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    
    // Add multiple notifications rapidly
    await user.click(screen.getByTestId('add-success'));
    await user.click(screen.getByTestId('add-error'));
    await user.click(screen.getByTestId('add-warning'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('3');
    
    // Remove them rapidly
    await user.click(screen.getByTestId('remove-0'));
    await user.click(screen.getByTestId('remove-0'));
    await user.click(screen.getByTestId('remove-0'));
    
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });
});