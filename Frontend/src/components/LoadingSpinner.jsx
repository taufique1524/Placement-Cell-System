import React from 'react';

/**
 * Loading Spinner Component
 * Provides consistent loading UI across the application
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
      {showText && (
        <p className={`mt-2 text-sm text-gray-600 ${color === 'white' ? 'text-white' : ''}`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Skeleton Loading Component
 * For content placeholders
 */
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animate = true 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`
            h-4 bg-gray-200 rounded 
            ${animate ? 'animate-pulse' : ''}
            ${index === lines - 1 ? 'w-3/4' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

/**
 * Card Skeleton for announcement/opening cards
 */
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="flex space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded" />
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Page Loading Component
 * For full page loading states
 */
export const PageLoader = ({ 
  text = 'Loading page...', 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="large" color="blue" text={text} />
      </div>
    </div>
  );
};

/**
 * Inline Loading Component
 * For loading states within existing content
 */
export const InlineLoader = ({ 
  text = 'Loading...', 
  size = 'small',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <LoadingSpinner size={size} text={text} showText={true} />
    </div>
  );
};

/**
 * Button Loading State
 * For buttons with loading states
 */
export const ButtonLoader = ({ 
  size = 'small',
  color = 'white',
  className = '' 
}) => {
  return (
    <LoadingSpinner 
      size={size} 
      color={color} 
      showText={false} 
      className={className}
    />
  );
};

export default LoadingSpinner;
