import { Link, useLocation } from "react-router";
import type { Route } from "../+types/checkout/success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order Confirmed - Creative" },
    { name: "description", content: "Your order has been successfully placed" },
  ];
}

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || "UNKNOWN";
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-green-600 rounded-full p-4 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-xl text-gray-400">
          Your order has been confirmed and will be shipped soon.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Information</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Order Number:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className="text-green-400">Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Status:</span>
                <span>Processing</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
            <p className="text-gray-300">
              An email confirmation with tracking information will be sent once your order ships.
            </p>
            <p className="text-gray-400 mt-4">
              Estimated delivery: 3-5 business days
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="mr-4 bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Order Processing</h3>
              <p className="text-gray-400">
                Your order is being processed and prepared for shipping.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="mr-4 bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Shipping Confirmation</h3>
              <p className="text-gray-400">
                You'll receive an email with tracking information once your order ships.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="mr-4 bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold">Delivery</h3>
              <p className="text-gray-400">
                Your items will be delivered to your shipping address.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/store"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          to="/contact"
          className="bg-transparent border border-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-md transition-colors text-center"
        >
          Need Help?
        </Link>
      </div>
    </div>
  );
} 