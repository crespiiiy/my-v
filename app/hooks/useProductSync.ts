import { useEffect, useState } from 'react';
import { products, initializeFirebaseProducts, getProductsByCategory } from '../models/product';
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
        // Only run initialization once if not already initialized
        if (!isInitialized) {
          console.log('Initializing Firebase products');
          
          // Store the current version for comparison
          const currentVersion = localStorage.getItem('creative_products_version');
          
          // Only attempt Firebase sync if we don't have a version number yet or at most once per hour
          const lastSyncTime = localStorage.getItem('last_firebase_sync_time');
          const currentTime = Date.now();
          const shouldSync = !lastSyncTime || 
            (currentTime - parseInt(lastSyncTime, 10)) > 3600000; // 1 hour in milliseconds
            
          if (shouldSync) {
            // Load products from Firebase
            await initializeFirebaseProducts();
            localStorage.setItem('last_firebase_sync_time', currentTime.toString());
            
            // Force a sync to ensure all category products are available
            console.log('Running category sanity check...');
            
            // Check if all categories have the expected number of products
            const categories = ['Laptops', 'AI Models', 'Smartphones', 'VPS Servers', 'Misc', 'RAT Tools', 'Courses'];
            let missingProducts = false;
            
            categories.forEach(category => {
              const categoryProducts = getProductsByCategory(category);
              console.log(`Category ${category} has ${categoryProducts.length} products`);
              
              // If the function returned more products than the filter, we have missing products
              const filteredProducts = products.filter(p => p.category === category);
              if (categoryProducts.length > filteredProducts.length) {
                missingProducts = true;
              }
            });
            
            // If we have missing products, force a version change to refresh
            if (missingProducts) {
              console.log('Missing products detected, forcing a version change');
              const newVersion = "1.0.7"; // Force a significant version change
              localStorage.setItem('creative_products_version', newVersion);
              window.location.reload();
            }
            
            // Only refresh if we detect a significant version change
            const newVersion = localStorage.getItem('creative_products_version');
            if (currentVersion && newVersion && 
                currentVersion !== newVersion && 
                parseInt(newVersion.split('.')[2], 10) - parseInt(currentVersion.split('.')[2], 10) > 5) {
              console.log(`Significant data version change from ${currentVersion} to ${newVersion}, refreshing...`);
              window.location.reload();
            }
          }
          
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing products:', error);
        setIsInitialized(true); // Still mark as initialized to avoid infinite retry
      }
    };

    fetchProducts();
  }, [isInitialized]);

  // Listen for localStorage changes (for cross-tab sync)
  useEffect(() => {
    // Initialize a listener for storage events to sync across tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if ((event.key === 'creative_products' || event.key === 'creative_products_version') && event.newValue) {
        try {
          // Only reload if the version changed significantly to avoid loop
          if (event.key === 'creative_products_version' && event.oldValue) {
            const oldMinor = parseInt(event.oldValue.split('.')[2], 10);
            const newMinor = parseInt(event.newValue.split('.')[2], 10);
            if (newMinor - oldMinor > 5) {
              console.log(`Storage changed with significant version difference: ${event.oldValue} -> ${event.newValue}`);
              window.location.reload();
            }
          }
        } catch (error) {
          console.error('Error handling storage event:', error);
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