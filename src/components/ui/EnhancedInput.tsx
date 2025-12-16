import React, { useState, forwardRef } from 'react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  variant?: 'default' | 'crystal' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
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

    // Size classes
    const sizeClasses = {
      sm: 'py-2 px-3 text-sm',
      md: 'py-3 px-4 text-base',
      lg: 'py-4 px-5 text-lg'
    };

    // Variant classes
    const variantClasses = {
      default: {
        container: 'border border-gray-300 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
        input: 'bg-white placeholder-gray-500 text-gray-900',
        label: 'text-gray-700',
        error: 'border-red-500 ring-2 ring-red-500/20',
        success: 'border-green-500 ring-2 ring-green-500/20'
      },
      crystal: {
        container: 'crystal-glass rounded-2xl border border-white/20 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/30 transition-all duration-300',
        input: 'bg-transparent placeholder-white/60 text-white placeholder-shown:text-white/60',
        label: 'text-white/90',
        error: 'border-red-400 ring-2 ring-red-400/30',
        success: 'border-emerald-400 ring-2 ring-emerald-400/30'
      },
      minimal: {
        container: 'border-b-2 border-gray-200 focus-within:border-primary-500 focus-within:ring-0 focus-within:border-t-0 focus-within:border-l-0 focus-within:border-r-0',
        input: 'bg-transparent border-0 border-b-2 border-gray-200 rounded-none px-0 placeholder-gray-400 text-gray-900 focus:border-primary-500 focus:ring-0',
        label: 'text-gray-600',
        error: 'border-red-500',
        success: 'border-green-500'
      }
    };

    const currentVariant = variantClasses[variant];
    const isLabelFloating = isFocused || hasValue || props.placeholder;
    
    // Determine state classes
    let stateClasses = '';
    if (error) {
      stateClasses = currentVariant.error;
    } else if (success) {
      stateClasses = currentVariant.success;
    } else if (isFocused) {
      stateClasses = 'focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/30';
    }

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className={`
            block text-sm font-medium mb-2 transition-all duration-300 cursor-pointer
            ${currentVariant.label}
            ${isLabelFloating ? 'transform -translate-y-1 scale-95' : 'transform translate-y-0 scale-100'}
            ${variant === 'crystal' ? 'font-medium tracking-wide' : 'font-medium'}
          `}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Input Container */}
        <div className={`
          relative transition-all duration-300
          ${currentVariant.container}
          ${stateClasses}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${error ? 'animate-shake' : ''}
        `}>
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-transparent border-0 outline-none transition-all duration-300
              ${currentVariant.input}
              ${sizeClasses[size]}
              ${props.disabled ? 'cursor-not-allowed' : 'cursor-text'}
              ${variant === 'minimal' ? 'placeholder-transparent' : ''}
              ${isFocused ? 'placeholder-shown:opacity-50' : ''}
              mobile-touch-target
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

          {/* Floating label for minimal variant */}
          {variant === 'minimal' && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-0 transition-all duration-300 pointer-events-none
                ${currentVariant.label}
                ${isLabelFloating ? 'transform -translate-y-6 scale-90 text-primary-500' : 'transform translate-y-0 scale-100 top-3'}
              `}
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {/* Success Icon */}
          {success && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-fade-in">
              <svg
                className="w-5 h-5 text-emerald-500"
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

          {/* Error Icon */}
          {error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-shake">
              <svg
                className="w-5 h-5 text-red-500"
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
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <p
            id={helpTextId}
            className={`
              mt-2 text-sm
              ${variant === 'crystal' ? 'text-white/70' : 'text-gray-500'}
            `}
          >
            {helpText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-500 flex items-center space-x-1"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';