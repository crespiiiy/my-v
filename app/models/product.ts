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
    name: "DarkComet RAT",
    description: "أداة قوية للتحكم عن بعد مصممة لأغراض تعليمية واختبار الأمان. تتميز بواجهة سهلة الاستخدام وقدرات متعددة للتحكم في الأنظمة. مثالية للمختصين في الأمن السيبراني الراغبين في تعلم كيفية حماية الأنظمة من الثغرات.",
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
    description: "برنامج مفتوح المصدر للتحكم عن بعد بهدف التعلم واختبار الأنظمة. يتميز بخفة الوزن وسهولة الاستخدام وقدرات متقدمة في مراقبة النظام. مناسب للمهتمين بفهم آليات الحماية وتحديد الثغرات الأمنية.",
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
    description: "أداة تعليمية متقدمة للتحكم عن بعد مع واجهة بسيطة تتيح للباحثين الأمنيين فهم آليات عمل أدوات الاختراق. تتضمن ميزات متعددة مثل مدير الملفات، مراقبة الشاشة، وتسجيل المفاتيح لأغراض الاختبار.",
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
    description: "تطبيق متطور للتحكم عن بعد مع تشفير اتصال قوي وخيارات تخصيص متقدمة. يوفر للباحثين الأمنيين أداة فعالة لاختبار الأنظمة والشبكات ضد هجمات التحكم عن بعد.",
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
    description: "أحدث هواتف آبل مع شريحة A17 Pro، وكاميرا احترافية بدقة 48 ميجابكسل، وقدرات فائقة للتصوير. يأتي الجهاز بتصميم من التيتانيوم مع شاشة 6.7 بوصة بتقنية ProMotion وإضاءة تصل إلى 2000 شمعة.",
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
    description: "هاتف آبل المتطور مع شريحة A17 Pro، وتصميم من التيتانيوم، وكاميرا 48 ميجابكسل مع إمكانيات تصوير متطورة. شاشة 6.1 بوصة بتقنية ProMotion مع عمر بطارية يدوم طوال اليوم.",
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
    description: "هاتف آبل الجديد مع شريحة A16 Bionic، وكاميرا 48 ميجابكسل، وتصميم متطور من الألومنيوم. يتميز بشاشة 6.1 بوصة مع ميزة Dynamic Island وعمر بطارية ممتاز.",
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
    description: "نسخة أكبر من آيفون 15 مع شاشة 6.7 بوصة وبطارية ذات عمر أطول. يتميز بشريحة A16 Bionic وكاميرا 48 ميجابكسل مع تحسينات في التصوير الليلي وميزة Dynamic Island.",
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
    description: "أحدث هواتف سامسونج مع معالج Snapdragon 8 Gen 3، وكاميرا رباعية بدقة 200 ميجابكسل، و12 جيجابايت رام، وقلم S Pen المدمج. يتميز بتقنيات الذكاء الاصطناعي المتقدمة وشاشة Dynamic AMOLED 2X بدقة QHD+.",
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
    description: "هاتف سامسونج المتميز مع شاشة Dynamic AMOLED 2X بحجم 6.7 بوصة، ومعالج Snapdragon 8 Gen 3، مع 12 جيجابايت رام و256 جيجابايت تخزين. مزود بتقنيات الذكاء الاصطناعي Galaxy AI.",
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
    description: "أحدث هواتف سامسونج الذكية مع شاشة 6.2 بوصة، ومعالج قوي، و8 جيجابايت رام، وكاميرا ثلاثية متطورة. يتميز بدعم تقنيات الذكاء الاصطناعي Galaxy AI وتصميم أنيق مقاوم للماء والغبار.",
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
    description: "هاتف سامسونج القابل للطي مع شاشة خارجية 6.2 بوصة وشاشة داخلية 7.6 بوصة. يأتي مع معالج Snapdragon 8 Gen 2، و12 جيجابايت رام، وكاميرا ثلاثية متطورة، ودعم قلم S Pen.",
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
    id: "13",
    name: "VPS Basic",
    description: "خادم افتراضي خاص بمواصفات أساسية مع 2 نواة وحدة معالجة مركزية، و4 جيجابايت ذاكرة وصول عشوائي، و80 جيجابايت تخزين SSD، ونطاق ترددي شهري 2 تيرابايت. مثالي للمواقع الصغيرة وبيئات التطوير.",
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
    id: "14",
    name: "VPS Premium",
    description: "خادم افتراضي خاص عالي الأداء مع 8 نواة وحدة معالجة مركزية، و16 جيجابايت ذاكرة وصول عشوائي، و500 جيجابايت تخزين SSD، ونطاق ترددي غير محدود. يتضمن حماية متقدمة من هجمات DDoS وضمان توفر بنسبة 99.9%.",
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
    id: "15",
    name: "VPS Business",
    description: "خادم افتراضي مخصص للشركات مع 12 نواة معالجة، و32 جيجابايت ذاكرة، و800 جيجابايت تخزين SSD فائق السرعة. يشمل الباقة دعم فني على مدار الساعة، ونسخ احتياطي يومي، وحماية متقدمة ضد الهجمات.",
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
    id: "16",
    name: "VPS Enterprise",
    description: "أقوى خادم افتراضي مع 16 نواة معالجة، و64 جيجابايت ذاكرة، و1.5 تيرابايت تخزين NVMe. يشمل نطاق ترددي غير محدود، وشهادات SSL مجانية، وتوزيع محتوى عالمي عبر CDN، مع ضمان توفر بنسبة 99.99%.",
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
    id: "17",
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
    id: "18",
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
    id: "19",
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
    id: "20",
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
    id: "21",
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
    id: "22",
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
    id: "23",
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
    id: "24",
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
    id: "25",
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
    id: "26",
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
  },
  {
    id: "27",
    name: "MacBook Pro M3 Max",
    description: "أقوى حاسوب محمول من آبل مع شريحة M3 Max ذات 16 نواة للمعالج و40 نواة للمعالج الرسومي، وشاشة Liquid Retina XDR مقاس 16 بوصة، و64 جيجابايت ذاكرة موحدة، و2 تيرابايت تخزين SSD. مثالي للمطورين ومتخصصي الأمن السيبراني.",
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
    description: "حاسوب آبل المحمول المتميز مع شريحة M3 Pro ذات 12 نواة للمعالج و18 نواة للمعالج الرسومي، وشاشة 14 بوصة بتقنية Liquid Retina XDR، و32 جيجابايت ذاكرة موحدة، و1 تيرابايت تخزين SSD.",
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
    description: "أخف وأنحف حاسوب من آبل مع شريحة M3 قوية، وشاشة Liquid Retina 13.6 بوصة، و16 جيجابايت ذاكرة موحدة، و512 جيجابايت تخزين SSD. يتميز بتصميم نحيف مع عمر بطارية يصل إلى 18 ساعة.",
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
    description: "حاسوب محمول مخصص للأمن السيبراني مع معالج Intel Core i9 من الجيل الثالث عشر، وبطاقة رسومية NVIDIA RTX 4070، و32 جيجابايت رام قابلة للترقية، و1 تيرابايت SSD. يأتي مع نظام تشغيل مزدوج Windows/Linux.",
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
    description: "حاسوب محمول قوي للمطورين مع شاشة 17 بوصة بدقة 4K، ومعالج Intel Core i9، وبطاقة رسومية NVIDIA RTX 4080، و64 جيجابايت رام، و2 تيرابايت SSD. مثالي للتطوير المتقدم واختبار الاختراق.",
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
    description: "أقوى حاسوب محمول للألعاب ومهام الأمن السيبراني مع معالج Intel Core i9 HX، وبطاقة رسومية NVIDIA RTX 4090، و128 جيجابايت رام، و4 تيرابايت SSD. نظام تبريد متطور وشاشة 4K بمعدل تحديث 144 هرتز.",
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
    description: "حاسوب محمول أنيق للمطورين ومختبري الاختراق مع معالج Intel Core i7، وبطاقة رسومية NVIDIA RTX 4070، و32 جيجابايت رام، و1 تيرابايت SSD. يتميز بتصميم معدني أنيق وشاشة QHD بمعدل تحديث 240 هرتز.",
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
    description: "حاسوب محمول خفيف الوزن وقوي للمطورين مع معالج AMD Ryzen 9، وبطاقة رسومية NVIDIA RTX 4060، و16 جيجابايت رام، و1 تيرابايت SSD. مثالي للاستخدام المتنقل مع قوة معالجة عالية.",
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
    description: "نموذج لغوي متطور بدون قيود أخلاقية، مصمم للباحثين الأمنيين. يتميز بقدرات متقدمة لإنشاء برمجيات خبيثة، وتجاوز آليات الحماية، وتنفيذ محاكاة هجمات متقدمة. اشتراك لمدة 6 أشهر مع دعم فني على مدار الساعة.",
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
    description: "النسخة الاحترافية من WormGPT مع قدرات غير محدودة وتكامل مع أدوات اختبار الاختراق. يتميز بدقة استثنائية في توليد الشيفرات البرمجية المتقدمة، وإنشاء سيناريوهات هجوم معقدة، ومحاكاة سلوك المهاجمين. اشتراك سنوي مع تدريب مخصص.",
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
    description: "نموذج ذكاء اصطناعي متقدم يتجاوز حدود نماذج اللغة التقليدية. مصمم للباحثين الأمنيين لاختبار الثغرات وتحديد نقاط الضعف في أنظمة الحماية. يتضمن واجهة برمجة متقدمة وقدرات عالية في توليد التعليمات البرمجية.",
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
    description: "النسخة الاحترافية من DARK-V3 مع قدرات محسنة في تحليل الشبكات، واكتشاف الثغرات، وتوليد سيناريوهات هجوم واقعية. يتميز بواجهة برمجة متكاملة مع أدوات الأمن الشائعة واشتراك لمدة عام مع تحديثات مستمرة.",
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
    description: "نموذج ذكاء اصطناعي جديد مصمم خصيصًا لمختبري الاختراق الأخلاقي. يتفوق على WormGPT في مجالات محددة مثل تحليل الشيفرات المصدرية، واكتشاف الثغرات البرمجية، واقتراح طرق استغلالها. اشتراك بلا حدود مع تحديثات شهرية.",
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
    description: "مجموعة متكاملة من الأجهزة المخصصة لاختبار الاختراق مع نظام Kali Linux مثبت مسبقًا. تشمل WiFi Pineapple، Alpha Card، HackRF One، وأجهزة متخصصة أخرى للاختبار الميداني. مثالية للمتخصصين في الأمن السيبراني.",
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
    description: "جهاز متطور لقراءة وكتابة ونسخ بطاقات RFID وNFC. يدعم نطاق واسع من الترددات والبروتوكولات، ويأتي مع برمجيات مفتوحة المصدر للتحليل والاختبار. أداة أساسية لمختصي الأمن السيبراني واختبار الاختراق المادي.",
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
    description: "جهاز متعدد الاستخدامات لاختبار الأمن المادي والرقمي. يدعم قراءة وتحليل إشارات الراديو، وبطاقات RFID، وأجهزة الريموت كونترول، والاتصال بالأجهزة عبر الـ GPIO. أداة تعليمية ممتازة للمهتمين بالأمن السيبراني.",
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
    description: "جهاز استقبال وإرسال إشارات راديو متقدم يغطي نطاق ترددي من 1 ميجاهرتز إلى 6 جيجاهرتز. مثالي لتحليل البروتوكولات اللاسلكية واختبار الثغرات الأمنية في أنظمة الاتصالات. مفتوح المصدر ويدعم مجموعة واسعة من البرمجيات.",
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
    description: "أداة اختبار اختراق على شكل فلاش USB قادرة على محاكاة ضغطات المفاتيح تلقائيًا بسرعة عالية. مبرمجة بلغة بسيطة لتنفيذ سيناريوهات متعددة لاختبار الحماية الأمنية للأنظمة ضد هجمات المستوى البشري.",
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
];

// Load products from localStorage if available (must run on client side)
try {
  if (typeof window !== 'undefined') {
    // Add a version check to force refresh on update
    const CURRENT_DATA_VERSION = "1.0.2"; // Increment this when making data changes
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
          // Make sure the courses (items 13-20) are up to date
          const updatedProducts = parsedProducts.map(p => {
            if (p.id >= "13" && p.id <= "20") {
              // Find the corresponding course in the default array
              const defaultCourse = products.find(dp => dp.id === p.id);
              return defaultCourse || p;
            }
            return p;
          });
          products = updatedProducts;
          
          // Update localStorage with the merged data
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
        // Merge with default courses (items 13-20)
        const updatedProducts = firebaseProducts.map(p => {
          if (p.id >= "13" && p.id <= "20") {
            // Find the corresponding course in the default array
            const defaultCourse = products.find(dp => dp.id === p.id);
            return defaultCourse || p;
          }
          return p;
        });
        
        // Update the products array with merged data
        products = updatedProducts;
        
        // Save updates back to Firebase to ensure courses are updated there too
        await saveAllProducts(products);
        
        // Also update localStorage
        localStorage.setItem('creative_products', JSON.stringify(products));
        localStorage.setItem('creative_products_version', "1.0.2");
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase products:', error);
    return false;
  }
} 