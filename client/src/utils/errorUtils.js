/**
 * Utility functions for error handling throughout the application
 */

/**
 * Formats an error message from various error types
 * @param {Error|Object|string} error - The error to format
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If error is a string, return it directly
  if (typeof error === 'string') return error;
  
  // If error is an axios error response
  if (error.response && error.response.data) {
    // Handle Django REST Framework error format
    if (error.response.data.detail) {
      return error.response.data.detail;
    }
    
    // Handle validation errors (often nested)
    if (typeof error.response.data === 'object') {
      const messages = [];
      Object.entries(error.response.data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          messages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          messages.push(`${key}: ${value}`);
        }
      });
      
      if (messages.length > 0) {
        return messages.join('. ');
      }
    }
    
    return JSON.stringify(error.response.data);
  }
  
  // If error has a message property (standard JS Error)
  if (error.message) return error.message;
  
  // Fallback to stringifying the error
  try {
    return JSON.stringify(error);
  } catch (e) {
    return 'An unknown error occurred';
  }
};

/**
 * Maps HTTP status codes to user-friendly messages
 * @param {number} statusCode - HTTP status code
 * @returns {string} - User-friendly error message
 */
export const getStatusCodeMessage = (statusCode) => {
  const statusMessages = {
    400: 'The request contains invalid data',
    401: 'You need to log in to access this resource',
    403: 'You don\'t have permission to access this resource',
    404: 'The requested resource was not found',
    422: 'The data you provided could not be processed',
    500: 'Server error. Our team has been notified',
    502: 'Server is temporarily unavailable. Please try again later',
    503: 'Service unavailable. Please try again later',
    504: 'Server timeout. Please try again later',
  };
  
  return statusMessages[statusCode] || 'Something went wrong. Please try again later';
};

/**
 * Logs errors to console and potentially to a monitoring service
 * @param {Error} error - The error to log
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = 'general') => {
  console.error(`[${context}] Error:`, error);
  
  // Here you could implement error logging to a service like Sentry
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { 
  //     tags: { context },
  //     extra: { 
  //       url: window.location.href,
  //       timestamp: new Date().toISOString()
  //     }
  //   });
  // }
};
