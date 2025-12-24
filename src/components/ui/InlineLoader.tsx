import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface InlineLoaderProps {
  message?: string;
  variant?: 'default' | 'crystal' | 'dots';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  message,
  variant = 'crystal',
  size = 'sm',
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <LoadingSpinner
        variant={variant}
        size={size}
        centered={false}
      />
      {message && (
        <span className="text-white/70 text-sm font-medium animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};