import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  
  // Count number of courses available
  const coursesCount = products.filter(product => product.category === "Courses").length;
  
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
      
      {/* Courses Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Premium Programming Courses</h2>
            <p className="text-gray-200 mb-4">
              Enhance your skills with {coursesCount} high-quality courses from top global instructors. Lifetime access to comprehensive tutorials and resources.
            </p>
            <Link
              to="/store/courses"
              className="inline-flex items-center bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors font-medium"
            >
              Browse Courses
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-20 md:w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
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