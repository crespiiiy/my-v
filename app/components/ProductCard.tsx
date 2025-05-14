import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../models/product";
import { useCart } from "../contexts/CartContext";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = product.originalPrice !== undefined;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative">
        <Link to={`/store/${product.id}`}>
          <img
            src={product.images[0] || "/images/products/product-1.jpg"}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Featured
          </div>
        )}
        
        {/* Wishlist Button */}
        <div className="absolute bottom-2 right-2">
          <WishlistButton product={product} size="sm" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/store/${product.id}`} className="hover:text-blue-400">
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </Link>
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-gray-400 text-sm line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            {product.category}
          </span>
          <button
            onClick={() => addItem(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
} 