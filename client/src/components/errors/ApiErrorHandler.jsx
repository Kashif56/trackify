import React, { useState, useEffect } from 'react';
import useErrorHandler from '../../hooks/useErrorHandler';

/**
 * Component to wrap API calls with error handling
 * @param {Object} props - Component props
 * @param {Function} props.apiCall - The API call function to execute
 * @param {Function} props.onSuccess - Callback for successful API response
 * @param {Function} props.onError - Optional callback for error handling
 * @param {React.ReactNode} props.children - Child components to render
 * @param {React.ReactNode} props.loadingComponent - Component to show during loading
 * @param {boolean} props.showErrorToast - Whether to show error toast
 */
const ApiErrorHandler = ({ 
  apiCall, 
  onSuccess, 
  onError, 
  children, 
  loadingComponent = null,
  showErrorToast = true
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { handleApiError, logError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiCall();
        setData(response.data);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        setError(err);
        const errorMessage = handleApiError(err, { showToast: showErrorToast });
        logError(err, 'ApiErrorHandler');
        if (onError) {
          onError(err, errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  // Show loading state
  if (loading) {
    return loadingComponent || (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If there's an error but no custom error handler, show default error UI
  if (error && !onError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">
          There was an error loading this content. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render children with data
  return typeof children === 'function' ? children(data) : children;
};

export default ApiErrorHandler;
