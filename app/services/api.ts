// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://api.creative-store.com';
// Set to false for production to use real API
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || false;

/**
 * PRODUCTION CONFIGURATION:
 * 
 * Your backend is now configured to use real data from Firebase.
 * Make sure your Firebase credentials are properly set up in firebase.ts
 * and that you have the proper security rules in place.
 * 
 * Environment variables in production:
 * REACT_APP_API_URL=https://your-real-api.com
 * REACT_APP_USE_MOCK_DATA=false
 */

// Import Firebase services for data handling
import { db } from './firebase';
import { getDocs, getDoc, collection, doc, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Types import (keep these for type information)
import { products as mockProductTypes } from '../models/product';
import { users as mockUserTypes } from '../models/user';
import { orders as mockOrderTypes } from '../models/order';

// Utility for handling API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any,
  useAuth: boolean = true
): Promise<T> {
  if (USE_MOCK_DATA) {
    console.warn('Using mock data. For production, set USE_MOCK_DATA to false.');
    // Return empty data in production mode as fallback
    return {} as T;
  }

  // Real API implementation with Firebase
  try {
    // Extract collection and ID from endpoint
    const parts = endpoint.split('/').filter(p => p);
    const collectionName = parts[0];
    
    if (!collectionName) {
      throw new Error('Invalid endpoint format');
    }

    switch (method) {
      case 'GET': {
        // Handle specific GET patterns
        if (parts.length === 1) {
          // Get all documents from a collection
          const snapshot = await getDocs(collection(db, collectionName));
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as unknown as T;
        } else if (parts.length === 2) {
          // Get a specific document
          const docRef = doc(db, collectionName, parts[1]);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...docSnap.data()
            } as unknown as T;
          } else {
            throw new Error('Document does not exist');
          }
        } else if (parts.length >= 3 && parts[1] === 'check') {
          // Special case for checking if item exists
          const checkId = parts[2];
          const q = query(collection(db, collectionName), where("productId", "==", checkId));
          const snapshot = await getDocs(q);
          return (!snapshot.empty) as unknown as T;
        }
        break;
      }

      case 'POST': {
        // Create a new document
        const docRef = await addDoc(collection(db, collectionName), data);
        return {
          id: docRef.id,
          ...data
        } as unknown as T;
      }

      case 'PUT': {
        // Update an existing document
        if (parts.length < 2) {
          throw new Error('Document ID is required for updates');
        }
        
        const docRef = doc(db, collectionName, parts[1]);
        await updateDoc(docRef, data);
        
        // Get updated document
        const updatedDoc = await getDoc(docRef);
        return {
          id: updatedDoc.id,
          ...updatedDoc.data()
        } as unknown as T;
      }

      case 'DELETE': {
        // Delete a document
        if (parts.length < 2) {
          throw new Error('Document ID is required for deletion');
        }
        
        const docRef = doc(db, collectionName, parts[1]);
        await deleteDoc(docRef);
        return {} as T;
      }
    }

    throw new Error(`Unsupported operation: ${method} ${endpoint}`);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Product API
export const ProductAPI = {
  getAll: () => apiRequest<typeof mockProductTypes>('/products'),
  getById: (id: string) => apiRequest<typeof mockProductTypes[0]>(`/products/${id}`),
  getByCategory: (category: string) => apiRequest<typeof mockProductTypes>(`/products?category=${category}`),
  getFeatured: () => apiRequest<typeof mockProductTypes>('/products?featured=true'),
  getDiscounted: () => apiRequest<typeof mockProductTypes>('/products?discounted=true'),
  search: (query: string) => apiRequest<typeof mockProductTypes>(`/products?search=${query}`),
  create: (product: Omit<typeof mockProductTypes[0], 'id'>) => 
    apiRequest<typeof mockProductTypes[0]>('/products', 'POST', product),
  update: (id: string, product: Partial<typeof mockProductTypes[0]>) => 
    apiRequest<typeof mockProductTypes[0]>(`/products/${id}`, 'PUT', product),
  delete: (id: string) => apiRequest<void>(`/products/${id}`, 'DELETE'),
  getAllCategories: () => apiRequest<string[]>('/products/categories'),
};

// User API
export const UserAPI = {
  login: (email: string, password: string) => 
    apiRequest<{user: typeof mockUserTypes[0], token: string}>('/auth/login', 'POST', { email, password }, false),
  register: (userData: any) => 
    apiRequest<{user: typeof mockUserTypes[0], token: string}>('/auth/register', 'POST', userData, false),
  getCurrentUser: () => apiRequest<typeof mockUserTypes[0]>('/users/me'),
  updateUser: (id: string, userData: Partial<typeof mockUserTypes[0]>) => 
    apiRequest<typeof mockUserTypes[0]>(`/users/${id}`, 'PUT', userData),
  getById: (id: string) => apiRequest<typeof mockUserTypes[0]>(`/users/${id}`),
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  }
};

// Order API
export const OrderAPI = {
  create: (orderData: any) => apiRequest<typeof mockOrderTypes[0]>('/orders', 'POST', orderData),
  getAll: () => apiRequest<typeof mockOrderTypes>('/orders'),
  getById: (id: string) => apiRequest<typeof mockOrderTypes[0]>(`/orders/${id}`),
  getUserOrders: (userId: string) => apiRequest<typeof mockOrderTypes>(`/users/${userId}/orders`),
  updateStatus: (id: string, status: string) => 
    apiRequest<typeof mockOrderTypes[0]>(`/orders/${id}/status`, 'PUT', { status }),
};

// Review API
export const ReviewAPI = {
  getForProduct: (productId: string) => apiRequest<any[]>(`/products/${productId}/reviews`),
  create: (productId: string, review: {rating: number, comment: string}) => 
    apiRequest<any>(`/products/${productId}/reviews`, 'POST', review),
  delete: (reviewId: string) => apiRequest<void>(`/reviews/${reviewId}`, 'DELETE'),
};

// Cart API - this often remains client-side but can sync with backend
export const CartAPI = {
  getCart: () => apiRequest<any>('/cart'),
  addItem: (productId: string, quantity: number) => 
    apiRequest<any>('/cart/items', 'POST', { productId, quantity }),
  updateItem: (itemId: string, quantity: number) => 
    apiRequest<any>(`/cart/items/${itemId}`, 'PUT', { quantity }),
  removeItem: (itemId: string) => apiRequest<void>(`/cart/items/${itemId}`, 'DELETE'),
  clearCart: () => apiRequest<void>('/cart', 'DELETE'),
};

// Wishlist API
export const WishlistAPI = {
  getAll: () => apiRequest<any[]>('/wishlist'),
  addItem: (productId: string) => apiRequest<any>('/wishlist/items', 'POST', { productId }),
  removeItem: (productId: string) => apiRequest<void>(`/wishlist/items/${productId}`, 'DELETE'),
  checkIfInWishlist: (productId: string) => apiRequest<boolean>(`/wishlist/check/${productId}`),
};

// Security verification
export const SecurityAPI = {
  verifyTransaction: (transactionData: any) => 
    apiRequest<{verified: boolean, risk: 'low'|'medium'|'high'}>('/security/verify', 'POST', transactionData),
};

export default {
  Product: ProductAPI,
  User: UserAPI,
  Order: OrderAPI,
  Review: ReviewAPI,
  Cart: CartAPI,
  Wishlist: WishlistAPI,
  Security: SecurityAPI,
}; 