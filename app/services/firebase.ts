// استيراد الدوال التي تحتاج إليها من Firebase SDK
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// إعدادات Firebase الخاصة بتطبيقك
const firebaseConfig = {
  apiKey: "AIzaSyBrj7gRow8DjsIaNepNMnQu34DkYD0LuUs", // مفتاح API الخاص بك
  authDomain: "creative-store-website.firebaseapp.com", // نطاق المصادقة
  projectId: "creative-store-website", // معرف المشروع
  storageBucket: "creative-store-website.firebasestorage.app", // سعة التخزين
  messagingSenderId: "156795057875", // معرف مرسل الرسائل
  appId: "1:156795057875:web:f39464155f5e00a8804626", // معرف تطبيق Firebase
  measurementId: "G-Q1B825VYVE" // معرف القياس (اختياري)
};

// Initialize Firebase only on client side
let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Check if we're in a browser environment to avoid SSR issues
if (typeof window !== 'undefined') {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics
  analytics = getAnalytics(app);
  
  // Initialize Auth
  auth = getAuth(app);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Storage
  storage = getStorage(app);
}

export { app, analytics, auth, db, storage };

// Export a function to check if Firebase is initialized
export const isFirebaseInitialized = () => {
  return !!app;
};

// Export a default object with all Firebase services
export default {
  app,
  analytics,
  auth,
  db,
  storage,
  isInitialized: isFirebaseInitialized
}; 