// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://api.creative-store.com';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || true;

// Import mock data (for development/fallback)
import { products as mockProducts } from '../models/product';
import { users as mockUsers } from '../models/user';
import { orders as mockOrders } from '../models/order';

// Utility for handling API requests
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any,
  useAuth: boolean = true
): Promise<T> {
  if (USE_MOCK_DATA) {
    // Return mock data with artificial delay to simulate network
    return new Promise((resolve) => {
      setTimeout(() => {
        // Handle mock data responses based on endpoint
        if (endpoint.includes('/products')) {
          if (endpoint === '/products') {
            resolve(mockProducts as unknown as T);
          } else {
            const id = endpoint.split('/').pop();
            const product = mockProducts.find(p => p.id === id);
            resolve(product as unknown as T);
          }
        } else if (endpoint.includes('/users')) {
          if (endpoint === '/users') {
            resolve(mockUsers as unknown as T);
          } else {
            const id = endpoint.split('/').pop();
            const user = mockUsers.find(u => u.id === id);
            resolve(user as unknown as T);
          }
        } else if (endpoint.includes('/orders')) {
          if (endpoint === '/orders') {
            resolve(mockOrders as unknown as T);
          } else {
            const id = endpoint.split('/').pop();
            const order = mockOrders.find(o => o.id === id);
            resolve(order as unknown as T);
          }
        } else {
          // Default mock response
          resolve({} as T);
        }
      }, 300); // Simulate network delay
    });
  }

  // Real API implementation
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authentication if needed and available
    if (useAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Product API
export const ProductAPI = {
  getAll: () => apiRequest<typeof mockProducts>('/products'),
  getById: (id: string) => apiRequest<typeof mockProducts[0]>(`/products/${id}`),
  getByCategory: (category: string) => apiRequest<typeof mockProducts>(`/products?category=${category}`),
  getFeatured: () => apiRequest<typeof mockProducts>('/products?featured=true'),
  getDiscounted: () => apiRequest<typeof mockProducts>('/products?discounted=true'),
  search: (query: string) => apiRequest<typeof mockProducts>(`/products?search=${query}`),
  create: (product: Omit<typeof mockProducts[0], 'id'>) => 
    apiRequest<typeof mockProducts[0]>('/products', 'POST', product),
  update: (id: string, product: Partial<typeof mockProducts[0]>) => 
    apiRequest<typeof mockProducts[0]>(`/products/${id}`, 'PUT', product),
  delete: (id: string) => apiRequest<void>(`/products/${id}`, 'DELETE'),
  getAllCategories: () => apiRequest<string[]>('/products/categories'),
};

// User API
export const UserAPI = {
  login: (email: string, password: string) => 
    apiRequest<{user: typeof mockUsers[0], token: string}>('/auth/login', 'POST', { email, password }, false),
  register: (userData: any) => 
    apiRequest<{user: typeof mockUsers[0], token: string}>('/auth/register', 'POST', userData, false),
  getCurrentUser: () => apiRequest<typeof mockUsers[0]>('/users/me'),
  updateUser: (id: string, userData: Partial<typeof mockUsers[0]>) => 
    apiRequest<typeof mockUsers[0]>(`/users/${id}`, 'PUT', userData),
  getById: (id: string) => apiRequest<typeof mockUsers[0]>(`/users/${id}`),
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  }
};

// Order API
export const OrderAPI = {
  create: (orderData: any) => apiRequest<typeof mockOrders[0]>('/orders', 'POST', orderData),
  getAll: () => apiRequest<typeof mockOrders>('/orders'),
  getById: (id: string) => apiRequest<typeof mockOrders[0]>(`/orders/${id}`),
  getUserOrders: (userId: string) => apiRequest<typeof mockOrders>(`/users/${userId}/orders`),
  updateStatus: (id: string, status: string) => 
    apiRequest<typeof mockOrders[0]>(`/orders/${id}/status`, 'PUT', { status }),
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