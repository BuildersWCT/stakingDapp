import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationType } from './ui/NotificationToast';

// Notification preferences
export interface NotificationPreferences {
  browserNotifications: boolean;
  rewardReminders: boolean;
  transactionConfirmations: boolean;
  protocolUpdates: boolean;
  stakingAlerts: boolean;
  emergencyWarnings: boolean;
  soundEnabled: boolean;
}

// Notification context interface
interface NotificationContextType {
  notifications: Notification[];
  notificationHistory: Notification[];
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showReward: (title: string, message?: string, duration?: number) => void;
  showTransaction: (title: string, message?: string, duration?: number) => void;
  showStaking: (title: string, message?: string, duration?: number) => void;
  showEmergency: (title: string, message?: string, duration?: number) => void;
  showDependencyConflict: (reason: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Generate unique ID for notifications
const generateId = () => Math.random().toString(36).substr(2, 9);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    browserNotifications: false,
    rewardReminders: true,
    transactionConfirmations: true,
    protocolUpdates: true,
    stakingAlerts: true,
    emergencyWarnings: true,
    soundEnabled: false,
  });

  // Load preferences and history from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notificationPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
    const savedHistory = localStorage.getItem('notificationHistory');
    if (savedHistory) {
      setNotificationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  // Request browser notification permission
  useEffect(() => {
    if (preferences.browserNotifications && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [preferences.browserNotifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
      duration: notification.duration ?? 4000,
    };

    // Add to current notifications
    setNotifications(prev => [...prev, newNotification]);

    // Add to history
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100

    // Browser notification
    if (preferences.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/vite.svg', // Update with app icon
      });
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotificationHistory(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationHistory(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationHistory(prev => prev.filter(notification => notification.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotificationHistory([]);
  };

  const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  // Convenience methods for different notification types
  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration: duration ?? 6000 });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const showReward = (title: string, message?: string, duration?: number) => {
    if (preferences.rewardReminders) {
      addNotification({ type: 'reward', title, message, duration, category: 'reward' });
    }
  };

  const showTransaction = (title: string, message?: string, duration?: number) => {
    if (preferences.transactionConfirmations) {
      addNotification({ type: 'transaction', title, message, duration, category: 'transaction' });
    }
  };

  const showStaking = (title: string, message?: string, duration?: number) => {
    if (preferences.stakingAlerts) {
      addNotification({ type: 'staking', title, message, duration, category: 'staking' });
    }
  };

  const showEmergency = (title: string, message?: string, duration?: number) => {
    if (preferences.emergencyWarnings) {
      addNotification({ type: 'emergency', title, message, duration, category: 'emergency', persistent: true });
    }
  };

  const showDependencyConflict = (reason: string) => {
    addNotification({
      type: 'warning',
      title: 'Transaction Dependency Conflict',
      message: `A queued transaction cannot be processed: ${reason}. Please check your staking balance or resolve the issue.`,
      duration: 8000,
      category: 'transaction',
      persistent: true
    });
  };

  // Listen for transaction dependency conflict events
  useEffect(() => {
    const handleDependencyConflict = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { reason } = customEvent.detail;
      showDependencyConflict(reason);
    };

    window.addEventListener('pwa-transaction-dependency-conflict', handleDependencyConflict);

    return () => {
      window.removeEventListener('pwa-transaction-dependency-conflict', handleDependencyConflict);
    };
  }, []);

  const value: NotificationContextType = {
    notifications,
    notificationHistory,
    preferences,
    addNotification,
    dismissNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updatePreferences,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showReward,
    showTransaction,
    showStaking,
    showEmergency,
    showDependencyConflict,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Higher-order component to wrap components with notification access
export const withNotification = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    const notification = useNotification();
    return <Component {...props} notification={notification} />;
  };
};