import { useProductSync } from '../hooks/useProductSync';
import { useEffect } from 'react';
import { getProductById } from '../models/product';

export default function App() {
  // Initialize product data sync
  useProductSync();
  
  // Verify critical products exist on startup (DEBUG)
  useEffect(() => {
    // Verify all critical product IDs are loaded
    const criticalIds = ["27", "28", "30", "31", "32", "33", "36"];
    const missingIds = criticalIds.filter(id => !getProductById(id));
    
    if (missingIds.length > 0) {
      console.error(`Critical products missing: ${missingIds.join(', ')}`);
      // Force reload if missing products
      localStorage.setItem('creative_products_version', "0");
      window.location.reload();
    } else {
      console.log('All critical products loaded successfully');
    }
  }, []);
  
  return null; // This component is just for initialization
}