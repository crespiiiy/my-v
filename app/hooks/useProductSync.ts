import { useEffect } from 'react';
import { products } from '../models/product';

/**
 * Hook to handle product synchronization between local storage and memory
 * This hook ensures that any admin edits to products are properly persisted and loaded
 */
export function useProductSync() {
  useEffect(() => {
    // Initialize a listener for storage events to sync across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'creative_products' && event.newValue) {
        try {
          // When localStorage changes, update the memory products too
          // This helps with real-time updates across multiple tabs
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