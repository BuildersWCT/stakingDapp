import { backgroundSync } from '../backgroundSync';
import { offlineStorage } from '../offlineStorage';
import { TransactionQueue } from '../offlineStorage';

// Mock offlineStorage
jest.mock('../offlineStorage', () => ({
  offlineStorage: {
    getStakingData: jest.fn(),
    getTransactionQueue: jest.fn(),
    removeFromTransactionQueue: jest.fn(),
    updateTransactionRetryCount: jest.fn(),
  },
}));

// Mock window and navigator
Object.defineProperty(window, 'navigator', {
  value: { onLine: true },
  writable: true,
});

Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
});

describe('BackgroundSyncService - Dependency Handling', () => {
  let mockOfflineStorage: any;

  beforeEach(() => {
    mockOfflineStorage = offlineStorage as jest.Mocked<typeof offlineStorage>;
    jest.clearAllMocks();
  });

  describe('getVirtualStakingData', () => {
    it('should return base data when no transactions', () => {
      const baseData = {
        address: '0x123',
        stakedAmount: '100',
        rewards: '10',
        lastUpdated: Date.now(),
      };
      mockOfflineStorage.getStakingData.mockReturnValue(baseData);

      const service = new (backgroundSync.constructor as any)();
      const result = service.getVirtualStakingData([], 0);

      expect(result).toEqual(baseData);
    });

    it('should simulate stake transaction effects', () => {
      const baseData = {
        address: '0x123',
        stakedAmount: '100',
        rewards: '10',
        lastUpdated: Date.now(),
      };
      mockOfflineStorage.getStakingData.mockReturnValue(baseData);

      const queue: TransactionQueue[] = [
        {
          id: '1',
          type: 'stake',
          data: { amount: '50' },
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      const service = new (backgroundSync.constructor as any)();
      const result = service.getVirtualStakingData(queue, 1);

      expect(result?.stakedAmount).toBe('150'); // 100 + 50
    });

    it('should simulate unstake transaction effects', () => {
      const baseData = {
        address: '0x123',
        stakedAmount: '100',
        rewards: '10',
        lastUpdated: Date.now(),
      };
      mockOfflineStorage.getStakingData.mockReturnValue(baseData);

      const queue: TransactionQueue[] = [
        {
          id: '1',
          type: 'unstake',
          data: { amount: '30' },
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      const service = new (backgroundSync.constructor as any)();
      const result = service.getVirtualStakingData(queue, 1);

      expect(result?.stakedAmount).toBe('70'); // 100 - 30
    });

    it('should simulate claim transaction effects', () => {
      const baseData = {
        address: '0x123',
        stakedAmount: '100',
        rewards: '10',
        lastUpdated: Date.now(),
      };
      mockOfflineStorage.getStakingData.mockReturnValue(baseData);

      const queue: TransactionQueue[] = [
        {
          id: '1',
          type: 'claim',
          data: { rewardsAmount: '10' },
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      const service = new (backgroundSync.constructor as any)();
      const result = service.getVirtualStakingData(queue, 1);

      expect(result?.rewards).toBe('0'); // rewards reset to 0
    });
  });

  describe('checkTransactionDependencies', () => {
    let service: any;

    beforeEach(() => {
      service = new (backgroundSync.constructor as any)();
    });

    it('should allow approve transactions', () => {
      const transaction: TransactionQueue = {
        id: '1',
        type: 'approve',
        data: {},
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(true);
    });

    it('should allow stake transactions', () => {
      const transaction: TransactionQueue = {
        id: '1',
        type: 'stake',
        data: { amount: '50' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(true);
    });

    it('should allow unstake with sufficient balance', () => {
      mockOfflineStorage.getStakingData.mockReturnValue({
        stakedAmount: '100',
        rewards: '0',
      });

      const transaction: TransactionQueue = {
        id: '1',
        type: 'unstake',
        data: { amount: '50' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(true);
    });

    it('should reject unstake with insufficient balance', () => {
      mockOfflineStorage.getStakingData.mockReturnValue({
        stakedAmount: '30',
        rewards: '0',
      });

      const transaction: TransactionQueue = {
        id: '1',
        type: 'unstake',
        data: { amount: '50' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(false);
      expect(result.reason).toContain('Insufficient staked amount');
    });

    it('should allow claim with rewards', () => {
      mockOfflineStorage.getStakingData.mockReturnValue({
        stakedAmount: '100',
        rewards: '10',
      });

      const transaction: TransactionQueue = {
        id: '1',
        type: 'claim',
        data: { rewardsAmount: '10' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(true);
    });

    it('should reject claim with no rewards', () => {
      mockOfflineStorage.getStakingData.mockReturnValue({
        stakedAmount: '100',
        rewards: '0',
      });

      const transaction: TransactionQueue = {
        id: '1',
        type: 'claim',
        data: { rewardsAmount: '0' },
        timestamp: Date.now(),
        retryCount: 0,
      };

      const result = service.checkTransactionDependencies(transaction, [], 0);
      expect(result.canExecute).toBe(false);
      expect(result.reason).toContain('No rewards available');
    });

    it('should handle virtual state from previous transactions', () => {
      mockOfflineStorage.getStakingData.mockReturnValue({
        stakedAmount: '50',
        rewards: '0',
      });

      const queue: TransactionQueue[] = [
        {
          id: '1',
          type: 'stake',
          data: { amount: '50' },
          timestamp: Date.now(),
          retryCount: 0,
        },
        {
          id: '2',
          type: 'unstake',
          data: { amount: '80' }, // 50 base + 50 stake = 100, so 80 should be ok
          timestamp: Date.now(),
          retryCount: 0,
        },
      ];

      const result = service.checkTransactionDependencies(queue[1], queue, 1);
      expect(result.canExecute).toBe(true);
    });
  });
});