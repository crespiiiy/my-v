import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/cart";
import { useCart } from "../contexts/CartContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopping Cart - Creative" },
    { name: "description", content: "Review and manage your shopping cart items." },
  ];
}

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const handlePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Example promo code logic
    if (promoCode.toLowerCase() === "creative10") {
      setPromoDiscount(cart.subtotal * 0.1);
      setPromoError(null);
    } else {
      setPromoError("Invalid promo code");
      setPromoDiscount(0);
    }
  };
  
  const totalWithDiscount = cart.total - promoDiscount;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
                
                {/* Cart Item List */}
                <div className="divide-y divide-gray-700">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="py-6 flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                        <Link to={`/store/${item.product.id}`}>
                          <img
                            src={item.product.images[0] || "https://placehold.co/200x200/111827/ffffff?text=No+Image"}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </Link>
                      </div>
                      
                      {/* Product Info */}
                      <div className="sm:ml-6 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <Link
                              to={`/store/${item.product.id}`}
                              className="text-lg font-medium hover:text-blue-400 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-400 mb-2">
                              {item.product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                            {item.product.originalPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                ${(item.product.originalPrice * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity and Remove */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="bg-gray-700 px-3 py-1 rounded-l-md"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-12 text-center bg-gray-800 py-1 border-y border-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="bg-gray-700 px-3 py-1 rounded-r-md"
                              disabled={item.quantity >= item.product.stockQuantity}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Discount</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 font-semibold text-lg flex justify-between">
                  <span>Total</span>
                  <span>${totalWithDiscount.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="mt-6">
                <form onSubmit={handlePromoCode} className="mb-4">
                  <label htmlFor="promo" className="block text-sm font-medium mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-white"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-400 text-sm mt-1">{promoError}</p>
                  )}
                  {promoDiscount > 0 && (
                    <p className="text-green-400 text-sm mt-1">Promo code applied!</p>
                  )}
                </form>
              </div>
              
              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-medium block text-center mt-6"
              >
                Proceed to Checkout
              </Link>
              
              {/* Continue Shopping */}
              <Link
                to="/store"
                className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-white py-3 rounded-md transition-colors font-medium block text-center mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/store"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 