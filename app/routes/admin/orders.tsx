import { useState } from "react";
import { Link } from "react-router-dom";
import type { Route } from "./+types/orders";
import { getAllOrders, getOrdersByStatus, updateOrderStatus, updateTrackingNumber } from "../../models/order";
import type { Order, OrderStatus } from "../../models/order";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Orders - Creative Admin" },
    { name: "description", content: "Manage customer orders" },
  ];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(getAllOrders());
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingValue, setTrackingValue] = useState("");
  
  // Filter orders based on status and search query
  const filteredOrders = orders
    .filter(order => statusFilter === "all" || order.orderStatus === statusFilter)
    .filter(order => {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(query))
      );
    });
  
  // Handle order status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrder = updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === orderId ? updatedOrder : order)
      );
    }
  };
  
  // Handle tracking number update
  const handleTrackingSubmit = (orderId: string) => {
    if (!trackingValue.trim()) return;
    
    const updatedOrder = updateTrackingNumber(orderId, trackingValue);
    if (updatedOrder) {
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === orderId ? updatedOrder : order)
      );
      setEditingTrackingId(null);
      setTrackingValue("");
    }
  };
  
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch(status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      case "processing":
        return "bg-blue-500/20 text-blue-300";
      case "shipped":
        return "bg-purple-500/20 text-purple-300";
      case "delivered":
        return "bg-green-500/20 text-green-300";
      case "cancelled":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">Filter by Status:</span>
          <div className="flex flex-wrap gap-2">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as OrderStatus | "all")}
                className={`px-3 py-1 rounded-md text-sm ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white w-full"
          />
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`px-3 py-1 rounded-md text-sm border-0 ${getStatusBadgeClass(order.orderStatus)}`}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <option value="pending" className="bg-gray-800 text-yellow-300">Pending</option>
                        <option value="processing" className="bg-gray-800 text-blue-300">Processing</option>
                        <option value="shipped" className="bg-gray-800 text-purple-300">Shipped</option>
                        <option value="delivered" className="bg-gray-800 text-green-300">Delivered</option>
                        <option value="cancelled" className="bg-gray-800 text-red-300">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingTrackingId === order.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={trackingValue}
                            onChange={(e) => setTrackingValue(e.target.value)}
                            placeholder="Enter tracking #"
                            className="px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded-md"
                          />
                          <button
                            onClick={() => handleTrackingSubmit(order.id)}
                            className="px-2 py-1 text-xs bg-blue-600 rounded-md"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {order.trackingNumber ? (
                            <span className="text-sm">{order.trackingNumber}</span>
                          ) : (
                            <span className="text-sm text-gray-500">No tracking</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingTrackingId(order.id);
                              setTrackingValue(order.trackingNumber || "");
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400 mb-4">No orders found matching your filters.</p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 