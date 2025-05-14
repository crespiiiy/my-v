import { useState, useEffect } from "react";
import type { Route } from "./+types/store";
import { products, getAllCategories } from "../models/product";
import ProductCard from "../components/ProductCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Store - Creative" },
    { name: "description", content: "Browse our collection of premium products for creative professionals." },
  ];
}

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDiscounted, setShowDiscounted] = useState(false);

  const categories = getAllCategories();
  
  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by discounted items
    if (showDiscounted && product.originalPrice === undefined) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "featured":
      default:
        return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store</h1>
        <p className="text-gray-400">
          Browse our collection of premium products for creative professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="mr-2"
                  />
                  <label htmlFor="all-categories">All Categories</label>
                </div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category}`}>{category}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
            
            {/* Discounted Items */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discounted"
                  checked={showDiscounted}
                  onChange={() => setShowDiscounted(!showDiscounted)}
                  className="mr-2"
                />
                <label htmlFor="discounted">Show only discounted items</label>
              </div>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setPriceRange([0, 2000]);
                setSearchQuery("");
                setShowDiscounted(false);
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-400">
              {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} found
            </div>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-400">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          
          {/* Products */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 