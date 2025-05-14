import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../app/app.css';

// Import your routes configuration
console.log('Importing routes...');
import routes from '../app/routes';
console.log('Routes imported successfully:', routes);

// Create a browser router instance
console.log('Creating browser router...');
const router = createBrowserRouter(routes);
console.log('Browser router created successfully');

// Initialize the app
console.log('Initializing React app...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  console.log('React app initialized successfully');
} 