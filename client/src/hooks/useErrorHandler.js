import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Custom hook for handling API and application errors
 * @returns {Object} Error handling methods
 */
const useErrorHandler = () => {
  const navigate = useNavigate();

  /**
   * Handle API errors with appropriate responses
   * @param {Error} error - The error object from API call
   * @param {Object} options - Additional options for error handling
   */
  const handleApiError = (error, options = {}) => {
    const { showToast = true, redirectOnAuthError = true } = options;
    
    // Default error message
    let errorMessage = 'Something went wrong. Please try again later.';
    
    // Check if error has response from server
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle different status codes
      switch (status) {
        case 400:
          errorMessage = data.message || 'Invalid request. Please check your data.';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please login again.';
          if (redirectOnAuthError) {
            setTimeout(() => navigate('/login'), 1500);
          }
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = data.message || 'Resource not found.';
          break;
        case 422:
          errorMessage = data.message || 'Validation error. Please check your data.';
          break;
        case 500:
          errorMessage = 'Server error. Our team has been notified.';
          break;
        default:
          errorMessage = data.message || errorMessage;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response from server. Please check your internet connection.';
    }
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error(errorMessage);
    }
    
    return errorMessage;
  };

  /**
   * Logs error details to console (and potentially to a logging service)
   * @param {Error} error - The error object
   * @param {string} context - The context where the error occurred
   */
  const logError = (error, context = 'general') => {
    console.error(`[${context}] Error:`, error);
    
    // Here you could implement error logging to a service like Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  };

  return {
    handleApiError,
    logError
  };
};

export default useErrorHandler;
