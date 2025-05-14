import { useState } from "react";
import { Link, Navigate } from "react-router";
import type { Route } from "../+types/account/index";
import { useAuth } from "../../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your Account - Creative" },
    { name: "description", content: "Manage your Creative account" },
  ];
}

export default function Account() {
  const { user, isLoggedIn, updateUserInfo } = useAuth();
  
  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: { pathname: "/account" } }} />;
  }
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Update user info
    updateUserInfo({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: "Your account information has been updated successfully.",
      });
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }, 1000);
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Account</h1>
        <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.type === "success" ? "bg-green-800/30 text-green-200" : "bg-red-800/30 text-red-200"}`}>
          {message.text}
        </div>
      )}
      
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
                className="block px-4 py-3 border-l-4 border-blue-500 bg-gray-750"
              >
                Profile
              </Link>
              <Link
                to="/account/orders"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
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
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Account Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">Email address cannot be changed</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
                  Address Information
                </h3>
                
                <div className="mb-6">
                  <label htmlFor="street" className="block text-sm font-medium mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Name</h3>
                    <p>{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Email</h3>
                    <p>{user?.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Phone Number</h3>
                  <p>{user?.phoneNumber || "Not provided"}</p>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  
                  {user?.address ? (
                    <div>
                      <p>{user.address.street}</p>
                      <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                      <p>{user.address.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No address provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 