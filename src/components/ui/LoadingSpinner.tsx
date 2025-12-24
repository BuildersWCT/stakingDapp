import React from 'react';

interface LoadingSpinnerProps {
  variant?: 'default' | 'crystal' | 'dots' | 'pulse' | 'ring';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'crystal',
  size = 'md',
  centered = false,
  className = '',
  'aria-label': ariaLabel = 'Loading...'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = centered
    ? 'flex items-center justify-center min-h-[200px]'
    : 'inline-flex items-center justify-center';

  const renderSpinner = () => {
    switch (variant) {
      case 'default':
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`} />
        );

      case 'crystal':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} animate-spin rounded-full crystal-glass border-2 border-white/30 border-t-pink-400 shadow-2xl shadow-pink-500/20`} />
            <div className={`absolute inset-0 ${sizeClasses[size]} animate-pulse rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20`} />
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'} bg-pink-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-75" />
            <div className="relative rounded-full bg-pink-500" />
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-pink-400/30 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      {renderSpinner()}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};