import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'reward' | 'transaction' | 'staking' | 'emergency';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  timestamp?: Date;
  read?: boolean;
  category?: string;
  persistent?: boolean;
  actionUrl?: string;
}

// Checkmark SVG component for success animations
const CheckmarkIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    <motion.path
      d="M9 12l2 2 4-4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
    />
  </motion.svg>
);

// Icon components for different notification types
const SuccessIcon = ({ isVisible }: { isVisible: boolean }) => (
  <div className="text-green-400">
    <CheckmarkIcon isVisible={isVisible} />
  </div>
);

const ErrorIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-red-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </motion.svg>
);

const InfoIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-blue-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </motion.svg>
);

const WarningIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-yellow-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </motion.svg>
);

const RewardIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-purple-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </motion.svg>
);

const TransactionIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-indigo-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </motion.svg>
);

const StakingIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-green-400"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </motion.svg>
);

const EmergencyIcon = ({ isVisible }: { isVisible: boolean }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-red-500"
    initial={{ scale: 0, opacity: 0 }}
    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </motion.svg>
);

const getIcon = (type: NotificationType, isVisible: boolean) => {
  switch (type) {
    case 'success':
      return <SuccessIcon isVisible={isVisible} />;
    case 'error':
      return <ErrorIcon isVisible={isVisible} />;
    case 'info':
      return <InfoIcon isVisible={isVisible} />;
    case 'warning':
      return <WarningIcon isVisible={isVisible} />;
    case 'reward':
      return <RewardIcon isVisible={isVisible} />;
    case 'transaction':
      return <TransactionIcon isVisible={isVisible} />;
    case 'staking':
      return <StakingIcon isVisible={isVisible} />;
    case 'emergency':
      return <EmergencyIcon isVisible={isVisible} />;
    default:
      return <InfoIcon isVisible={isVisible} />;
  }
};

const getBackgroundColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'reward':
      return 'bg-purple-50 border-purple-200';
    case 'transaction':
      return 'bg-indigo-50 border-indigo-200';
    case 'staking':
      return 'bg-emerald-50 border-emerald-200';
    case 'emergency':
      return 'bg-red-100 border-red-300';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'info':
      return 'text-blue-800';
    case 'warning':
      return 'text-yellow-800';
    case 'reward':
      return 'text-purple-800';
    case 'transaction':
      return 'text-indigo-800';
    case 'staking':
      return 'text-emerald-800';
    case 'emergency':
      return 'text-red-900';
    default:
      return 'text-blue-800';
  }
};

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  // Auto-dismiss after duration
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  return (
    <motion.div
      className={`w-full shadow-lg rounded-lg pointer-events-auto border mobile-touch-target ${getBackgroundColor(notification.type)} mb-4`}
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -100,
        scale: isVisible ? 1 : 0.8
      }}
      exit={{ 
        opacity: 0, 
        y: -100, 
        scale: 0.8,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        duration: 0.4, 
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon(notification.type, isVisible)}
          </div>
          <div className="ml-3 w-0 flex-1 min-w-0">
            <p className={`text-sm sm:text-base font-medium ${getTextColor(notification.type)}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={`mt-1 text-sm ${getTextColor(notification.type)} opacity-80`}>
                {notification.message}
              </p>
            )}
          </div>
          <div className="ml-2 sm:ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 p-2 mobile-touch-target ${getTextColor(notification.type)} hover:opacity-70 transition-opacity`}
              onClick={handleDismiss}
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Container component for multiple notifications
export const NotificationContainer: React.FC<{
  notifications: Notification[];
  onDismiss: (id: string) => void;
}> = ({ notifications, onDismiss }) => {
  return (
    <div className="notification-container fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:top-4 z-50 pointer-events-none">
      <div className="flex flex-col items-stretch sm:items-end space-y-2 sm:space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto w-full sm:max-w-sm">
              <NotificationToast
                notification={notification}
                onDismiss={onDismiss}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};