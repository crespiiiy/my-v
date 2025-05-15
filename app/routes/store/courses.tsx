import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../models/product";
import ProductCard from "../../components/ProductCard";

export function meta() {
  return [
    { title: "Programming Courses - Creative" },
    { name: "description", content: "Premium programming courses from top instructors worldwide. Advance your skills with our curated collection of technical courses." },
  ];
}

export default function Courses() {
  const [sortOption, setSortOption] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  // Filter only courses
  const allCourses = products.filter(product => product.category === "Courses");
  
  // Apply search filter
  const searchFiltered = allCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Apply price filter
  const priceFiltered = searchFiltered.filter(course => {
    switch(priceFilter) {
      case "under-50":
        return course.price < 50;
      case "50-100":
        return course.price >= 50 && course.price <= 100;
      case "over-100":
        return course.price > 100;
      default:
        return true;
    }
  });
  
  // Sort courses
  const sortedCourses = [...priceFiltered].sort((a, b) => {
    switch(sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "discount":
        const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
        const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
        return discountB - discountA;
      case "popular":
      default:
        return b.featured === a.featured ? 0 : b.featured ? 1 : -1;
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Programming Courses</h1>
        <p className="text-gray-400">
          Enhance your skills with our premium programming courses from top global instructors.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Expert Instructors</h3>
            <p className="text-center text-gray-400">Learn from industry professionals with real-world experience.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Lifetime Access</h3>
            <p className="text-center text-gray-400">Purchase once and get unlimited access to course content.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Certificate of Completion</h3>
            <p className="text-center text-gray-400">Earn certificates to showcase your newly acquired skills.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
            
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
                placeholder="Search courses..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-all"
                    name="price"
                    checked={priceFilter === "all"}
                    onChange={() => setPriceFilter("all")}
                    className="mr-2"
                  />
                  <label htmlFor="price-all">All Prices</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-under-50"
                    name="price"
                    checked={priceFilter === "under-50"}
                    onChange={() => setPriceFilter("under-50")}
                    className="mr-2"
                  />
                  <label htmlFor="price-under-50">Under $50</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-50-100"
                    name="price"
                    checked={priceFilter === "50-100"}
                    onChange={() => setPriceFilter("50-100")}
                    className="mr-2"
                  />
                  <label htmlFor="price-50-100">$50 - $100</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-over-100"
                    name="price"
                    checked={priceFilter === "over-100"}
                    onChange={() => setPriceFilter("over-100")}
                    className="mr-2"
                  />
                  <label htmlFor="price-over-100">Over $100</label>
                </div>
              </div>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearchQuery("");
                setPriceFilter("all");
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Courses Grid */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-400">
              {sortedCourses.length} {sortedCourses.length === 1 ? "course" : "courses"} found
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
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
          
          {/* Courses */}
          {sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCourses.map((course) => (
                <ProductCard key={course.id} product={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-400">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mt-12 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to upgrade your programming skills?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our premium courses.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/store"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md transition-colors font-medium"
            >
              Browse All Products
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 