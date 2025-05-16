import { useEffect, useState } from 'react';
import { products, initializeFirebaseProducts } from '../models/product';
import { forceResyncProductsToFirebase } from '../services/productSync';

/**
 * Hook to handle product synchronization between Firebase, localStorage and memory
 * This hook ensures that any admin edits to products are properly persisted and loaded
 */
export function useProductSync() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize products from Firebase when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check for version mismatch to force refresh
        if (typeof window !== 'undefined') {
          // Store the current version for comparison
          const currentVersion = localStorage.getItem('creative_products_version');
          
          console.log('Initializing Firebase products');
          
          // Always load the latest data from Firebase on every app load
          // This ensures all users see the most recent data
          await initializeFirebaseProducts();
          
          // If a new version was loaded, refresh the page to show updates
          const newVersion = localStorage.getItem('creative_products_version');
          if (currentVersion && newVersion && currentVersion !== newVersion) {
            console.log(`Data version changed from ${currentVersion} to ${newVersion}, refreshing...`);
            window.location.reload();
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Listen for localStorage changes (for cross-tab sync)
  useEffect(() => {
    // Initialize a listener for storage events to sync across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if ((event.key === 'creative_products' || event.key === 'creative_products_version') && event.newValue) {
        try {
          // When localStorage changes in another tab, update this tab too
          window.location.reload(); // Simple reload to get fresh data
        } catch (error) {
          console.error('Error syncing products from storage event:', error);
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // This hook doesn't return anything, it's just for side effects
} 