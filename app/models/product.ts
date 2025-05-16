import { saveProduct, getAllProducts, isProductCollectionInitialized, saveAllProducts } from '../services/productService';

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
export let products: Product[] = [
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
  // كورسات برمجة عالمية
  {
    id: "11",
    name: "The Art of Mac Malware",
    description: "Unmask the secrets behind macOS exploitation. Think macOS is completely secure? This advanced and captivating course takes you deep into the world of Mac malware—how it's created, concealed, and detected. Whether you're a security researcher, tool developer, or cybersecurity enthusiast, this path is designed to sharpen your skills and reveal unseen aspects of macOS threats.",
    price: 94.99,
    originalPrice: 199.99,
    images: ["/images/courses/mac-malware.jpg"],
    category: "Courses",
    featured: true,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Android Malware",
    description: "Step into the dark world of Android hacking. In this course, you'll learn how malware is built, how hackers think, and how to reverse-engineer malicious apps like a pro. Master analysis tools, dynamic environments, and real-world evasion techniques used by advanced Android threats. If you're serious about cybersecurity — this is where your journey begins.",
    price: 89.99,
    originalPrice: 169.99,
    images: ["/images/courses/Android-Malware.jpg"],
    category: "Courses",
    featured: true,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "13",
    name: "Certified Ethical Hacker (CEH) – EC-Council",
    description: "A comprehensive course by Nathan House covering all aspects of cybersecurity, from networking to secure browsing. Suitable for all levels, with high ratings from learners.",
    price: 109.99,
    originalPrice: 199.99,
    images: ["/images/courses/course3.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "14",
    name: "Cyber Security: From Zero to Hero",
    description: "Comprehensive cybersecurity course covering ethical hacking, penetration testing, network security, cryptography, and security best practices. Includes hands-on labs and real-world scenarios.",
    price: 84.99,
    originalPrice: 169.99,
    images: ["/images/courses/course4.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "15",
    name: "IBM Full Stack Software Developer – Coursera",
    description: "An all-in-one course by IBM preparing you to become a Full Stack Developer. It covers modern technologies like React, Node.js, and Cloud Native, making you job-ready in under 4 months. No prior experience required.",
    price: 89.99,
    originalPrice: 179.99,
    images: ["/images/courses/course5.png"],
    category: "Courses",
    featured: true,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "16",
    name: "Quantum Cyber Warfare: Mastering AI-Driven Penetration Testing",
    description: "Learn the advanced techniques of AI-driven penetration testing and quantum cyber warfare. This cutting-edge course prepares you for the next generation of cybersecurity challenges.",
    price: 99.99,
    originalPrice: 189.99,
    images: ["/images/courses/course6.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "17",
    name: "Cyber Security: From Beginner to Expert – Udemy",
    description: "A comprehensive course starting from basics to advanced concepts in cybersecurity, covering topics like cyber attacks, malware analysis, and application security.",
    price: 119.99,
    originalPrice: 229.99,
    images: ["/images/courses/course7.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "18",
    name: "Advanced Backend Development with Node.js",
    description: "Comprehensive Node.js course for building scalable, secure backend systems. Covers Express.js, authentication, RESTful APIs, GraphQL, database integration, deployment, and more.",
    price: 124.99,
    originalPrice: 249.99,
    images: ["/images/courses/course8.png"],
    category: "Courses",
    featured: true,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "19",
    name: "The Complete Cyber Security Course – Udemy (Nathan House)",
    description: "A comprehensive course by Nathan House covering all aspects of cybersecurity, from networking to secure browsing. Suitable for all levels, with high ratings from learners.",
    price: 94.99,
    originalPrice: 179.99,
    images: ["/images/courses/course9.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "20",
    name: "Advanced Backend Development with Node.js",
    description: "Comprehensive Node.js course for building scalable, secure backend systems. Covers Express.js, authentication, RESTful APIs, GraphQL, database integration, deployment, and more.",
    price: 89.99,
    originalPrice: 169.99,
    images: ["/images/courses/course8.png"],
    category: "Courses",
    featured: false,
    inStock: true,
    stockQuantity: 999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Load products from localStorage if available (must run on client side)
try {
  if (typeof window !== 'undefined') {
    // Add a version check to force refresh on update
    const CURRENT_DATA_VERSION = "1.0.1"; // Increment this when making data changes
    const savedVersion = localStorage.getItem('creative_products_version');
    
    // If version mismatch, clear localStorage to force refresh
    if (savedVersion !== CURRENT_DATA_VERSION) {
      console.log('Data version mismatch. Clearing cached products.');
      localStorage.removeItem('creative_products');
      localStorage.setItem('creative_products_version', CURRENT_DATA_VERSION);
    } else {
      // Only load from localStorage if version matches
      const savedProducts = localStorage.getItem('creative_products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          products = parsedProducts;
        }
      }
    }
  }
} catch (error) {
  console.error('Error loading products from localStorage:', error);
}

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

// New function to update a product
export function updateProduct(id: string, updatedData: Partial<Product>): Product | undefined {
  const index = products.findIndex(product => product.id === id);
  
  if (index !== -1) {
    // Get the current product
    const currentProduct = products[index];
    
    // Create updated product with new data
    const updatedProduct = {
      ...currentProduct,
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Update the product in the array
    products[index] = updatedProduct;
    
    // Save to localStorage for local persistence
    try {
      localStorage.setItem('creative_products', JSON.stringify(products));
      // Also update the version in localStorage
      localStorage.setItem('creative_products_version', "1.0.1");
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
    
    // Save to Firebase for online persistence 
    // We're using the async function but not waiting for it to complete
    saveProduct(updatedProduct)
      .then(success => {
        if (success) {
          console.log('Product successfully saved to Firebase');
        } else {
          console.error('Failed to save product to Firebase');
        }
      })
      .catch(error => {
        console.error('Error saving product to Firebase:', error);
      });
    
    return updatedProduct;
  }
  
  return undefined;
}

// Reset all courses to match the ones defined in code
export async function resetCoursesToDefault() {
  // Default courses data for IDs 13-20
  const defaultCourses = products.filter(p => p.id >= "13" && p.id <= "20");
  
  // Update localStorage with default courses
  try {
    // Get existing products from localStorage
    const savedProductsStr = localStorage.getItem('creative_products');
    if (savedProductsStr) {
      let savedProducts: Product[] = JSON.parse(savedProductsStr);
      
      // Replace courses in saved products
      savedProducts = savedProducts.map((p: Product) => {
        if (p.id >= "13" && p.id <= "20") {
          // Find the default course with the same ID
          const defaultCourse = defaultCourses.find(d => d.id === p.id);
          return defaultCourse || p;
        }
        return p;
      });
      
      // Save updated products back to localStorage
      localStorage.setItem('creative_products', JSON.stringify(savedProducts));
      localStorage.setItem('creative_products_version', "1.0.1");
      
      // Update in-memory products
      products = savedProducts;
    }
    
    // Also save to Firebase
    await saveAllProducts(products);
    
    return true;
  } catch (error) {
    console.error('Error resetting courses:', error);
    return false;
  }
}

// Initialize Firebase products if needed
export async function initializeFirebaseProducts() {
  try {
    // Check if products already exist in Firebase
    const isInitialized = await isProductCollectionInitialized();
    
    if (!isInitialized) {
      // If not, save all default products to Firebase
      console.log('Initializing products in Firebase for the first time');
      await saveAllProducts(products);
    } else {
      // If products exist in Firebase, load them
      console.log('Loading products from Firebase');
      const firebaseProducts = await getAllProducts();
      
      if (firebaseProducts && firebaseProducts.length > 0) {
        // Update the products array with data from Firebase
        products = firebaseProducts;
        
        // Also update localStorage
        localStorage.setItem('creative_products', JSON.stringify(products));
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase products:', error);
    return false;
  }
} 