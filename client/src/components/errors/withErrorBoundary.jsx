import React from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * @param {React.Component} Component - The component to wrap
 * @param {Object} options - Additional options for the error boundary
 * @returns {React.Component} - The wrapped component
 */
const withErrorBoundary = (Component, options = {}) => {
  const { fallbackComponent, onError } = options;
  
  const WithErrorBoundary = (props) => {
    return (
      <ErrorBoundary 
        fallbackComponent={fallbackComponent}
        onError={onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for better debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
};

export default withErrorBoundary;
