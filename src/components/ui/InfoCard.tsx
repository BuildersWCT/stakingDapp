import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HelpIcon } from './HelpIcon';

interface InfoCardProps {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  className?: string;
  helpContent?: ReactNode;
  showDismiss?: boolean;
  onDismiss?: () => void;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function InfoCard({
  title,
  description,
  icon,
  variant = 'info',
  className = '',
  helpContent,
  showDismiss = false,
  onDismiss,
  collapsible = false,
  defaultExpanded = true,
}: InfoCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const getVariantClasses = () => {
    const variants = {
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800',
      },
      warning: {
        container: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800',
      },
      success: {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800',
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800',
      },
    };
    return variants[variant];
  };

  const getDefaultIcon = () => {
    const icons = {
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[variant];
  };

  const variantClasses = getVariantClasses();

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border ${variantClasses.container} ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${variantClasses.icon} flex-shrink-0`}>
              {displayIcon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1 flex items-center space-x-2">
                <span>{title}</span>
                {helpContent && (
                  <HelpIcon
                    content={helpContent}
                    position="right"
                    variant="subtle"
                    size="sm"
                    className="!p-0"
                  />
                )}
              </h3>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm leading-relaxed"
                >
                  {description}
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            {collapsible && (
              <button
                onClick={toggleExpanded}
                className={`p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-200 ${variantClasses.icon}`}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {showDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className={`p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-200 ${variantClasses.icon}`}
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}