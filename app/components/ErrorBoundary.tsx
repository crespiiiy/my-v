import React, { useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export const ErrorBoundary = () => {
  const error = useRouteError();
  
  useEffect(() => {
    console.error('Route error caught by ErrorBoundary:', error);
  }, [error]);
  
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = '';
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Route error occurred';
    errorDetails = `Status: ${error.status}, Data: ${JSON.stringify(error.data)}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return (
    <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p>Sorry, an unexpected error has occurred.</p>
      <p style={{ color: 'red', marginBottom: '1rem' }}>{errorMessage}</p>
      {process.env.NODE_ENV !== 'production' && errorDetails && (
        <details style={{ marginBottom: '1rem', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
          <summary>Error Details</summary>
          <p>{errorDetails}</p>
        </details>
      )}
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Return to home page
      </button>
    </div>
  );
};

export const ErrorFallback = () => {
  useEffect(() => {
    console.error('Rendering ErrorFallback component');
  }, []);
  
  return (
    <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Error loading page</h2>
      <p>There was a problem loading this page. Please try again later.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          marginRight: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '0.5rem 1rem',
          background: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Go to home page
      </button>
    </div>
  );
};

export default ErrorBoundary; 