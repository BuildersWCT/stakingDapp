import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface CardLoaderProps {
  message?: string;
  height?: string;
  className?: string;
}

export const CardLoader: React.FC<CardLoaderProps> = ({
  message,
  height = 'h-32',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${height} crystal-glass rounded-2xl border border-white/10 p-6 ${className}`}>
      <LoadingSpinner
        variant="crystal"
        size="lg"
        className="mb-4"
      />
      {message && (
        <p className="text-white/70 text-sm font-medium text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};