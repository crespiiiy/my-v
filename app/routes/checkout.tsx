import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Route } from "./+types/checkout";
import { useCart } from "../contexts/CartContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - Creative" },
    { name: "description", content: "Complete your purchase" },
  ];
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");
  
  // Calculate shipping cost based on selected method
  const shippingCost = 
    shippingMethod === "express" ? 15.99 :
    shippingMethod === "priority" ? 9.99 : 
    4.99; // standard
  
  // Calculate final total with shipping
  const finalTotal = cart.total + shippingCost;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      "firstName", "lastName", "email", "address", "city", 
      "state", "zipCode", "country"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData].trim()) {
        newErrors[field] = "This field is required";
      }
    });
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Payment validation
    if (formData.paymentMethod === "credit") {
      if (!formData.cardName.trim()) {
        newErrors.cardName = "Name on card is required";
      }
      
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = "Expiration date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Please use MM/YY format";
      }
      
      if (!formData.cardCVV.trim()) {
        newErrors.cardCVV = "Security code is required";
      } else if (!/^\d{3,4}$/.test(formData.cardCVV)) {
        newErrors.cardCVV = "Please enter a valid security code";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Clear the cart
      clearCart();
      // Redirect to success page
      navigate("/checkout/success", { state: { orderId: generateOrderId() } });
    }, 1500);
  };
  
  // Generate a random order ID
  const generateOrderId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  // If cart is empty, redirect to cart page
  if (cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Link
          to="/store"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center text-sm text-gray-400">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-blue-400">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">Checkout</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.firstName ? "border-red-500" : "border-gray-600"
                    } rounded-md text-white`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.lastName ? "border-red-500" : "border-gray-600"
                    } rounded-md text-white`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    } rounded-md text-white`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.address ? "border-red-500" : "border-gray-600"
                    } rounded-md text-white`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${
                        errors.city ? "border-red-500" : "border-gray-600"
                      } rounded-md text-white`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${
                        errors.state ? "border-red-500" : "border-gray-600"
                      } rounded-md text-white`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${
                        errors.zipCode ? "border-red-500" : "border-gray-600"
                      } rounded-md text-white`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${
                        errors.country ? "border-red-500" : "border-gray-600"
                      } rounded-md text-white`}
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
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Method */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-standard"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="mr-2"
                  />
                  <label htmlFor="shipping-standard" className="flex flex-grow justify-between">
                    <span>Standard Shipping (3-5 business days)</span>
                    <span className="font-semibold">$4.99</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-priority"
                    name="shippingMethod"
                    value="priority"
                    checked={shippingMethod === "priority"}
                    onChange={() => setShippingMethod("priority")}
                    className="mr-2"
                  />
                  <label htmlFor="shipping-priority" className="flex flex-grow justify-between">
                    <span>Priority Shipping (2-3 business days)</span>
                    <span className="font-semibold">$9.99</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-express"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="mr-2"
                  />
                  <label htmlFor="shipping-express" className="flex flex-grow justify-between">
                    <span>Express Shipping (1-2 business days)</span>
                    <span className="font-semibold">$15.99</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="payment-credit"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === "credit"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="payment-credit">Credit / Debit Card</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="payment-paypal">PayPal</label>
                </div>
              </div>
              
              {formData.paymentMethod === "credit" && (
                <div className="bg-gray-750 p-4 rounded-md">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 bg-gray-700 border ${
                          errors.cardName ? "border-red-500" : "border-gray-600"
                        } rounded-md text-white`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className={`w-full px-4 py-2 bg-gray-700 border ${
                          errors.cardNumber ? "border-red-500" : "border-gray-600"
                        } rounded-md text-white`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium mb-2">
                          Expiration Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`w-full px-4 py-2 bg-gray-700 border ${
                            errors.cardExpiry ? "border-red-500" : "border-gray-600"
                          } rounded-md text-white`}
                        />
                        {errors.cardExpiry && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="cardCVV" className="block text-sm font-medium mb-2">
                          Security Code (CVV) *
                        </label>
                        <input
                          type="text"
                          id="cardCVV"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          placeholder="XXX"
                          className={`w-full px-4 py-2 bg-gray-700 border ${
                            errors.cardCVV ? "border-red-500" : "border-gray-600"
                          } rounded-md text-white`}
                        />
                        {errors.cardCVV && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardCVV}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === "paypal" && (
                <div className="bg-gray-750 p-4 rounded-md text-center">
                  <p className="mb-4">You will be redirected to PayPal to complete your payment after reviewing your order.</p>
                  <img 
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                    alt="PayPal" 
                    className="h-10 mx-auto"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8 space-x-4">
              <Link
                to="/cart"
                className="px-6 py-3 bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                Return to Cart
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Order"
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Product List */}
            <div className="mb-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex justify-between py-2 border-b border-gray-700">
                  <div className="flex items-center">
                    <span className="font-medium">{item.quantity} x</span>
                    <span className="ml-2 truncate max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2 font-semibold text-lg flex justify-between">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="mt-6 text-sm text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout - your data is protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 