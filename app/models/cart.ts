import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateCartTotals(items: CartItem[]): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total,
  };
}

// Local storage key for cart
export const CART_STORAGE_KEY = "creative_cart";

// Save cart to local storage
export function saveCartToStorage(cart: Cart): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
}

// Load cart from local storage
export function loadCartFromStorage(): Cart | null {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  }
  return null;
}

// Create an empty cart
export function createEmptyCart(): Cart {
  return {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  };
}

// Add item to cart
export function addItemToCart(cart: Cart, product: Product, quantity: number = 1): Cart {
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.id === product.id
  );

  let updatedItems: CartItem[];

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    updatedItems = [...cart.items];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
    };
  } else {
    // Add new item
    updatedItems = [...cart.items, { product, quantity }];
  }

  const { subtotal, tax, total } = calculateCartTotals(updatedItems);

  const updatedCart = {
    items: updatedItems,
    subtotal,
    tax,
    total,
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
}

// Remove item from cart
export function removeItemFromCart(cart: Cart, productId: string): Cart {
  const updatedItems = cart.items.filter((item) => item.product.id !== productId);
  
  const { subtotal, tax, total } = calculateCartTotals(updatedItems);

  const updatedCart = {
    items: updatedItems,
    subtotal,
    tax,
    total,
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
}

// Update item quantity
export function updateItemQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  const updatedItems = cart.items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  const { subtotal, tax, total } = calculateCartTotals(updatedItems);

  const updatedCart = {
    items: updatedItems,
    subtotal,
    tax,
    total,
  };

  saveCartToStorage(updatedCart);
  return updatedCart;
}

// Clear cart
export function clearCart(): Cart {
  const emptyCart = createEmptyCart();
  saveCartToStorage(emptyCart);
  return emptyCart;
} 