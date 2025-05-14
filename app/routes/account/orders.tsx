import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { Route } from "../+types/account/orders";
import { useAuth } from "../../contexts/AuthContext";
import { getUserOrders } from "../../models/order";
import type { Order } from "../../models/order";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order History - Creative" },
    { name: "description", content: "View your order history and track deliveries" },
  ];
}

export default function OrderHistory() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: "/account/orders" } }} />;
  }
  
  // Get user orders
  const userOrders = user ? getUserOrders(user.id) : [];
  
  // State for expanded order details
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 text-yellow-100";
      case "processing":
        return "bg-blue-600 text-blue-100";
      case "shipped":
        return "bg-purple-600 text-purple-100";
      case "delivered":
        return "bg-green-600 text-green-100";
      case "cancelled":
        return "bg-red-600 text-red-100";
      default:
        return "bg-gray-600 text-gray-100";
    }
  };
  
  // View order details
  const viewOrderDetails = (orderId: string) => {
    navigate(`/account/orders/${orderId}`);
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-gray-400 mt-2">View and track your orders</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">Account Menu</h2>
            </div>
            <nav className="border-t border-gray-700">
              <Link
                to="/account"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/account/orders"
                className="block px-4 py-3 border-l-4 border-blue-500 bg-gray-750"
              >
                Order History
              </Link>
              <Link
                to="/account/addresses"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Saved Addresses
              </Link>
              <Link
                to="/account/password"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Change Password
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {userOrders.length > 0 ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-700">
                {userOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span className="font-semibold mr-2">${order.total.toFixed(2)}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-transform ${
                            expandedOrder === order.id ? "transform rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="mt-4 bg-gray-750 rounded-md p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">
                              Shipping Address
                            </h4>
                            <p className="text-sm">
                              {order.customerName}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.street}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p className="text-sm">
                              {order.shippingAddress.country}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">
                              Payment Method
                            </h4>
                            <p className="text-sm">
                              Credit Card
                            </p>
                            <p className="text-sm text-gray-400">
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">
                              Order Summary
                            </h4>
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Shipping:</span>
                              <span>${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tax:</span>
                              <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold mt-1 pt-1 border-t border-gray-700">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <h4 className="font-medium mb-2">Items</h4>
                        <div className="bg-gray-800 rounded-md">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center p-2 ${
                                index < order.items.length - 1
                                  ? "border-b border-gray-700"
                                  : ""
                              }`}
                            >
                              <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                                <img
                                  src={`/images/products/${item.productId}.jpg`}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-medium">{item.productName}</h5>
                                <p className="text-gray-400 text-sm">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ${item.totalPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Tracking Information */}
                        {order.trackingNumber && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Tracking Information</h4>
                            <div className="bg-gray-800 rounded-md p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-400 mb-1">
                                    Carrier
                                  </h5>
                                  <p>Standard Shipping</p>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-400 mb-1">
                                    Tracking Number
                                  </h5>
                                  <p>{order.trackingNumber}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-center border-t border-gray-700 pt-4">
                                <button
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://track.carrier.com?number=${order.trackingNumber}`, '_blank');
                                  }}
                                >
                                  Track Package
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewOrderDetails(order.id);
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            View Order Details
                          </button>
                          
                          {order.orderStatus === "delivered" && (
                            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">
                              Leave a Review
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-gray-400 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                to="/store"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 