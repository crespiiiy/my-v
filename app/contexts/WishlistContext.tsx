import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { 
  getWishlistByUserId, 
  isInWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from "../models/wishlist";
import { getProductById } from "../models/product";
import type { Product } from "../models/product";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlistItems: Product[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize wishlist on login/logout
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      
      if (isLoggedIn && user) {
        try {
          // Get user's wishlist items
          const userWishlist = getWishlistByUserId(user.id);
          
          // Get full product details for each item
          const products = userWishlist
            .map(item => getProductById(item.productId))
            .filter((product): product is Product => !!product);
          
          setWishlistItems(products);
        } catch (error) {
          console.error("Failed to load wishlist:", error);
        }
      } else {
        // Clear wishlist when logged out
        setWishlistItems([]);
      }
      
      setIsLoading(false);
    };
    
    loadWishlist();
  }, [user, isLoggedIn]);
  
  // Check if a product is in the wishlist
  const checkIsInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };
  
  // Add a product to the wishlist
  const addItemToWishlist = async (product: Product): Promise<void> => {
    if (!isLoggedIn || !user) {
      throw new Error("You must be logged in to add items to your wishlist");
    }
    
    try {
      // Add to wishlist in data layer
      await addToWishlist(user.id, product.id);
      
      // Update local state
      setWishlistItems(prev => [...prev, product]);
      
      // Show success notification
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-700 text-white px-4 py-3 rounded shadow-lg z-50 animate-fadeOut';
      successMessage.innerText = `${product.name} added to wishlist!`;
      document.body.appendChild(successMessage);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  };
  
  // Remove a product from the wishlist
  const removeItemFromWishlist = async (productId: string): Promise<void> => {
    if (!isLoggedIn || !user) {
      throw new Error("You must be logged in to remove items from your wishlist");
    }
    
    try {
      // Remove from wishlist in data layer
      await removeFromWishlist(user.id, productId);
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  };
  
  // Toggle a product in the wishlist (add if not present, remove if present)
  const toggleItemInWishlist = async (product: Product): Promise<void> => {
    if (checkIsInWishlist(product.id)) {
      await removeItemFromWishlist(product.id);
    } else {
      await addItemToWishlist(product);
    }
  };
  
  // Context value
  const value = {
    wishlistItems,
    isLoading,
    isInWishlist: checkIsInWishlist,
    addToWishlist: addItemToWishlist,
    removeFromWishlist: removeItemFromWishlist,
    toggleWishlist: toggleItemInWishlist
  };
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  
  return context;
} 