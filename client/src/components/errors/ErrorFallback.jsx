import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Fallback component to display when an error occurs in a component
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was thrown
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="text-red-500 mb-4">
          <svg 
            className="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but there was an error with this page. Our team has been notified and is working on a fix.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button 
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={goBack}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
          <Link 
            to="/"
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
