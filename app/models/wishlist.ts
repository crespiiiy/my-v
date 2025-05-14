import type { Product } from './product';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

// Sample wishlist data
export const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    userId: "2",
    productId: "3",
    addedAt: "2023-10-15T14:30:00Z",
  },
  {
    id: "2",
    userId: "2",
    productId: "5",
    addedAt: "2023-11-02T09:45:00Z",
  },
  {
    id: "3",
    userId: "3",
    productId: "1",
    addedAt: "2023-10-20T16:15:00Z",
  },
];

// Helper functions for wishlist operations
export function getWishlistByUserId(userId: string): WishlistItem[] {
  return wishlistItems.filter(item => item.userId === userId);
}

export function isInWishlist(userId: string, productId: string): boolean {
  return wishlistItems.some(item => item.userId === userId && item.productId === productId);
}

export function addToWishlist(userId: string, productId: string): WishlistItem {
  // Check if already in wishlist
  if (isInWishlist(userId, productId)) {
    throw new Error("Product already in wishlist");
  }
  
  const newItem: WishlistItem = {
    id: (wishlistItems.length + 1).toString(),
    userId,
    productId,
    addedAt: new Date().toISOString(),
  };
  
  wishlistItems.push(newItem);
  return newItem;
}

export function removeFromWishlist(userId: string, productId: string): boolean {
  const initialLength = wishlistItems.length;
  const index = wishlistItems.findIndex(
    item => item.userId === userId && item.productId === productId
  );
  
  if (index !== -1) {
    wishlistItems.splice(index, 1);
  }
  
  return wishlistItems.length < initialLength;
} 