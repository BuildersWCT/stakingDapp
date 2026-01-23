interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
  silent?: boolean;
}



class PushNotificationService {
  private permission: NotificationPermission = 'default';
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    // Request permission on service initialization
    await this.requestPermission();

    // Get service worker registration
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        this.registration = registration;
      } catch (error) {
        console.error('Failed to get service worker registration:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      this.permission = await Notification.requestPermission();
    } else {
      this.permission = Notification.permission;
    }

    return this.permission;
  }

  async showNotification(options: PushNotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: options.body,
        icon: options.icon || '/pwa-192x192.svg',
        badge: options.badge || '/pwa-192x192.svg',
        tag: options.tag || 'crystal-stakes',
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      };

      // Note: actions are not supported in all browsers, so we skip them for compatibility

      if (this.registration) {
        // Show notification through service worker
        await this.registration.showNotification(options.title, notificationOptions);
      } else {
        // Fallback to regular notification
        new Notification(options.title, notificationOptions);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Predefined notification methods for staking events
  async notifyTransactionQueued(type: 'approve' | 'stake' | 'unstake' | 'claim', amount?: string): Promise<void> {
    const messages = {
      approve: `Approval transaction queued for ${amount || 'tokens'}`,
      stake: `Stake transaction queued for ${amount || 'tokens'}`,
      unstake: `Unstake transaction queued for ${amount || 'tokens'}`,
      claim: 'Claim rewards transaction queued'
    };

    await this.showNotification({
      title: 'Transaction Queued',
      body: messages[type],
      tag: 'transaction-queued',
      data: { type, amount, timestamp: Date.now() }
    });
  }

  async notifyTransactionSuccess(type: 'approve' | 'stake' | 'unstake' | 'claim', amount?: string): Promise<void> {
    const messages = {
      approve: `Successfully approved ${amount || 'tokens'}`,
      stake: `Successfully staked ${amount || 'tokens'}`,
      unstake: `Successfully unstaked ${amount || 'tokens'}`,
      claim: 'Successfully claimed rewards'
    };

    await this.showNotification({
      title: 'Transaction Confirmed',
      body: messages[type],
      tag: 'transaction-success',
      data: { type, amount, timestamp: Date.now() }
    });
  }

  async notifyTransactionFailed(type: 'approve' | 'stake' | 'unstake' | 'claim', error: string, retries: number): Promise<void> {
    const messages = {
      approve: `Approval transaction failed: ${error}`,
      stake: `Stake transaction failed: ${error}`,
      unstake: `Unstake transaction failed: ${error}`,
      claim: `Claim transaction failed: ${error}`
    };

    await this.showNotification({
      title: 'Transaction Failed',
      body: `${messages[type]} (Attempt ${retries + 1})`,
      tag: 'transaction-failed',
      data: { type, error, retries, timestamp: Date.now() },
      requireInteraction: true
    });
  }

  async notifyOfflineMode(): Promise<void> {
    await this.showNotification({
      title: 'Offline Mode',
      body: 'You\'re offline. Transactions will be queued and synced when you\'re back online.',
      tag: 'offline-mode',
      data: { timestamp: Date.now() },
      silent: true
    });
  }

  async notifyBackOnline(): Promise<void> {
    await this.showNotification({
      title: 'Back Online',
      body: 'Connection restored. Syncing queued transactions...',
      tag: 'back-online',
      data: { timestamp: Date.now() }
    });
  }

  async notifyStakingRewards(amount: string): Promise<void> {
    await this.showNotification({
      title: 'Rewards Available',
      body: `You have ${amount} Crystal tokens ready to claim!`,
      tag: 'staking-rewards',
      data: { amount, timestamp: Date.now() }
    });
  }

  async notifyDependencyConflict(reason: string): Promise<void> {
    await this.showNotification({
      title: 'Transaction Dependency Conflict',
      body: `A queued transaction cannot be processed: ${reason}. Please check your staking balance or resolve the issue.`,
      tag: 'dependency-conflict',
      data: { reason, timestamp: Date.now() },
      requireInteraction: true
    });
  }

  async notifyPriceAlert(price: string, change: string): Promise<void> {
    const isPositive = change.startsWith('+');
    const emoji = isPositive ? '📈' : '📉';

    await this.showNotification({
      title: `${emoji} Price Alert`,
      body: `Crystal token ${change} - Current price: $${price}`,
      tag: 'price-alert',
      data: { price, change, timestamp: Date.now() }
    });
  }

  // Utility methods
  async clearAllNotifications(): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications();
      notifications.forEach(notification => notification.close());
    }
  }

  async clearNotificationsByTag(tag: string): Promise<void> {
    if (this.registration) {
      const notifications = await this.registration.getNotifications({ tag });
      notifications.forEach(notification => notification.close());
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }
}

// Create singleton instance
export const pushNotifications = new PushNotificationService();

// Listen for transaction events to show notifications
if (typeof window !== 'undefined') {
  window.addEventListener('pwa-transaction-synced', async () => {
    await pushNotifications.notifyTransactionSuccess('stake'); // Default to stake for demo
  });

  window.addEventListener('pwa-transaction-failed', async (event: Event) => {
    const customEvent = event as CustomEvent;
    const { error, retries } = customEvent.detail;
    await pushNotifications.notifyTransactionFailed('stake', error, retries);
  });

  window.addEventListener('pwa-transaction-dependency-conflict', async (event: Event) => {
    const customEvent = event as CustomEvent;
    const { reason } = customEvent.detail;
    await pushNotifications.notifyDependencyConflict(reason);
  });

  window.addEventListener('online', async () => {
    await pushNotifications.notifyBackOnline();
  });

  window.addEventListener('offline', async () => {
    await pushNotifications.notifyOfflineMode();
  });
}