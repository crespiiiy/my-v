export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounted items
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// Sample products data
export const products: Product[] = [
  {
    id: "1",
    name: "Professional Camera",
    description: "High-quality professional camera for photography enthusiasts. Features 4K video recording, 24MP sensor, and advanced autofocus system.",
    price: 1299.99,
    images: ["/images/products/product-1.jpg", "/images/products/product-2.jpg"],
    category: "Photography",
    featured: true,
    inStock: true,
    stockQuantity: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Graphic Design Software",
    description: "Industry-standard graphic design software with powerful tools for digital art, illustration, and photo editing.",
    price: 199.99,
    originalPrice: 249.99,
    images: ["/images/products/product-3.jpg", "/images/products/product-4.jpg"],
    category: "Software",
    featured: true,
    inStock: true,
    stockQuantity: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Drawing Tablet",
    description: "Professional drawing tablet with pressure sensitivity and wireless connectivity for digital artists.",
    price: 349.99,
    images: ["/images/products/product-5.jpg", "/images/products/product-6.jpg"],
    category: "Hardware",
    featured: false,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Studio Lighting Kit",
    description: "Complete studio lighting kit including 3 softbox lights, stands, and carrying case.",
    price: 199.99,
    originalPrice: 249.99,
    images: ["/images/products/product-7.jpg", "/images/products/product-8.jpg"],
    category: "Photography",
    featured: false,
    inStock: true,
    stockQuantity: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Premium Microphone",
    description: "Studio-quality condenser microphone for professional audio recording and podcasting.",
    price: 149.99,
    images: ["/images/products/product-9.jpg", "/images/products/product-10.jpg"],
    category: "Audio",
    featured: true,
    inStock: true,
    stockQuantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Video Editing Software",
    description: "Professional video editing software with advanced features for content creators.",
    price: 299.99,
    originalPrice: 349.99,
    images: ["/images/products/product-1.jpg", "/images/products/product-2.jpg"],
    category: "Software",
    featured: false,
    inStock: true,
    stockQuantity: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and studio-quality sound.",
    price: 249.99,
    images: ["/images/products/product-3.jpg", "/images/products/product-4.jpg"],
    category: "Audio",
    featured: true,
    inStock: true,
    stockQuantity: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Portable SSD Drive",
    description: "Fast, portable SSD storage for creative professionals. 1TB capacity with USB-C connectivity.",
    price: 179.99,
    images: ["/images/products/product-5.jpg", "/images/products/product-6.jpg"],
    category: "Storage",
    featured: false,
    inStock: true,
    stockQuantity: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Professional Tripod",
    description: "Sturdy, lightweight tripod for cameras and video equipment with fluid head for smooth panning.",
    price: 129.99,
    originalPrice: 159.99,
    images: ["/images/products/product-7.jpg", "/images/products/product-8.jpg"],
    category: "Photography",
    featured: false,
    inStock: true,
    stockQuantity: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Color Calibration Tool",
    description: "Professional color calibration tool for monitors and displays to ensure accurate color reproduction.",
    price: 199.99,
    images: ["/images/products/product-9.jpg", "/images/products/product-10.jpg"],
    category: "Accessories",
    featured: false,
    inStock: true,
    stockQuantity: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions for product operations
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getDiscountedProducts(): Product[] {
  return products.filter(product => product.originalPrice !== undefined);
}

export function getAllCategories(): string[] {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
} 