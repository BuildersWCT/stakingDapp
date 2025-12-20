import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: MobileModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-md';
    }
  };

  const getAnimationVariants = () => {
    // Different animations for mobile vs desktop
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 }
      };
    } else {
      return {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 }
      };
    }
  };

  const animationVariants = getAnimationVariants();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-responsive" onClick={handleBackdropClick}>
          <motion.div
            className={`modal-content-responsive ${getSizeClasses()}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate pr-4">
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="mobile-touch-target p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Close modal"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
                <div className="p-4 sm:p-6">
                  {children}
                </div>
              </div>

              {/* Mobile drag indicator */}
              <div className="md:hidden flex justify-center pb-2">
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing modal state
export function useMobileModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}

// Preset modal sizes
export const MobileModalPresets = {
  wallet: { size: 'full' as const },
  settings: { size: 'md' as const },
  info: { size: 'sm' as const },
  confirmation: { size: 'sm' as const },
};