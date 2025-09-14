import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const Badge = ({ 
  children, 
  variant = 'default', 
  status,
  className = '', 
  ...props 
}) => {
  const getStatusClass = () => {
    if (status && statusColors[status.toLowerCase()]) {
      return statusColors[status.toLowerCase()];
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  return (
    <div 
      className={`${baseClasses} ${status ? getStatusClass() : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;
