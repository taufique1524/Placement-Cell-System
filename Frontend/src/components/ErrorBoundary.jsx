import React from 'react';

/**
 * Error Display Component
 * Shows error messages with retry functionality
 */
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">{title}</h3>
        </div>
      </div>
      
      {error && (
        <div className="mb-4">
          <p className="text-sm text-red-700">
            {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
          </p>
        </div>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Network Error Component
 * Specific error display for network issues
 */
export const NetworkError = ({ onRetry, className = '' }) => {
  return (
    <ErrorDisplay
      title="Network Error"
      error="Unable to connect to the server. Please check your internet connection."
      onRetry={onRetry}
      className={className}
    />
  );
};

/**
 * Empty State Component
 * Shows when no data is available
 */
export const EmptyState = ({ 
  title = 'No data available',
  description = 'There is nothing to show here yet.',
  icon,
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * Data State Manager Component
 * Handles loading, error, and empty states
 */
export const DataStateManager = ({
  loading,
  error,
  data,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
  emptyTitle = 'No data available',
  emptyDescription = 'There is nothing to show here yet.',
  onRetry,
  className = ''
}) => {
  // Loading state
  if (loading) {
    return loadingComponent || (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return errorComponent || (
      <ErrorDisplay 
        error={error} 
        onRetry={onRetry} 
        className={className}
      />
    );
  }

  // Empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return emptyComponent || (
      <EmptyState 
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  // Success state - render children
  return children;
};

/**
 * Retry Button Component
 */
export const RetryButton = ({ 
  onRetry, 
  loading = false, 
  text = 'Retry',
  className = '' 
}) => {
  return (
    <button
      onClick={onRetry}
      disabled={loading}
      className={`
        bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
        text-white px-4 py-2 rounded-md text-sm font-medium 
        transition-colors duration-200 flex items-center space-x-2
        ${className}
      `}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      <span>{loading ? 'Retrying...' : text}</span>
    </button>
  );
};

/**
 * Cache Status Indicator
 * Shows whether data is from cache or fresh
 */
export const CacheStatusIndicator = ({ 
  isFromCache, 
  lastUpdated,
  className = '' 
}) => {
  if (!isFromCache && !lastUpdated) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className={`text-xs text-gray-500 flex items-center space-x-2 ${className}`}>
      {isFromCache && (
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Cached</span>
        </span>
      )}
      {lastUpdated && (
        <span>Updated: {formatTime(lastUpdated)}</span>
      )}
    </div>
  );
};

/**
 * Error Boundary Class Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <ErrorDisplay
              title="Application Error"
              error="Something went wrong. Please refresh the page or try again later."
              onRetry={() => window.location.reload()}
            />
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs text-gray-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
