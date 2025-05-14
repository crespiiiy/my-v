import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import type { Route } from "./+types/edit";
import { getProductById, getAllCategories } from "../../../models/product";

export function meta({ params }: Route.MetaArgs) {
  const product = getProductById(params.productId);
  return [
    { title: product ? `Edit ${product.name} - Creative` : "Edit Product - Creative" },
    { name: "description", content: "Edit product details" },
  ];
}

export default function EditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const categories = getAllCategories();
  const product = productId ? getProductById(productId) : undefined;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stockQuantity: "1",
    featured: false,
    inStock: true,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load product data when component mounts
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        category: product.category,
        stockQuantity: product.stockQuantity.toString(),
        featured: product.featured,
        inStock: product.inStock,
      });
      setImages(product.images);
      setIsLoaded(true);
    } else if (productId) {
      // Handle case where product is not found
      navigate("/admin/products", { replace: true });
    }
  }, [product, productId, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleAddImage = () => {
    if (!imageUrl) return;
    
    if (!imageUrl.startsWith("http")) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Please enter a valid URL starting with http:// or https://",
      }));
      return;
    }
    
    setImages((prev) => [...prev, imageUrl]);
    setImageUrl("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.imageUrl;
      return newErrors;
    });
  };
  
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    if (formData.originalPrice.trim() && (isNaN(parseFloat(formData.originalPrice)) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = "Original price must be a positive number";
    }
    
    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      newErrors.originalPrice = "Original price must be greater than current price";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = "Stock quantity is required";
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Stock quantity must be a non-negative number";
    }
    
    if (images.length === 0) {
      newErrors.images = "At least one product image is required";
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
    
    // In a real application, you would send this data to your backend API
    // For this example, we'll simulate a successful update
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to products page after successful submission
      navigate("/admin/products");
    }, 1500);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-16">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center">
        <Link
          to="/admin/products"
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.description ? "border-red-500" : "border-gray-600"
              } rounded-md text-white`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.price ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            
            {/* Original Price (for discounts) */}
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium mb-2">
                Original Price ($) <span className="text-gray-400">(for discounts)</span>
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.originalPrice ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
              />
              {errors.originalPrice && (
                <p className="mt-1 text-sm text-red-500">{errors.originalPrice}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Stock Quantity */}
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 bg-gray-700 border ${
                  errors.stockQuantity ? "border-red-500" : "border-gray-600"
                } rounded-md text-white`}
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-500">{errors.stockQuantity}</p>
              )}
            </div>
            
            {/* Status Options */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="inStock">In Stock</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="featured">Featured Product</label>
              </div>
            </div>
          </div>
          
          {/* Product Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Product Images *
            </label>
            <div className="flex flex-col space-y-4">
              <div className="flex">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className={`flex-grow px-4 py-2 bg-gray-700 border ${
                    errors.imageUrl ? "border-red-500" : "border-gray-600"
                  } rounded-l-md text-white`}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  Add
                </button>
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
              )}
              
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-700 border border-gray-600 rounded-md p-8 text-center">
                  <p className="text-gray-400">No images added yet</p>
                </div>
              )}
              {errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-between space-x-4 mt-8">
            <div>
              <button
                type="button"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
                    // In a real app, you would call an API to delete the product
                    setTimeout(() => {
                      navigate("/admin/products");
                    }, 500);
                  }
                }}
              >
                Delete Product
              </button>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin/products"
                className="px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors flex items-center"
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
          </div>
        </form>
      </div>
    </div>
  );
} 