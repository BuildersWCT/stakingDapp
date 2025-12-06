import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'emerald' | 'amber';
  animated?: boolean;
  striped?: boolean;
  className?: string;
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

const variantClasses = {
  primary: {
    bg: 'var(--crystal-primary-200)',
    fill: 'var(--crystal-gradient-primary)',
    glow: 'var(--crystal-shadow-glow)'
  },
  success: {
    bg: 'var(--crystal-accent-emerald)',
    fill: 'linear-gradient(135deg, var(--crystal-accent-emerald) 0%, #059669 100%)',
    glow: '0 0 20px rgba(16, 185, 129, 0.3)'
  },
  warning: {
    bg: 'var(--crystal-accent-amber)',
    fill: 'linear-gradient(135deg, var(--crystal-accent-amber) 0%, #d97706 100%)',
    glow: '0 0 20px rgba(245, 158, 11, 0.3)'
  },
  danger: {
    bg: 'var(--crystal-accent-red)',
    fill: 'linear-gradient(135deg, var(--crystal-accent-red) 0%, #dc2626 100%)',
    glow: '0 0 20px rgba(239, 68, 68, 0.3)'
  },
  emerald: {
    bg: 'rgba(16, 185, 129, 0.2)',
    fill: 'linear-gradient(135deg, var(--crystal-accent-emerald) 0%, #10b981 100%)',
    glow: '0 0 15px rgba(16, 185, 129, 0.4)'
  },
  amber: {
    bg: 'rgba(245, 158, 11, 0.2)',
    fill: 'linear-gradient(135deg, var(--crystal-accent-amber) 0%, #f59e0b 100%)',
    glow: '0 0 15px rgba(245, 158, 11, 0.4)'
  }
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
  animated = false,
  striped = false,
  className = '',
  ariaLabel
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const currentVariant = variantClasses[variant];

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${percentage}%`,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  const pulseAnimation = animated ? {
    boxShadow: [
      currentVariant.glow,
      '0 0 30px rgba(244, 114, 182, 0.6)',
      currentVariant.glow
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1] as const
    }
  } : {};

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--crystal-text-primary)' }}
            >
              {label}
            </span>
          )}
          {showPercentage && (
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--crystal-text-secondary)' }}
            >
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div 
        className={`
          relative w-full rounded-full overflow-hidden
          ${sizeClasses[size]}
          crystal-glass
        `}
        style={{ backgroundColor: currentVariant.bg }}
        role="progressbar"
        aria-label={ariaLabel || label || 'Progress'}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={`
            absolute top-0 left-0 h-full rounded-full
            ${animated ? 'crystal-pulse' : ''}
            ${striped ? 'progress-striped' : ''}
          `}
          style={{ 
            background: currentVariant.fill,
            ...(animated ? pulseAnimation : {})
          }}
          variants={progressVariants}
          initial="initial"
          animate="animate"
        >
          {/* Animated stripes overlay */}
          {striped && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                animation: animated ? 'progress-stripes 2s linear infinite' : 'none'
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Pulsing Progress Bar for transaction states
export const TransactionProgressBar: React.FC<{
  status: 'confirming' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
  transactionHash?: string;
}> = ({ status, progress, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirming':
        return {
          variant: 'primary' as const,
          animated: true,
          striped: true,
          label: message || 'Confirming transaction...'
        };
      case 'processing':
        return {
          variant: 'amber' as const,
          animated: true,
          striped: true,
          label: message || 'Processing transaction...'
        };
      case 'completed':
        return {
          variant: 'success' as const,
          animated: false,
          striped: false,
          label: message || 'Transaction completed!'
        };
      case 'error':
        return {
          variant: 'danger' as const,
          animated: false,
          striped: false,
          label: message || 'Transaction failed'
        };
    }
  };

  const config = getStatusConfig();
  const currentProgress = progress ?? (status === 'completed' ? 100 : status === 'error' ? 0 : 25);

  return (
    <div className="space-y-2">
      <ProgressBar
        value={currentProgress}
        label={config.label}
        variant={config.variant}
        animated={config.animated}
        striped={config.striped}
        size="md"
        showPercentage={false}
      />
    </div>
  );
};

// Circular Progress Indicator
export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
}> = ({
  value,
  max = 100,
  size = 60,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = false,
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  const currentVariant = variantClasses[variant];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--crystal-neutral-200)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentVariant.fill.includes('linear-gradient') ? 'url(#progressGradient)' : currentVariant.fill}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Gradient definition for circular progress */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentVariant.fill} />
            <stop offset="100%" stopColor={currentVariant.fill} />
          </linearGradient>
        </defs>
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--crystal-text-primary)' }}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;