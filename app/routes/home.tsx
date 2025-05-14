import { Link } from "react-router";
import type { Route } from "./+types/home";
import { getFeaturedProducts } from "../models/product";
import ProductCard from "../components/ProductCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creative - Premium Products for Creatives" },
    { name: "description", content: "Premium quality products for creative professionals." },
  ];
}

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Premium Tools for Creative Professionals
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Discover our collection of high-quality products designed to enhance your creative workflow.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/store"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
                >
                  Shop Now
                </Link>
                <Link
                  to="/services"
                  className="bg-transparent border border-white hover:bg-white/10 text-white px-6 py-3 rounded-md transition-colors font-medium"
                >
                  Our Services
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://placehold.co/800x600/111827/ffffff?text=Creative+Tools"
                  alt="Creative Tools"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg">
                <span className="font-bold">New Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/store"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-900 rounded-2xl py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Creative</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-400">
                All our products are crafted with the highest quality materials and standards.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-400">
                We ensure quick processing and shipping to get your products to you faster.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400">
                Our customer support team is always available to assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Creative Work?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Browse our collection of premium tools and products designed for creative professionals.
          </p>
          <Link
            to="/store"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md transition-colors font-medium inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
