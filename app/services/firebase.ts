// استيراد الدوال التي تحتاج إليها من Firebase SDK
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator, setPersistence, browserSessionPersistence } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
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

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
// Analytics is browser-only
let analytics: Analytics | null = null;

// Initialize Firebase
app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Setup improved auth persistence for better reliability
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Firebase auth persistence error:", error);
  });

// Network status monitoring
let isNetworkOnline = true;

// Function to monitor network status
const monitorNetworkStatus = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      isNetworkOnline = true;
      enableNetwork(db).catch(console.error);
      console.log('Firebase connection restored');
    });
    
    window.addEventListener('offline', () => {
      isNetworkOnline = false;
      console.log('Firebase connection lost - device offline');
    });
  }
};

// Setup network monitoring for Firestore
monitorNetworkStatus();

// Initialize browser-only services
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Function to check network status
export const isOnline = () => isNetworkOnline;

// Function to force reconnect to Firebase
export const reconnectToFirebase = async () => {
  try {
    await disableNetwork(db);
    await enableNetwork(db);
    console.log('Firebase connection reestablished');
    return true;
  } catch (error) {
    console.error('Error reconnecting to Firebase:', error);
    return false;
  }
};

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
  isInitialized: isFirebaseInitialized,
  isOnline,
  reconnectToFirebase
}; 