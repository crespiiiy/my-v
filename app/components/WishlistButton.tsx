import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import type { Product } from '../models/product';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WishlistButton({ product, size = 'md', className = '' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  
  const isInList = isInWishlist(product.id);
  
  // Set the size of the button based on prop
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  }[size];
  
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      // Show a notification that the user needs to log in
      const loginMessage = document.createElement('div');
      loginMessage.className = 'fixed top-4 right-4 bg-blue-700 text-white px-4 py-3 rounded shadow-lg z-50 animate-fadeOut';
      loginMessage.innerHTML = 'Please <a href="/login" class="underline">log in</a> to add items to your wishlist';
      document.body.appendChild(loginMessage);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(loginMessage);
      }, 3000);
      
      return;
    }
    
    try {
      await toggleWishlist(product);
      
      // No notification needed, handled in context
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-700 text-white px-4 py-3 rounded shadow-lg z-50 animate-fadeOut';
      errorMessage.innerText = 'Failed to update wishlist. Please try again.';
      document.body.appendChild(errorMessage);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };
  
  return (
    <button
      onClick={handleToggleWishlist}
      className={`${sizeClasses} flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-sm transition-colors ${
        isInList ? 'text-red-500 hover:text-red-400' : 'text-gray-300 hover:text-white'
      } ${className}`}
      aria-label={isInList ? "Remove from wishlist" : "Add to wishlist"}
      title={isInList ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg 
        className="w-5 h-5" 
        fill={isInList ? "currentColor" : "none"}
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={isInList ? "0" : "2"} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
} 