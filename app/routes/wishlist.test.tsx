import React from 'react';
import { render, screen } from '@testing-library/react';
import WishlistPage from './wishlist';
import { WishlistProvider } from '../contexts/WishlistContext';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth context to simulate a logged-in user
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    user: { id: '123' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the wishlist context
jest.mock('../contexts/WishlistContext', () => ({
  useWishlist: () => ({
    wishlistItems: [],
    isLoading: false
  }),
  WishlistProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('WishlistPage', () => {
  test('renders the wishlist page when user is logged in', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <WishlistPage />
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Your Wishlist/i)).toBeInTheDocument();
  });
}); 