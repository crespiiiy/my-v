import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "../components/ProductCard";

export function meta() {
  return [
    { title: "Your Wishlist - Creative" },
    { name: "description", content: "View and manage your saved wishlist items." },
  ];
}

export default function WishlistPage() {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { isLoggedIn } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: "/wishlist" } }} />;
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-gray-400">
          {wishlistItems.length === 0
            ? "You haven't added any items to your wishlist yet."
            : `You have ${wishlistItems.length} ${
                wishlistItems.length === 1 ? "item" : "items"
              } in your wishlist.`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6">
            Start adding products you like to your wishlist for easier access later.
          </p>
          <Link
            to="/store"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex justify-between items-center mb-12">
              <Link
                to="/store"
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue shopping
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
} 