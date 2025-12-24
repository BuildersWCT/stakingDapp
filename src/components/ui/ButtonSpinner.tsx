import React from 'react';

interface ButtonSpinnerProps {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white/30 border-t-white mr-2 ${className}`} />
  );
};