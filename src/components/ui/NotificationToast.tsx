import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
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
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border ${getBackgroundColor(notification.type)} mb-4`}
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
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon(notification.type, isVisible)}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${getTextColor(notification.type)}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={`mt-1 text-sm ${getTextColor(notification.type)} opacity-80`}>
                {notification.message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 p-1 ${getTextColor(notification.type)} hover:opacity-70 transition-opacity`}
              onClick={handleDismiss}
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col items-end space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <div key={notification.id} className="pointer-events-auto">
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