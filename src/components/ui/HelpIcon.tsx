import React, { ReactNode } from 'react';
import { Tooltip } from './Tooltip';

interface HelpIconProps {
  content: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'subtle';
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpIcon({
  content,
  className = '',
  size = 'md',
  variant = 'primary',
  position = 'top',
}: HelpIconProps) {
  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    const variants = {
      primary: 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100',
      secondary: 'text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100',
      subtle: 'text-gray-500 hover:text-gray-600 bg-transparent hover:bg-gray-50',
    };
    return variants[variant];
  };

  const getIcon = () => {
    return (
      <svg
        className={`${getSizeClasses()} transition-colors duration-200 ${getVariantClasses()}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  };

  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        className={`inline-flex items-center justify-center rounded-full ${getVariantClasses()} ${className} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group`}
        aria-label="Help"
      >
        {getIcon()}
      </button>
    </Tooltip>
  );
}