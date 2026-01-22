import React, { useState, forwardRef } from 'react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  variant?: 'default' | 'crystal' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    label,
    error,
    success,
    helpText,
    variant = 'crystal',
    size = 'md',
    fullWidth = true,
    className = '',
    id,
    leftIcon,
    rightIcon,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    
    const inputId = id || `enhanced-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const helpTextId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    // Enhanced size classes with better mobile touch targets
    const sizeClasses = {
      sm: 'py-3 px-4 text-sm min-h-[44px]', // Increased touch target
      md: 'py-4 px-5 text-base min-h-[48px]', // Increased touch target
      lg: 'py-5 px-6 text-lg min-h-[52px]' // Increased touch target
    };

    // Enhanced variant classes with better shadows and animations
    const variantClasses = {
      default: {
        container: `
          border-2 border-gray-200 rounded-2xl
          transition-all duration-300 ease-out
          hover:border-gray-300 hover:shadow-lg
          focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:shadow-xl
          bg-white
        `,
        input: 'bg-transparent placeholder-gray-400 text-gray-900 placeholder-opacity-80',
        label: 'text-gray-700 font-medium',
        error: 'border-red-500 ring-4 ring-red-500/20 shadow-lg',
        success: 'border-green-500 ring-4 ring-green-500/20 shadow-lg',
        shadow: 'shadow-md hover:shadow-lg'
      },
      crystal: {
        container: `
          crystal-glass rounded-2xl border-2 border-white/20
          transition-all duration-300 ease-out backdrop-blur-xl
          hover:border-white/30 hover:shadow-2xl hover:shadow-pink-500/20
          focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-400/30 focus-within:shadow-2xl focus-within:shadow-pink-500/40
          focus-within:scale-[1.02] hover:scale-[1.01]
          bg-gradient-to-br from-white/10 to-white/5
        `,
        input: 'bg-transparent placeholder-white/50 text-white placeholder-opacity-80',
        label: 'text-white/90 font-medium tracking-wide',
        error: 'border-red-400 ring-4 ring-red-400/30 shadow-2xl shadow-red-500/20',
        success: 'border-emerald-400 ring-4 ring-emerald-400/30 shadow-2xl shadow-emerald-500/20',
        shadow: 'shadow-2xl shadow-pink-500/10'
      },
      minimal: {
        container: `
          border-b-3 border-gray-200
          transition-all duration-300 ease-out
          hover:border-gray-300
          focus-within:border-pink-500 focus-within:ring-4 focus-within:ring-pink-500/10 focus-within:shadow-lg
          bg-transparent
        `,
        input: 'bg-transparent border-0 border-b-2 border-gray-200 rounded-none px-0 placeholder-gray-400 text-gray-900 focus:border-pink-500 focus:ring-0 placeholder-opacity-70',
        label: 'text-gray-600 font-medium',
        error: 'border-red-500 ring-2 ring-red-500/20',
        success: 'border-green-500 ring-2 ring-green-500/20',
        shadow: 'shadow-sm'
      }
    };

    const currentVariant = variantClasses[variant];
    const isLabelFloating = isFocused || hasValue || props.placeholder;
    
    // Enhanced state classes with glow effects
    let stateClasses = '';
    if (error) {
      stateClasses = currentVariant.error;
    } else if (success) {
      stateClasses = currentVariant.success;
    } else if (isFocused) {
      if (variant === 'crystal') {
        stateClasses = 'border-pink-400 ring-4 ring-pink-400/30 shadow-2xl shadow-pink-500/40 scale-[1.02]';
      } else {
        stateClasses = 'border-blue-500 ring-4 ring-blue-500/20 shadow-xl';
      }
    }

    // Enhanced input padding with icons
    const getInputPadding = () => {
      const basePadding = sizeClasses[size];
      if (leftIcon && rightIcon) return 'pl-12 pr-12';
      if (leftIcon) return 'pl-12 pr-4';
      if (rightIcon) return 'pl-4 pr-12';
      return basePadding.replace('py-', 'py-').replace('px-', 'px-');
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className} relative`}>
        {/* Enhanced Label with better floating animation */}
        <label
          htmlFor={inputId}
          className={`
            block text-sm font-semibold mb-3 transition-all duration-300 ease-out cursor-pointer
            ${currentVariant.label}
            ${isLabelFloating
              ? 'transform -translate-y-2 scale-90 text-pink-400'
              : 'transform translate-y-0 scale-100'
            }
            ${variant === 'crystal' ? 'tracking-wide' : ''}
            ${isFocused ? 'text-pink-400' : ''}
          `}
        >
          {label}
          {props.required && <span className="text-red-400 ml-1 font-bold">*</span>}
        </label>

        {/* Enhanced Input Container with advanced styling */}
        <div className={`
          relative overflow-hidden
          ${currentVariant.container}
          ${stateClasses}
          ${props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}
          ${currentVariant.shadow}
          ${fullWidth ? 'w-full' : ''}
          ${error ? 'animate-pulse' : ''}
          ${isFocused ? 'animate-glow' : ''}
        `}>
          
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <div className={`
                transition-colors duration-300
                ${isFocused ? 'text-pink-400' : 'text-white/60'}
                ${variant === 'default' ? 'text-gray-400' : ''}
              `}>
                {leftIcon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-transparent border-0 outline-none transition-all duration-300 ease-out
              ${currentVariant.input}
              ${sizeClasses[size]}
              ${props.disabled ? 'cursor-not-allowed' : 'cursor-text'}
              ${variant === 'minimal' ? 'placeholder-transparent' : ''}
              ${isFocused ? 'placeholder-opacity-60' : 'placeholder-opacity-80'}
              mobile-touch-target
              ${getInputPadding()}
              ${isFocused ? 'scale-[1.01]' : 'scale-100'}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-describedby={
              error ? errorId : helpText ? helpTextId : undefined
            }
            aria-invalid={!!error}
            aria-required={props.required || false}
            {...props}
          />

          {/* Enhanced Success Icon with animation */}
          {success && !error && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-bounce-in">
              <svg
                className="w-6 h-6 text-emerald-400 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Enhanced Error Icon with shake animation */}
          {error && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 animate-shake">
              <svg
                className="w-6 h-6 text-red-400 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Right Icon (custom) */}
          {rightIcon && !success && !error && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}

          {/* Floating label for minimal variant with enhanced animation */}
          {variant === 'minimal' && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-0 transition-all duration-300 ease-out pointer-events-none
                ${currentVariant.label}
                ${isLabelFloating
                  ? 'transform -translate-y-8 scale-85 text-pink-500 font-semibold'
                  : 'transform translate-y-0 scale-100 top-4'
                }
              `}
            >
              {label}
              {props.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          )}

          {/* Enhanced focus ring effect */}
          {isFocused && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-pink-400/10 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Enhanced Help Text */}
        {helpText && !error && (
          <p
            id={helpTextId}
            className={`
              mt-3 text-sm leading-relaxed
              ${variant === 'crystal' ? 'text-white/70' : 'text-gray-500'}
              ${isFocused ? 'text-pink-400' : ''}
            `}
          >
            {helpText}
          </p>
        )}

        {/* Enhanced Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-3 text-sm text-red-400 flex items-center space-x-2 animate-shake"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';