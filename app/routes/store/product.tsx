import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import type { Route } from "./+types/product";
import { getProductById, getProductsByCategory } from "../../models/product";
import { useCart } from "../../contexts/CartContext";
import ProductCard from "../../components/ProductCard";

export function meta({ params }: Route.MetaArgs) {
  const product = getProductById(params.productId);
  
  if (!product) {
    return [
      { title: "Product Not Found - Creative" },
      { name: "description", content: "The requested product could not be found." },
    ];
  }
  
  return [
    { title: `${product.name} - Creative` },
    { name: "description", content: product.description },
  ];
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const product = productId ? getProductById(productId) : undefined;
  
  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/store"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Back to Store
        </Link>
      </div>
    );
  }
  
  // Get related products (same category)
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);
  
  const hasDiscount = product.originalPrice !== undefined;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    // Show success message or navigate to cart
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center text-sm text-gray-400">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/store" className="hover:text-blue-400">Store</Link>
        <span className="mx-2">/</span>
        <Link to={`/store?category=${product.category}`} className="hover:text-blue-400">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{product.name}</span>
      </div>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[activeImageIndex] || "https://placehold.co/800x600/111827/ffffff?text=No+Image"}
              alt={product.name}
              className="w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`bg-gray-800 rounded overflow-hidden border-2 ${
                    activeImageIndex === index ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold mr-2">${product.price.toFixed(2)}</span>
                <span className="text-gray-400 line-through mr-2">${product.originalPrice!.toFixed(2)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              product.inStock ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
            }`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>
          
          {product.inStock && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-4">Quantity:</label>
                <div className="flex items-center">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="bg-gray-700 px-3 py-1 rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stockQuantity}
                    className="w-16 text-center bg-gray-800 py-1 border-y border-gray-700"
                  />
                  <button
                    onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)}
                    className="bg-gray-700 px-3 py-1 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
          )}
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-semibold mb-2">Product Details:</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="font-medium text-gray-300">Category:</span> {product.category}
              </li>
              <li>
                <span className="font-medium text-gray-300">Stock:</span> {product.stockQuantity} units
              </li>
              <li>
                <span className="font-medium text-gray-300">Product ID:</span> {product.id}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 