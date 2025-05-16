import { Link } from "react-router-dom";
import type { Route } from "./+types/bio";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us - Creative" },
    { name: "description", content: "Learn about our team and our mission at Creative." },
  ];
}

export default function Bio() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Creative</h1>
              <p className="text-xl text-gray-300">
                We're a team of passionate creatives dedicated to helping businesses succeed through innovative design and technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-300 mb-4">
              Founded in 2015, Creative began with a simple mission: to provide businesses with high-quality creative solutions that help them stand out in a crowded marketplace.
            </p>
            <p className="text-gray-300 mb-4">
              What started as a small design studio has grown into a full-service creative agency, offering everything from photography and graphic design to web development and content creation.
            </p>
            <p className="text-gray-300">
              Throughout our journey, we've remained committed to our core values of quality, innovation, and customer satisfaction. We believe that great design has the power to transform businesses, and we're dedicated to helping our clients achieve their goals through creative excellence.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src="/images/our-story.jpg"
              alt="Our Story"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Excellence</h3>
            <p className="text-gray-400">
              We strive for excellence in everything we do, from the quality of our products to the service we provide to our customers.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-400">
              We embrace creativity and innovation, constantly exploring new ideas and technologies to deliver cutting-edge solutions.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="bg-blue-600 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-400">
              We believe in the power of collaboration, working closely with our clients and each other to achieve the best results.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Creative Journey</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If you're passionate about creativity and innovation, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md transition-colors font-medium inline-block"
              >
                Contact Us
              </Link>
              <Link
                to="/store"
                className="bg-transparent border border-white hover:bg-white/10 text-white px-8 py-3 rounded-md transition-colors font-medium inline-block"
              >
                Explore Our Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 