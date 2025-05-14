import { Link } from "react-router-dom";
import type { Route } from "./+types/services";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Services - Creative" },
    { name: "description", content: "Professional creative services for your business needs." },
  ];
}

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Photography",
      description: "Professional photography services for products, events, and portraits.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: "Graphic Design",
      description: "Creative graphic design services for branding, marketing materials, and digital assets.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: "Video Production",
      description: "Professional video production services for commercials, corporate videos, and social media content.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: "Web Design",
      description: "Custom website design and development services for businesses and individuals.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 5,
      name: "3D Modeling",
      description: "Professional 3D modeling and rendering services for product visualization and architectural visualization.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      ),
    },
    {
      id: 6,
      name: "Content Creation",
      description: "Professional content creation services for blogs, social media, and marketing materials.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Creative Services</h1>
              <p className="text-xl text-gray-300 mb-8">
                We offer a wide range of creative services to help your business stand out.
                From photography to web design, we've got you covered.
              </p>
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors font-medium inline-block"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <div className="text-blue-500 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-400 mb-4">{service.description}</p>
              <Link
                to="/contact"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
              >
                Request a Quote
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
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-16">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-400">
                We start with a detailed consultation to understand your needs and goals.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Planning</h3>
              <p className="text-gray-400">
                We create a detailed plan and strategy tailored to your specific requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Execution</h3>
              <p className="text-gray-400">
                Our team of experts executes the plan with precision and creativity.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Delivery</h3>
              <p className="text-gray-400">
                We deliver the final product and ensure your complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
              <div>
                <h3 className="font-semibold">John Smith</h3>
                <p className="text-sm text-gray-400">CEO, Tech Innovators</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "The team at Creative delivered exceptional results for our product photography. Their attention to detail and creativity exceeded our expectations."
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
              <div>
                <h3 className="font-semibold">Sarah Johnson</h3>
                <p className="text-sm text-gray-400">Marketing Director, Bloom Co.</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "Working with Creative on our website redesign was a game-changer for our business. The new design is not only beautiful but also highly functional."
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4"></div>
              <div>
                <h3 className="font-semibold">Michael Brown</h3>
                <p className="text-sm text-gray-400">Founder, Design Masters</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "The 3D modeling services provided by Creative helped us visualize our products in a way that was previously impossible. Highly recommended!"
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how our creative services can help your business grow.
            </p>
            <Link
              to="/contact"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md transition-colors font-medium inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 