import React from 'react';
import { motion } from 'framer-motion';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'button' | 'input';
  width?: string | number;
  height?: string | number;
  lines?: number;
  lineHeight?: number;
  borderRadius?: string;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'light' | 'medium' | 'dark';
}

const sizeConfig = {
  sm: {
    text: 'h-3',
    button: 'h-8',
    input: 'h-10',
    avatar: 'w-8 h-8',
    card: 'h-24'
  },
  md: {
    text: 'h-4',
    button: 'h-10',
    input: 'h-12',
    avatar: 'w-10 h-10',
    card: 'h-32'
  },
  lg: {
    text: 'h-5',
    button: 'h-12',
    input: 'h-14',
    avatar: 'w-12 h-12',
    card: 'h-40'
  }
};

const colorConfig = {
  light: {
    base: 'var(--crystal-neutral-100)',
    highlight: 'var(--crystal-neutral-200)',
    shimmer: 'rgba(255, 255, 255, 0.4)'
  },
  medium: {
    base: 'var(--crystal-neutral-200)',
    highlight: 'var(--crystal-neutral-300)',
    shimmer: 'rgba(255, 255, 255, 0.6)'
  },
  dark: {
    base: 'var(--crystal-neutral-300)',
    highlight: 'var(--crystal-neutral-400)',
    shimmer: 'rgba(255, 255, 255, 0.8)'
  }
};

const animationConfig = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  wave: {
    animate: {
      x: ['-100%', '100%']
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  none: {}
};

const SkeletonRect: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation: keyof typeof animationConfig;
  color: keyof typeof colorConfig;
  className?: string;
}> = ({ 
  width, 
  height, 
  borderRadius = '0.5rem', 
  animation, 
  color, 
  className = '' 
}) => {
  const colorStyle = colorConfig[color];
  const animationStyle = animationConfig[animation];

  return (
    <motion.div
      className={`bg-current ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
        backgroundColor: colorStyle.base
      }}
      {...animationStyle}
    >
      {/* Shimmer overlay for wave animation */}
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${colorStyle.shimmer}, transparent)`,
            width: '100%',
            height: '100%'
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </motion.div>
  );
};

// Base Skeleton Component
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  lineHeight,
  borderRadius,
  animation = 'pulse',
  className = '',
  size = 'md',
  color = 'medium'
}) => {
  const sizeClasses = sizeConfig[size];

  const getSkeletonContent = () => {
    switch (variant) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonRect
                key={index}
                width={index === lines - 1 ? '75%' : width}
                height={lineHeight ? `${lineHeight}px` : undefined}
                borderRadius={borderRadius}
                animation={animation}
                color={color}
              />
            ))}
          </div>
        );

      case 'circular':
        return (
          <SkeletonRect
            width={width || sizeClasses.avatar}
            height={height || sizeClasses.avatar}
            borderRadius="50%"
            animation={animation}
            color={color}
            className={className}
          />
        );

      case 'rectangular':
        return (
          <SkeletonRect
            width={width}
            height={height}
            borderRadius={borderRadius}
            animation={animation}
            color={color}
            className={className}
          />
        );

      case 'card':
        return (
          <div className={`space-y-3 ${className}`}>
            <SkeletonRect
              width="100%"
              height={sizeClasses.card}
              borderRadius="1rem"
              animation={animation}
              color={color}
            />
            <div className="space-y-2">
              <SkeletonRect width="80%" animation={animation} color={color} />
              <SkeletonRect width="60%" animation={animation} color={color} />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <SkeletonRect
            width={width || sizeClasses.avatar}
            height={height || sizeClasses.avatar}
            borderRadius="50%"
            animation={animation}
            color={color}
            className={className}
          />
        );

      case 'button':
        return (
          <SkeletonRect
            width={width}
            height={height || sizeClasses.button}
            borderRadius="0.75rem"
            animation={animation}
            color={color}
            className={className}
          />
        );

      case 'input':
        return (
          <SkeletonRect
            width={width}
            height={height || sizeClasses.input}
            borderRadius="0.75rem"
            animation={animation}
            color={color}
            className={className}
          />
        );

      default:
        return (
          <SkeletonRect
            width={width}
            height={height}
            borderRadius={borderRadius}
            animation={animation}
            color={color}
            className={className}
          />
        );
    }
  };

  return getSkeletonContent();
};

// Specialized skeleton components for common use cases
export const TokenBalanceSkeleton: React.FC = () => (
  <div className="crystal-glass rounded-2xl p-4 space-y-3">
    <SkeletonLoader variant="text" lines={1} width="40%" size="sm" />
    <SkeletonLoader variant="text" lines={2} size="md" />
  </div>
);

export const TransactionCardSkeleton: React.FC = () => (
  <div className="crystal-glass rounded-2xl p-4 space-y-4">
    <div className="flex items-center space-x-3">
      <SkeletonLoader variant="avatar" size="sm" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" lines={1} width="60%" />
        <SkeletonLoader variant="text" lines={1} width="40%" size="sm" />
      </div>
    </div>
    <SkeletonLoader variant="button" />
  </div>
);

export const StatsCardSkeleton: React.FC = () => (
  <div className="crystal-glass rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonLoader variant="text" width="30%" />
      <SkeletonLoader variant="circular" size="sm" />
    </div>
    <SkeletonLoader variant="text" lines={2} size="lg" />
    <div className="flex space-x-4">
      <SkeletonLoader variant="text" width="25%" size="sm" />
      <SkeletonLoader variant="text" width="35%" size="sm" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="crystal-glass rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <SkeletonLoader variant="avatar" size="sm" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" lines={1} width="70%" />
            <SkeletonLoader variant="text" lines={1} width="50%" size="sm" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <SkeletonLoader variant="text" width="30%" size="sm" />
          <SkeletonLoader variant="button" width="20%" size="sm" />
        </div>
      </div>
    ))}
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-crystal-border-light">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <SkeletonLoader 
          variant="text" 
          width={index === 0 ? "80%" : index === columns - 1 ? "20%" : "60%"}
          size="sm"
        />
      </td>
    ))}
  </tr>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="30%" />
      <SkeletonLoader variant="input" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="25%" />
      <SkeletonLoader variant="input" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader variant="text" width="35%" />
      <SkeletonLoader variant="input" height="6rem" />
    </div>
    <SkeletonLoader variant="button" />
  </div>
);

// Dashboard skeleton for main app loading
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="crystal-glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonLoader variant="text" width="40%" size="lg" />
          <SkeletonLoader variant="text" width="60%" />
        </div>
        <SkeletonLoader variant="circular" size="lg" />
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>

    {/* Main content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TransactionCardSkeleton />
      <div className="space-y-4">
        <SkeletonLoader variant="text" width="50%" />
        <ListSkeleton items={4} />
      </div>
    </div>
  </div>
);

export default SkeletonLoader;