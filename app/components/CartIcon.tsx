import React, { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../contexts/CartContext";

export default function CartIcon() {
  const { itemCount } = useCart();
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);

  return (
    <div className="relative">
      <Link
        to="/cart"
        className="flex items-center text-white hover:text-blue-400 transition-colors"
        onMouseEnter={() => setIsCartPreviewOpen(true)}
        onMouseLeave={() => setIsCartPreviewOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </div>
  );
} 