import React from 'react';

export const ErrorBoundary = () => (
  <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>Something went wrong</h2>
    <p>Sorry, an unexpected error has occurred.</p>
    <button onClick={() => window.location.href = '/'}>
      Return to home page
    </button>
  </div>
);

export const ErrorFallback = () => (
  <div className="error-boundary">
    <h2>Error loading page</h2>
    <p>There was a problem loading this page. Please try again later.</p>
  </div>
);

export default ErrorBoundary; 