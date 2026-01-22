import React from 'react';

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Variant/style of the spinner */
  variant?: 'default' | 'crystal' | 'dots' | 'pulse' | 'ring';
  /** Color theme */
  color?: 'rose' | 'pink' | 'blue' | 'emerald' | 'amber' | 'white';
  /** Optional label for accessibility */
  label?: string;
  /** Show label text below spinner */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Center the spinner in its container */
  centered?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorClasses = {
  rose: {
    primary: 'text-rose-500',
    secondary: 'text-rose-200',
    gradient: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-500',
  },
  pink: {
    primary: 'text-pink-500',
    secondary: 'text-pink-200',
    gradient: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-500',
  },
  blue: {
    primary: 'text-blue-500',
    secondary: 'text-blue-200',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500',
  },
  emerald: {
    primary: 'text-emerald-500',
    secondary: 'text-emerald-200',
    gradient: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-500',
  },
  amber: {
    primary: 'text-amber-500',
    secondary: 'text-amber-200',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500',
  },
  white: {
    primary: 'text-white',
    secondary: 'text-white/30',
    gradient: 'from-white to-gray-200',
    bg: 'bg-white',
  },
};

/**
 * Default circular spinner with rotating animation
 */
const DefaultSpinner: React.FC<{ size: string; colors: typeof colorClasses.rose }> = ({ size, colors }) => (
  <svg
    className={`animate-spin ${size} ${colors.primary}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Crystal-themed spinner with gem-like appearance
 */
const CrystalSpinner: React.FC<{ size: string; colors: typeof colorClasses.rose }> = ({ size, colors }) => (
  <div className={`relative ${size}`}>
    {/* Outer rotating ring */}
    <div className={`absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r ${colors.gradient} animate-spin`} style={{
      maskImage: 'linear-gradient(transparent 40%, black)',
      WebkitMaskImage: 'linear-gradient(transparent 40%, black)',
    }} />

    {/* Inner crystal gem */}
    <svg
      className={`absolute inset-0 ${size} animate-pulse`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Crystal shape */}
      <path
        d="M12 2L4 8L12 22L20 8L12 2Z"
        className={colors.primary}
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M12 2L4 8L12 12L20 8L12 2Z"
        className={colors.primary}
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 12L4 8L12 22L12 12Z"
        className={colors.primary}
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M12 12L20 8L12 22L12 12Z"
        className={colors.primary}
        fill="currentColor"
        opacity="0.5"
      />
      {/* Sparkle effect */}
      <circle cx="12" cy="6" r="1" fill="white" className="animate-ping" opacity="0.8" />
    </svg>

    {/* Glow effect */}
    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.gradient} opacity-20 blur-md animate-pulse`} />
  </div>
);

/**
 * Dots spinner with bouncing animation
 */
const DotsSpinner: React.FC<{ size: string; colors: typeof colorClasses.rose }> = ({ size, colors }) => {
  const dotSize = size.includes('w-4') ? 'w-1 h-1' : size.includes('w-6') ? 'w-1.5 h-1.5' : size.includes('w-8') ? 'w-2 h-2' : size.includes('w-12') ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`flex items-center justify-center space-x-1 ${size}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} rounded-full ${colors.bg} animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse spinner with expanding circles
 */
const PulseSpinner: React.FC<{ size: string; colors: typeof colorClasses.rose }> = ({ size, colors }) => (
  <div className={`relative ${size}`}>
    <div className={`absolute inset-0 rounded-full ${colors.bg} opacity-75 animate-ping`} />
    <div className={`relative rounded-full ${size} ${colors.bg} opacity-50`} />
  </div>
);

/**
 * Ring spinner with rotating gradient
 */
const RingSpinner: React.FC<{ size: string; colors: typeof colorClasses.rose }> = ({ size, colors }) => (
  <div className={`relative ${size}`}>
    <div
      className={`absolute inset-0 rounded-full border-4 ${colors.secondary.replace('text-', 'border-')}`}
    />
    <div
      className={`absolute inset-0 rounded-full border-4 border-transparent animate-spin`}
      style={{
        borderTopColor: colors.primary.includes('rose') ? '#f43f5e' :
          colors.primary.includes('pink') ? '#ec4899' :
            colors.primary.includes('blue') ? '#3b82f6' :
              colors.primary.includes('emerald') ? '#10b981' :
                colors.primary.includes('amber') ? '#f59e0b' : '#ffffff',
      }}
    />
  </div>
);

/**
 * LoadingSpinner - A beautiful, accessible loading spinner component
 * with crystal/gem theme support for the staking dApp.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'rose',
  label = 'Loading...',
  showLabel = false,
  className = '',
  centered = false,
}) => {
  const sizeClass = sizeClasses[size];
  const colors = colorClasses[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'crystal':
        return <CrystalSpinner size={sizeClass} colors={colors} />;
      case 'dots':
        return <DotsSpinner size={sizeClass} colors={colors} />;
      case 'pulse':
        return <PulseSpinner size={sizeClass} colors={colors} />;
      case 'ring':
        return <RingSpinner size={sizeClass} colors={colors} />;
      default:
        return <DefaultSpinner size={sizeClass} colors={colors} />;
    }
  };

  const containerClasses = `
    inline-flex flex-col items-center justify-center
    ${centered ? 'absolute inset-0' : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClasses} role="status" aria-label={label}>
      {renderSpinner()}
      {showLabel && (
        <span className={`mt-2 text-sm font-medium ${colors.primary}`}>
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};

/**
 * ButtonSpinner - A compact spinner designed for use inside buttons
 */
export const ButtonSpinner: React.FC<{ color?: 'white' | 'rose' | 'pink' }> = ({ color = 'white' }) => (
  <LoadingSpinner size="sm" variant="default" color={color} className="-ml-1 mr-2" />
);

/**
 * PageLoader - Full page loading overlay with crystal spinner
 */
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-4">
      <LoadingSpinner size="xl" variant="crystal" color="rose" />
      <p className="text-white font-medium">{message}</p>
    </div>
  </div>
);

/**
 * CardLoader - Loading state for card components
 */
export const CardLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-3">
    <LoadingSpinner size="lg" variant="ring" color="rose" />
    {message && <p className="text-sm text-gray-500">{message}</p>}
  </div>
);

/**
 * InlineLoader - Compact inline loading indicator
 */
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading' }) => (
  <span className="inline-flex items-center">
    <LoadingSpinner size="xs" variant="dots" color="rose" className="mr-2" />
    <span className="text-sm text-gray-500">{text}</span>
  </span>
);

export default LoadingSpinner;
