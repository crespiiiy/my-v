import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  // Determine size classes based on prop
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  // Responsive container based on size
  const containerClasses = size === 'sm' 
    ? 'inline-flex items-center justify-center' 
    : 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50';

  // Content padding based on size
  const contentClasses = size === 'sm'
    ? 'flex items-center space-x-2'
    : 'bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center';

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <svg 
          className={`animate-spin ${sizeClasses[size]} text-blue-500 ${size !== 'sm' ? 'mb-4' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {(size !== 'sm' || message !== 'Loading...') && (
          <p className={`text-white ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator; 