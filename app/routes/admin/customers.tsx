import { useState } from "react";
import { Link } from "react-router-dom";
import type { Route } from "./+types/customers";
import { 
  getAllCustomers, 
  getActiveCustomers, 
  getInactiveCustomers,
  updateCustomer,
  addCustomerNote
} from "../../models/customer";
import type { Customer } from "../../models/customer";
import { getOrdersByCustomerId } from "../../models/order";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Customers - Creative Admin" },
    { name: "description", content: "Manage customers" },
  ];
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(getAllCustomers());
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [noteText, setNoteText] = useState("");
  
  // Filter customers based on status and search query
  const filteredCustomers = customers
    .filter(customer => {
      if (statusFilter === "all") return true;
      return customer.status === statusFilter;
    })
    .filter(customer => {
      const query = searchQuery.toLowerCase();
      return (
        customer.id.toLowerCase().includes(query) ||
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(query))
      );
    });
  
  // Handle customer status toggle
  const handleStatusToggle = (customerId: string, newStatus: 'active' | 'inactive') => {
    const updatedCustomer = updateCustomer(customerId, { status: newStatus });
    if (updatedCustomer) {
      setCustomers(customers.map(c => c.id === customerId ? updatedCustomer : c));
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(updatedCustomer);
      }
    }
  };
  
  // Handle customer note addition
  const handleAddNote = (customerId: string) => {
    if (!noteText.trim()) return;
    
    const updatedCustomer = addCustomerNote(customerId, noteText);
    if (updatedCustomer) {
      setCustomers(customers.map(c => c.id === customerId ? updatedCustomer : c));
      setSelectedCustomer(updatedCustomer);
      setNoteText("");
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customers</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Filter:</span>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "inactive", label: "Inactive" }
                ].map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setStatusFilter(status.id as "all" | "active" | "inactive")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      statusFilter === status.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white w-full"
              />
            </div>
          </div>
          
          {/* Customers Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCustomers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className={`hover:bg-gray-750 cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-gray-750' : ''}`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{customer.email}</div>
                          {customer.phoneNumber && (
                            <div className="text-sm text-gray-400">
                              {customer.phoneNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{customer.totalOrders} orders</div>
                          <div className="text-sm text-gray-400">
                            ${customer.totalSpent.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md text-xs ${
                            customer.status === 'active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusToggle(
                                customer.id, 
                                customer.status === 'active' ? 'inactive' : 'active'
                              );
                            }}
                            className="text-blue-400 hover:text-blue-300 mr-3"
                          >
                            {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400 mb-4">No customers found matching your filters.</p>
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
        
        {/* Customer Details */}
        <div>
          {selectedCustomer ? (
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="divide-y divide-gray-700">
                <div className="py-3">
                  <h3 className="text-lg font-medium mb-2">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      selectedCustomer.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className="text-gray-400">{selectedCustomer.status}</span>
                  </div>
                </div>
                
                <div className="py-3">
                  <h4 className="text-sm text-gray-400 mb-1">Contact Information</h4>
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    {selectedCustomer.phoneNumber && (
                      <div className="flex items-center gap-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{selectedCustomer.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedCustomer.address && (
                    <div className="mt-2">
                      <div className="flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mt-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div>{selectedCustomer.address.street}</div>
                          <div>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}</div>
                          <div>{selectedCustomer.address.country}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="py-3">
                  <h4 className="text-sm text-gray-400 mb-1">Customer Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-semibold">{selectedCustomer.totalOrders}</div>
                      <div className="text-sm text-gray-400">Orders</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Total Spent</div>
                    </div>
                  </div>
                  {selectedCustomer.lastOrderDate && (
                    <div className="mt-2 text-sm text-gray-400">
                      Last order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="py-3">
                  <h4 className="text-sm text-gray-400 mb-2">Customer Notes</h4>
                  <div className="mb-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note about this customer..."
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      rows={3}
                    ></textarea>
                    <button
                      onClick={() => handleAddNote(selectedCustomer.id)}
                      disabled={!noteText.trim()}
                      className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded-md text-sm w-full transition-colors"
                    >
                      Add Note
                    </button>
                  </div>
                  
                  {selectedCustomer.notes ? (
                    <div className="bg-gray-750 rounded-md p-3 text-sm">
                      {selectedCustomer.notes.split('\n').map((note, i) => (
                        <div key={i} className={i > 0 ? 'mt-2 pt-2 border-t border-gray-700' : ''}>
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No notes yet.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-2">Select a customer to view details</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 