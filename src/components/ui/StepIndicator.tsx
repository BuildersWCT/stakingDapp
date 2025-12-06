import React from 'react';
import { motion } from 'framer-motion';

export interface Step {
  id: string | number;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon?: React.ReactNode;
  metadata?: Record<string, unknown>;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep?: string | number;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showConnectors?: boolean;
  clickable?: boolean;
  onStepClick?: (step: Step) => void;
  className?: string;
}

const sizeConfig = {
  sm: {
    stepSize: 'w-8 h-8',
    connectorHeight: 'h-1',
    textSize: 'text-sm',
    spacing: 'space-y-2'
  },
  md: {
    stepSize: 'w-10 h-10',
    connectorHeight: 'h-1',
    textSize: 'text-base',
    spacing: 'space-y-3'
  },
  lg: {
    stepSize: 'w-12 h-12',
    connectorHeight: 'h-2',
    textSize: 'text-lg',
    spacing: 'space-y-4'
  }
};

// Checkmark SVG component
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const statusConfig = {
  pending: {
    bg: 'var(--crystal-neutral-200)',
    border: 'var(--crystal-neutral-300)',
    text: 'var(--crystal-text-muted)',
    icon: null,
    glow: undefined
  },
  active: {
    bg: 'var(--crystal-gradient-primary)',
    border: 'var(--crystal-primary-500)',
    text: 'white',
    icon: null,
    glow: '0 0 20px rgba(244, 114, 182, 0.4)'
  },
  completed: {
    bg: 'var(--crystal-accent-emerald)',
    border: 'var(--crystal-accent-emerald)',
    text: 'white',
    icon: CheckIcon,
    glow: '0 0 15px rgba(16, 185, 129, 0.3)'
  },
  error: {
    bg: 'var(--crystal-accent-red)',
    border: 'var(--crystal-accent-red)',
    text: 'white',
    icon: null,
    glow: '0 0 15px rgba(239, 68, 68, 0.3)'
  }
};

const StepIcon: React.FC<{
  step: Step;
  size: keyof typeof sizeConfig;
  clickable: boolean;
}> = ({ step, size, clickable }) => {
  const config = statusConfig[step.status];
  const sizeClasses = sizeConfig[size];
  const IconComponent = config.icon;

  return (
    <motion.div
      className={`
        ${sizeClasses.stepSize} 
        rounded-full flex items-center justify-center border-2 relative
        ${clickable ? 'cursor-pointer hover:scale-105' : ''}
      `}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.text,
        boxShadow: config.glow ? config.glow : 'none'
      }}
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: config.glow ? config.glow : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      {IconComponent ? (
        <IconComponent className="w-5 h-5" />
      ) : step.icon ? (
        step.icon
      ) : (
        <span className="font-semibold text-sm">
          {typeof step.id === 'number' ? step.id + 1 : step.id}
        </span>
      )}
      
      {/* Pulse animation for active step */}
      {step.status === 'active' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: config.border }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
};

const StepConnector: React.FC<{
  isActive: boolean;
  isCompleted: boolean;
  variant: 'horizontal' | 'vertical';
  size: keyof typeof sizeConfig;
}> = ({ isActive, isCompleted, variant, size }) => {
  const sizeClasses = sizeConfig[size];
  
  return (
    <motion.div
      className={`
        ${variant === 'horizontal' ? 'flex-1 h-px' : 'w-px mx-auto'}
        ${sizeClasses.connectorHeight}
        ${isCompleted || isActive ? 'opacity-100' : 'opacity-30'}
      `}
      style={{
        background: isCompleted 
          ? 'var(--crystal-accent-emerald)' 
          : isActive 
          ? 'var(--crystal-gradient-primary)'
          : 'var(--crystal-neutral-300)'
      }}
      initial={{ scale: variant === 'horizontal' ? [0, 1] : [0, 1] }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    />
  );
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  variant = 'horizontal',
  size = 'md',
  showConnectors = true,
  clickable = false,
  onStepClick,
  className = ''
}) => {
  const sizeClasses = sizeConfig[size];
  const containerClass = variant === 'horizontal' 
    ? 'flex items-center' 
    : `flex flex-col ${sizeClasses.spacing}`;

  return (
    <div className={`w-full ${containerClass} ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isActive = step.status === 'active' || step.id === currentStep;
        const isCompleted = step.status === 'completed';

        const isError = step.status === 'error';

        return (
          <React.Fragment key={step.id}>
            <motion.div
              className={`
                ${variant === 'horizontal' ? 'flex flex-col items-center' : 'flex items-start'}
                ${variant === 'vertical' ? 'relative' : ''}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div onClick={() => clickable && onStepClick?.(step)}>
                <StepIcon 
                  step={step} 
                  size={size} 
                  clickable={clickable && (isCompleted || isActive || isError)}
                />
              </div>
              
              <div className={`
                ${variant === 'horizontal' ? 'text-center mt-2 max-w-24' : 'ml-3 flex-1'}
              `}>
                <h3 
                  className={`font-medium ${sizeClasses.textSize}`}
                  style={{ 
                    color: isActive ? 'var(--crystal-text-primary)' : 
                           isCompleted ? 'var(--crystal-accent-emerald)' :
                           isError ? 'var(--crystal-accent-red)' :
                           'var(--crystal-text-muted)'
                  }}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p 
                    className={`text-xs mt-1 ${variant === 'horizontal' ? 'text-center' : ''}`}
                    style={{ color: 'var(--crystal-text-secondary)' }}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Connector between steps */}
            {showConnectors && !isLast && (
              <StepConnector
                isActive={isActive}
                isCompleted={isCompleted}
                variant={variant}
                size={size}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Pre-built step configurations for common use cases


export default StepIndicator;