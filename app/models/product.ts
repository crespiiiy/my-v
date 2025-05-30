import { saveProduct, getAllProducts, isProductCollectionInitialized, saveAllProducts } from '../services/productService';
import { forceResyncProductsToFirebase } from '../services/productSync';

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
    name: "DarkComet RAT",
    description: "A powerful remote access tool designed for educational and security testing purposes. Features an easy-to-use interface and multiple system control capabilities. Ideal for cybersecurity professionals learning how to protect systems from vulnerabilities.",
    price: 299.99,
    images: ["/images/products/rat-1.jpg"],
    category: "RAT Tools",
    featured: true,
    inStock: true,
    stockQuantity: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Quasar RAT",
    description: "An open-source remote access tool for learning and system testing. Featuring lightweight design, ease of use, and advanced system monitoring capabilities. Suitable for those interested in understanding protection mechanisms and identifying security vulnerabilities.",
    price: 149.99,
    originalPrice: 199.99,
    images: ["/images/products/rat-2.jpg"],
    category: "RAT Tools",
    featured: false,
    inStock: true,
    stockQuantity: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "NjRAT",
    description: "Advanced educational remote access tool with a simple interface allowing security researchers to understand how hacking tools operate. Includes features such as file manager, screen monitoring, and keylogging for testing purposes.",
    price: 179.99,
    images: ["/images/products/rat-3.jpg"],
    category: "RAT Tools",
    featured: true,
    inStock: true,
    stockQuantity: 75,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "AsyncRAT",
    description: "Advanced remote access application with strong connection encryption and advanced customization options. Provides security researchers with an effective tool for testing systems and networks against remote control attacks.",
    price: 199.99,
    originalPrice: 249.99,
    images: ["/images/products/rat-4.jpg"],
    category: "RAT Tools",
    featured: false,
    inStock: true,
    stockQuantity: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "iPhone 15 Pro Max",
    description: "Apple's latest flagship phone featuring the A17 Pro chip, a professional 48MP camera, and exceptional photography capabilities. Comes with a titanium design, 6.7-inch ProMotion display with brightness up to 2000 nits.",
    price: 1299.99,
    images: ["/images/products/iphone-15-pro-max.jpg"],
    category: "Smartphones",
    featured: true,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "iPhone 15 Pro",
    description: "Advanced Apple phone with A17 Pro chip, titanium design, and 48MP camera with sophisticated photography features. 6.1-inch ProMotion display with all-day battery life.",
    price: 999.99,
    images: ["/images/products/iphone-15-pro.jpg"],
    category: "Smartphones",
    featured: false,
    inStock: true,
    stockQuantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "iPhone 15",
    description: "New Apple phone featuring the A16 Bionic chip, 48MP camera, and advanced aluminum design. Features a 6.1-inch display with Dynamic Island functionality and excellent battery life.",
    price: 799.99,
    images: ["/images/products/iphone-15.jpg"],
    category: "Smartphones",
    featured: false,
    inStock: true,
    stockQuantity: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "iPhone 15 Plus",
    description: "Larger version of the iPhone 15 with a 6.7-inch display and longer-lasting battery. Features the A16 Bionic chip, 48MP camera with night photography improvements, and Dynamic Island feature.",
    price: 899.99,
    images: ["/images/products/iphone-15-plus.jpg"],
    category: "Smartphones",
    featured: false,
    inStock: true,
    stockQuantity: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Samsung Galaxy S24 Ultra",
    description: "Samsung's latest flagship featuring Snapdragon 8 Gen 3 processor, quad-camera with 200MP main sensor, 12GB RAM, and built-in S Pen. Features advanced AI technology and Dynamic AMOLED 2X display with QHD+ resolution.",
    price: 1199.99,
    originalPrice: 1299.99,
    images: ["/images/products/galaxy-s24-ultra.jpg"],
    category: "Smartphones",
    featured: true,
    inStock: true,
    stockQuantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Samsung Galaxy S24+",
    description: "Premium Samsung smartphone with 6.7-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 12GB RAM and 256GB storage. Equipped with Galaxy AI technology for intelligent features.",
    price: 999.99,
    images: ["/images/products/galaxy-s24-plus.jpg"],
    category: "Smartphones",
    featured: false,
    inStock: true,
    stockQuantity: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Samsung Galaxy S24",
    description: "Samsung's latest smart phone with 6.2-inch display, powerful processor, 8GB RAM, and advanced triple camera. Features Galaxy AI technology and elegant water and dust resistant design.",
    price: 799.99,
    images: ["/images/products/galaxy-s24.jpg"],
    category: "Smartphones",
    featured: false,
    inStock: true,
    stockQuantity: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Samsung Galaxy Z Fold 5",
    description: "Samsung's foldable phone with 6.2-inch external display and 7.6-inch internal display. Comes with Snapdragon 8 Gen 2, 12GB RAM, advanced triple camera, and S Pen support.",
    price: 1799.99,
    originalPrice: 1899.99,
    images: ["/images/products/galaxy-z-fold-5.jpg"],
    category: "Smartphones",
    featured: true,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "21",
    name: "VPS Basic",
    description: "Basic virtual private server with 2 CPU cores, 4GB RAM, 80GB SSD storage, and 2TB monthly bandwidth. Ideal for small websites and development environments.",
    price: 9.99,
    images: ["/images/products/vps-basic.jpg"],
    category: "VPS Servers",
    featured: false,
    inStock: true,
    stockQuantity: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "22",
    name: "VPS Premium",
    description: "High-performance virtual private server with 8 CPU cores, 16GB RAM, 500GB SSD storage, and unlimited bandwidth. Includes advanced DDoS protection and 99.9% uptime guarantee.",
    price: 49.99,
    images: ["/images/products/vps-premium.jpg"],
    category: "VPS Servers",
    featured: true,
    inStock: true,
    stockQuantity: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "23",
    name: "VPS Business",
    description: "Business-grade virtual server with 12 CPU cores, 32GB RAM, and 800GB high-speed SSD storage. Package includes 24/7 technical support, daily backups, and advanced protection against attacks.",
    price: 89.99,
    originalPrice: 99.99,
    images: ["/images/products/vps-business.jpg"],
    category: "VPS Servers",
    featured: true,
    inStock: true,
    stockQuantity: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "24",
    name: "VPS Enterprise",
    description: "Most powerful virtual server with 16 CPU cores, 64GB RAM, and 1.5TB NVMe storage. Includes unlimited bandwidth, free SSL certificates, global content distribution via CDN, with 99.99% uptime guarantee.",
    price: 149.99,
    images: ["/images/products/vps-enterprise.jpg"],
    category: "VPS Servers",
    featured: false,
    inStock: true,
    stockQuantity: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "27",
    name: "MacBook Pro M3 Max",
    description: "Apple's most powerful laptop with M3 Max chip featuring 16-core CPU and 40-core GPU, 16-inch Liquid Retina XDR display, 64GB unified memory, and 2TB SSD storage. Perfect for developers and cybersecurity specialists.",
    price: 3499.99,
    originalPrice: 3699.99,
    images: ["/images/products/macbook-pro-m3-max.jpg"],
    category: "Laptops",
    featured: true,
    inStock: true,
    stockQuantity: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "28",
    name: "MacBook Pro M3 Pro",
    description: "Apple's premium laptop with M3 Pro chip featuring 12-core CPU and 18-core GPU, 14-inch Liquid Retina XDR display, 32GB unified memory, and 1TB SSD storage.",
    price: 2499.99,
    images: ["/images/products/macbook-pro-m3-pro.jpg"],
    category: "Laptops",
    featured: false,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "29",
    name: "MacBook Air M3",
    description: "Apple's lightest and thinnest laptop with powerful M3 chip, 13.6-inch Liquid Retina display, 16GB unified memory, and 512GB SSD storage. Features a slim design with up to 18 hours of battery life.",
    price: 1299.99,
    originalPrice: 1399.99,
    images: ["/images/products/macbook-air-m3.jpg"],
    category: "Laptops",
    featured: false,
    inStock: true,
    stockQuantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "30",
    name: "ThinkPad X1 Extreme",
    description: "Laptop specialized for cybersecurity with 13th Gen Intel Core i9 processor, NVIDIA RTX 4070 graphics, 32GB upgradable RAM, and 1TB SSD. Comes with dual-boot Windows/Linux operating system.",
    price: 2499.99,
    originalPrice: 2799.99,
    images: ["/images/products/thinkpad-x1-extreme.jpg"],
    category: "Laptops",
    featured: true,
    inStock: true,
    stockQuantity: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "31",
    name: "Dell XPS 17",
    description: "Powerful developer laptop with 17-inch 4K display, Intel Core i9 processor, NVIDIA RTX 4080 graphics, 64GB RAM, and 2TB SSD. Perfect for advanced development and penetration testing.",
    price: 2799.99,
    images: ["/images/products/dell-xps-17.jpg"],
    category: "Laptops",
    featured: false,
    inStock: true,
    stockQuantity: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "32",
    name: "MSI Titan GT77",
    description: "The most powerful laptop for gaming and cybersecurity tasks with Intel Core i9 HX processor, NVIDIA RTX 4090 graphics, 128GB RAM, and 4TB SSD. Advanced cooling system and 4K display with 144Hz refresh rate.",
    price: 3999.99,
    originalPrice: 4299.99,
    images: ["/images/products/msi-titan-gt77.jpg"],
    category: "Laptops",
    featured: true,
    inStock: true,
    stockQuantity: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "33",
    name: "Razer Blade 17",
    description: "Elegant laptop for developers and penetration testers with Intel Core i7 processor, NVIDIA RTX 4070 graphics, 32GB RAM, and 1TB SSD. Features a sleek metal design and QHD display with 240Hz refresh rate.",
    price: 2399.99,
    images: ["/images/products/razer-blade-17.jpg"],
    category: "Laptops",
    featured: false,
    inStock: true,
    stockQuantity: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "34",
    name: "ASUS ROG Zephyrus",
    description: "Lightweight and powerful developer laptop with AMD Ryzen 9 processor, NVIDIA RTX 4060 graphics, 16GB RAM, and 1TB SSD. Perfect for mobile use with high processing power.",
    price: 1899.99,
    originalPrice: 1999.99,
    images: ["/images/products/asus-rog-zephyrus.jpg"],
    category: "Laptops",
    featured: false,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "35",
    name: "WormGPT Premium",
    description: "Advanced language model without ethical restrictions, designed for security researchers. Features advanced capabilities for malware creation, protection mechanism bypass, and advanced attack simulation. 6-month subscription with 24/7 technical support.",
    price: 999.99,
    images: ["/images/products/wormgpt-premium.jpg"],
    category: "AI Models",
    featured: true,
    inStock: true,
    stockQuantity: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "36",
    name: "WormGPT Enterprise",
    description: "Professional version of WormGPT with unlimited capabilities and integration with penetration testing tools. Features exceptional accuracy in generating advanced code, creating complex attack scenarios, and simulating attacker behavior. Annual subscription with customized training.",
    price: 2499.99,
    originalPrice: 2999.99,
    images: ["/images/products/wormgpt-enterprise.jpg"],
    category: "AI Models",
    featured: true,
    inStock: true,
    stockQuantity: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "37",
    name: "DARK-V3 AI Standard",
    description: "Advanced AI model that exceeds the limits of traditional language models. Designed for security researchers to test vulnerabilities and identify weaknesses in protection systems. Includes an advanced API and high-level code generation capabilities.",
    price: 799.99,
    images: ["/images/products/dark-v3-standard.jpg"],
    category: "AI Models",
    featured: false,
    inStock: true,
    stockQuantity: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "38",
    name: "DARK-V3 AI Professional",
    description: "Professional version of DARK-V3 with enhanced capabilities in network analysis, vulnerability detection, and generating realistic attack scenarios. Features an API integrated with common security tools and a one-year subscription with continuous updates.",
    price: 1299.99,
    originalPrice: 1499.99,
    images: ["/images/products/dark-v3-professional.jpg"],
    category: "AI Models",
    featured: false,
    inStock: true,
    stockQuantity: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "39",
    name: "FalconGPT Unlimited",
    description: "New AI model specifically designed for ethical penetration testers. Exceeds WormGPT in specific areas such as source code analysis, code vulnerability detection, and suggesting exploitation methods. Unlimited subscription with monthly updates.",
    price: 1999.99,
    images: ["/images/products/falcongpt-unlimited.jpg"],
    category: "AI Models",
    featured: true,
    inStock: true,
    stockQuantity: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "40",
    name: "Kali Linux Hardware Kit",
    description: "Comprehensive set of hardware dedicated to penetration testing with pre-installed Kali Linux. Includes WiFi Pineapple, Alpha Card, HackRF One, and other specialized devices for field testing. Perfect for cybersecurity professionals.",
    price: 799.99,
    images: ["/images/products/kali-kit.jpg"],
    category: "Misc",
    featured: true,
    inStock: true,
    stockQuantity: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "41",
    name: "Proxmark3 RDV4",
    description: "Advanced device for reading, writing, and cloning RFID and NFC cards. Supports a wide range of frequencies and protocols, and comes with open-source software for analysis and testing. Essential tool for cybersecurity professionals and physical penetration testing.",
    price: 399.99,
    originalPrice: 449.99,
    images: ["/images/products/proxmark3.jpg"],
    category: "Misc",
    featured: false,
    inStock: true,
    stockQuantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "42",
    name: "Flipper Zero",
    description: "Multi-purpose device for physical and digital security testing. Supports reading and analyzing radio signals, RFID cards, remote control devices, and connecting to devices via GPIO. Excellent educational tool for those interested in cybersecurity.",
    price: 169.99,
    images: ["/images/products/flipper-zero.jpg"],
    category: "Misc",
    featured: true,
    inStock: true,
    stockQuantity: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "43",
    name: "HackRF One",
    description: "Advanced radio signal receiver and transmitter covering a frequency range from 1MHz to 6GHz. Perfect for analyzing wireless protocols and testing security vulnerabilities in communication systems. Open-source and supports a wide range of software.",
    price: 299.99,
    images: ["/images/products/hackrf-one.jpg"],
    category: "Misc",
    featured: false,
    inStock: true,
    stockQuantity: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "44",
    name: "USB Rubber Ducky",
    description: "Penetration testing tool in the form of a USB flash drive capable of automatically simulating keystrokes at high speed. Programmed in a simple language to execute multiple scenarios for testing system security against human-level attacks.",
    price: 59.99,
    originalPrice: 79.99,
    images: ["/images/products/rubber-ducky.jpg"],
    category: "Misc",
    featured: false,
    inStock: true,
    stockQuantity: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // كورسات برمجة عالمية
  {
    id: "101",
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
    id: "102",
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
    id: "103",
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
    id: "104",
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
    id: "105",
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
    id: "106",
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
    id: "107",
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
    id: "108",
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
    id: "109",
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
    id: "110",
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
    const CURRENT_DATA_VERSION = "1.0.6"; // Increment this when making data changes
    const savedVersion = localStorage.getItem('creative_products_version');
    
    // If version mismatch, clear localStorage to force refresh
    if (savedVersion !== CURRENT_DATA_VERSION) {
      console.log('Data version mismatch. Clearing cached products.');
      localStorage.removeItem('creative_products');
      localStorage.setItem('creative_products_version', CURRENT_DATA_VERSION);
      
      // Force immediate reload to apply changes
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } else {
      // Only load from localStorage if version matches
      const savedProducts = localStorage.getItem('creative_products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          // دمج المنتجات الأصلية مع المحفوظة بدون حذف أي منتج أصلي
          const originalIds = new Set(products.map(p => p.id));
          const mergedProducts = [
            ...products,
            ...parsedProducts.filter(p => !originalIds.has(p.id))
          ];
          products = mergedProducts;
          localStorage.setItem('creative_products', JSON.stringify(products));
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
  console.log(`Getting products for category: ${category}`);
  console.log(`Total products: ${products.length}`);
  
  // Get all products with this category
  const categoryProducts = products.filter(product => product.category === category);
  
  console.log(`Found ${categoryProducts.length} products in category ${category}`);
  console.log('Category products IDs:', categoryProducts.map(p => p.id).join(', '));
  
  // Ensure all products for each category are included regardless of what's in Firebase
  // Define the IDs that should be present in each category
  const categoryDefaultIds: Record<string, string[]> = {
    "Laptops": ["27", "28", "29", "30", "31", "32", "33", "34"],
    "AI Models": ["35", "36", "37", "38", "39"],
    "Smartphones": ["5", "6", "7", "8", "9", "10", "11", "12"],
    "VPS Servers": ["21", "22", "23", "24"],
    "Misc": ["40", "41", "42", "43", "44"],
    "RAT Tools": ["1", "2", "3", "4"],
    "Courses": ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110"]
  };
  
  // If the category has default IDs defined
  if (categoryDefaultIds[category]) {
    // Get the IDs that should be in this category
    const defaultIds = categoryDefaultIds[category];
    
    // Find any missing products
    const existingIds = new Set(categoryProducts.map(p => p.id));
    const missingIds = defaultIds.filter(id => !existingIds.has(id));
    
    console.log(`Missing ${category} IDs:`, missingIds.join(', '));
    
    // If any products are missing, find them in the full products array
    if (missingIds.length > 0) {
      const missingProducts = products.filter(p => missingIds.includes(p.id));
      console.log(`Found ${missingProducts.length} missing products from full array`);
      
      // Return combined list
      return [...categoryProducts, ...missingProducts];
    }
  }
  
  // Special handling for Laptops category to ensure it shows all laptop products
  if (category === "Laptops") {
    // Get the initial array of laptops as defined in the code
    const originalLaptops = [
      { id: "27", name: "MacBook Pro M3 Max" },
      { id: "28", name: "MacBook Pro M3 Pro" },
      { id: "29", name: "MacBook Air M3" },
      { id: "30", name: "ThinkPad X1 Extreme" },
      { id: "31", name: "Dell XPS 17" },
      { id: "32", name: "MSI Titan GT77" },
      { id: "33", name: "Razer Blade 17" },
      { id: "34", name: "ASUS ROG Zephyrus" }
    ];
    
    // Find any missing laptops
    const existingIds = new Set(categoryProducts.map(p => p.id));
    const missingLaptopIds = originalLaptops
      .filter(laptop => !existingIds.has(laptop.id))
      .map(laptop => laptop.id);
    
    console.log('Missing laptop IDs:', missingLaptopIds.join(', '));
    
    // If any laptops are missing, fetch them directly from the original products array
    if (missingLaptopIds.length > 0) {
      // Use the default products array definition
      const defaultProductsArray = [
        // RAT Tools
        {
          id: "1",
          name: "DarkComet RAT",
          description: "A powerful remote access tool designed for educational and security testing purposes. Features an easy-to-use interface and multiple system control capabilities. Ideal for cybersecurity professionals learning how to protect systems from vulnerabilities.",
          price: 299.99,
          images: ["/images/products/rat-1.jpg"],
          category: "RAT Tools",
          featured: true,
          inStock: true,
          stockQuantity: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // ... other products
        
        // Laptops
        {
          id: "27",
          name: "MacBook Pro M3 Max",
          description: "Apple's most powerful laptop with M3 Max chip featuring 16-core CPU and 40-core GPU, 16-inch Liquid Retina XDR display, 64GB unified memory, and 2TB SSD storage. Perfect for developers and cybersecurity specialists.",
          price: 3499.99,
          originalPrice: 3699.99,
          images: ["/images/products/macbook-pro-m3-max.jpg"],
          category: "Laptops",
          featured: true,
          inStock: true,
          stockQuantity: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "28",
          name: "MacBook Pro M3 Pro",
          description: "Apple's premium laptop with M3 Pro chip featuring 12-core CPU and 18-core GPU, 14-inch Liquid Retina XDR display, 32GB unified memory, and 1TB SSD storage.",
          price: 2499.99,
          images: ["/images/products/macbook-pro-m3-pro.jpg"],
          category: "Laptops",
          featured: false,
          inStock: true,
          stockQuantity: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "29",
          name: "MacBook Air M3",
          description: "Apple's lightest and thinnest laptop with powerful M3 chip, 13.6-inch Liquid Retina display, 16GB unified memory, and 512GB SSD storage. Features a slim design with up to 18 hours of battery life.",
          price: 1299.99,
          originalPrice: 1399.99,
          images: ["/images/products/macbook-air-m3.jpg"],
          category: "Laptops",
          featured: false,
          inStock: true,
          stockQuantity: 20,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "30",
          name: "ThinkPad X1 Extreme",
          description: "Laptop specialized for cybersecurity with 13th Gen Intel Core i9 processor, NVIDIA RTX 4070 graphics, 32GB upgradable RAM, and 1TB SSD. Comes with dual-boot Windows/Linux operating system.",
          price: 2499.99,
          originalPrice: 2799.99,
          images: ["/images/products/thinkpad-x1-extreme.jpg"],
          category: "Laptops",
          featured: true,
          inStock: true,
          stockQuantity: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "31",
          name: "Dell XPS 17",
          description: "Powerful developer laptop with 17-inch 4K display, Intel Core i9 processor, NVIDIA RTX 4080 graphics, 64GB RAM, and 2TB SSD. Perfect for advanced development and penetration testing.",
          price: 2799.99,
          images: ["/images/products/dell-xps-17.jpg"],
          category: "Laptops",
          featured: false,
          inStock: true,
          stockQuantity: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "32",
          name: "MSI Titan GT77",
          description: "The most powerful laptop for gaming and cybersecurity tasks with Intel Core i9 HX processor, NVIDIA RTX 4090 graphics, 128GB RAM, and 4TB SSD. Advanced cooling system and 4K display with 144Hz refresh rate.",
          price: 3999.99,
          originalPrice: 4299.99,
          images: ["/images/products/msi-titan-gt77.jpg"],
          category: "Laptops",
          featured: true,
          inStock: true,
          stockQuantity: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "33",
          name: "Razer Blade 17",
          description: "Elegant laptop for developers and penetration testers with Intel Core i7 processor, NVIDIA RTX 4070 graphics, 32GB RAM, and 1TB SSD. Features a sleek metal design and QHD display with 240Hz refresh rate.",
          price: 2399.99,
          images: ["/images/products/razer-blade-17.jpg"],
          category: "Laptops",
          featured: false,
          inStock: true,
          stockQuantity: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "34",
          name: "ASUS ROG Zephyrus",
          description: "Lightweight and powerful developer laptop with AMD Ryzen 9 processor, NVIDIA RTX 4060 graphics, 16GB RAM, and 1TB SSD. Perfect for mobile use with high processing power.",
          price: 1899.99,
          originalPrice: 1999.99,
          images: ["/images/products/asus-rog-zephyrus.jpg"],
          category: "Laptops",
          featured: false,
          inStock: true,
          stockQuantity: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      // Find the missing laptops from the default array
      const missingLaptops = defaultProductsArray.filter(p => 
        missingLaptopIds.includes(p.id) && p.category === "Laptops"
      );
      
      console.log(`Found ${missingLaptops.length} missing laptops in default array`);
      
      // Add the missing laptops to the result
      return [...categoryProducts, ...missingLaptops];
    }
  }
  
  return categoryProducts;
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
    
    // Check if there was a significant change that requires version update
    const hasSignificantChange = 
      updatedData.name !== currentProduct.name || 
      updatedData.price !== currentProduct.price || 
      updatedData.description !== currentProduct.description ||
      updatedData.category !== currentProduct.category ||
      (updatedData.images && JSON.stringify(updatedData.images) !== JSON.stringify(currentProduct.images));
    
    // Update the product in the array
    products[index] = updatedProduct;
    
    // Save to localStorage for local persistence with updated version
    try {
      localStorage.setItem('creative_products', JSON.stringify(products));
      
      // Only update version if there was a significant change
      if (hasSignificantChange) {
        // Get current version or use default
        const currentVersion = localStorage.getItem('creative_products_version') || "1.0.0";
        const versionParts = currentVersion.split('.');
        const newMinorVersion = parseInt(versionParts[2] || "0") + 1;
        const newVersion = `${versionParts[0]}.${versionParts[1]}.${newMinorVersion}`;
        localStorage.setItem('creative_products_version', newVersion);
        console.log(`Updated version to ${newVersion} due to significant product change`);
      }
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
    
    // Save to Firebase for online persistence
    saveProduct(updatedProduct)
      .then(success => {
        if (success) {
          console.log('Product successfully saved to Firebase');
          // Only force full resync for significant changes
          if (hasSignificantChange) {
            forceResyncProductsToFirebase()
              .then(() => console.log('Full product list resynced to Firebase'))
              .catch(error => console.error('Error resyncing products:', error));
          }
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
  // Default courses data for IDs 101-110
  const defaultCourses = products.filter(p => p.id >= "101" && p.id <= "110");
  
  // Update localStorage with default courses
  try {
    // Get existing products from localStorage
    const savedProductsStr = localStorage.getItem('creative_products');
    if (savedProductsStr) {
      let savedProducts: Product[] = JSON.parse(savedProductsStr);
      
      // Replace courses in saved products
      savedProducts = savedProducts.map((p: Product) => {
        if (p.id >= "101" && p.id <= "110") {
          // Find the default course with the same ID
          const defaultCourse = defaultCourses.find(d => d.id === p.id);
          return defaultCourse || p;
        }
        return p;
      });
      
      // Save updated products back to localStorage
      localStorage.setItem('creative_products', JSON.stringify(savedProducts));
      localStorage.setItem('creative_products_version', "1.0.3");
      
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
        // Replace all products with Firebase data - don't filter categories
        products = [...firebaseProducts];
        
        // Only update localStorage with products, don't increment version unless a specific flag is set
        localStorage.setItem('creative_products', JSON.stringify(products));
        
        // Only set version if not already set to avoid unnecessary updates
        if (!localStorage.getItem('creative_products_version')) {
          localStorage.setItem('creative_products_version', "1.0.0");
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase products:', error);
    return false;
  }
} 