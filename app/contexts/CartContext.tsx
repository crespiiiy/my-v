import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "../models/product";
import type { Cart } from "../models/cart";
import {
  addItemToCart,
  createEmptyCart,
  loadCartFromStorage,
  removeItemFromCart,
  updateItemQuantity,
  clearCart as clearCartFunction,
} from "../models/cart";

interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(createEmptyCart());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from local storage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      setCart(savedCart);
    }
    setIsInitialized(true);
  }, []);

  // Calculate total items in cart
  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  // Add item to cart
  const addItem = (product: Product, quantity: number = 1) => {
    setCart((currentCart) => addItemToCart(currentCart, product, quantity));
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setCart((currentCart) => removeItemFromCart(currentCart, productId));
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) => updateItemQuantity(currentCart, productId, quantity));
  };

  // Clear cart
  const clearCart = () => {
    setCart(clearCartFunction());
  };

  // Only render children when cart is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 