import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  variant?: 'default' | 'crystal';
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  variant = 'crystal',
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center crystal-glass backdrop-blur-xl ${className}`}>
      <div className="text-center">
        <LoadingSpinner
          variant={variant}
          size="xl"
          centered={false}
          className="mb-6"
        />
        <p className="text-white/80 text-lg font-medium tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};