import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from '../errors/ErrorBoundary';

/**
 * A wrapper around React Router's Route component that adds error boundary protection
 * @param {Object} props - Component props
 * @param {React.Component} props.component - The component to render
 * @param {Object} props.errorBoundaryProps - Props to pass to the ErrorBoundary
 * @param {Object} props.routeProps - Props to pass to the Route component
 */
const RouteWithErrorBoundary = ({ 
  component: Component,
  errorBoundaryProps = {},
  ...routeProps
}) => {
  return (
    <Route
      {...routeProps}
      element={
        <ErrorBoundary {...errorBoundaryProps}>
          <Component />
        </ErrorBoundary>
      }
    />
  );
};

export default RouteWithErrorBoundary;
