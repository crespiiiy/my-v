import React, { useState, useEffect } from 'react';
import { products, initializeFirebaseProducts } from '../../models/product';
import { saveAllProducts } from '../../services/productService';
import { forceResyncProductsToFirebase } from '../../services/productSync';
import LoadingIndicator from '../../components/LoadingIndicator';

export default function SyncProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // On component mount, check when was the last time products were synced
  useEffect(() => {
    const lastSync = localStorage.getItem('last_products_sync_time');
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, []);

  // Save sync time to localStorage
  const updateSyncTime = () => {
    const now = new Date().toLocaleString();
    localStorage.setItem('last_products_sync_time', now);
    setLastSyncTime(now);
  };

  const handleSyncToFirebase = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // First ensure we have the latest products from Firebase
      await initializeFirebaseProducts();
      
      // Then push all current products back to Firebase
      const success = await forceResyncProductsToFirebase();
      
      if (success) {
        updateSyncTime();
        setMessage({
          text: "تم مزامنة المنتجات مع Firebase بنجاح!",
          type: "success"
        });
        
        // Force a version change to trigger refresh, but only once
        const currentVersion = localStorage.getItem('creative_products_version') || "1.0.0";
        const versionParts = currentVersion.split('.');
        // Create a large jump in version to signal an admin sync
        const newMinorVersion = parseInt(versionParts[2] || "0") + 10;
        const newVersion = `${versionParts[0]}.${versionParts[1]}.${newMinorVersion}`;
        localStorage.setItem('creative_products_version', newVersion);
        
        // No automatic reload - let the admin trigger a reload manually if needed
      } else {
        setMessage({
          text: "فشلت مزامنة المنتجات مع Firebase!",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error syncing products to Firebase:", error);
      setMessage({
        text: `حدث خطأ أثناء المزامنة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromFirebase = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const success = await initializeFirebaseProducts();
      
      if (success) {
        updateSyncTime();
        // Force a version change to trigger refresh in other tabs, but only once
        const currentVersion = localStorage.getItem('creative_products_version') || "1.0.0";
        const versionParts = currentVersion.split('.');
        // Create a large jump in version to signal an admin sync
        const newMinorVersion = parseInt(versionParts[2] || "0") + 10;
        const newVersion = `${versionParts[0]}.${versionParts[1]}.${newMinorVersion}`;
        localStorage.setItem('creative_products_version', newVersion);
        
        setMessage({
          text: "تم تحديث المنتجات المحلية من Firebase بنجاح!",
          type: "success"
        });
      } else {
        setMessage({
          text: "فشل تحديث المنتجات المحلية من Firebase!",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error syncing products from Firebase:", error);
      setMessage({
        text: `حدث خطأ أثناء المزامنة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLocalStorage = () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Clear all product data from localStorage to allow defaults to load
      localStorage.removeItem('creative_products');
      localStorage.removeItem('creative_products_version');
      localStorage.removeItem('last_products_sync_time');
      localStorage.removeItem('last_firebase_sync_time');
      
      setMessage({
        text: "تم إعادة تعيين البيانات المحلية بنجاح!",
        type: "success"
      });
      
      // Force page reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error resetting data:", error);
      setMessage({
        text: `حدث خطأ أثناء إعادة التعيين: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        type: "error"
      });
      setIsLoading(false);
    }
  };

  // Add a manual refresh button
  const handleManualRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">مزامنة المنتجات</h1>
        <p className="text-gray-300 mb-6">
          استخدم هذه الصفحة لإدارة مزامنة المنتجات بين التخزين المحلي وقاعدة بيانات Firebase.
          {lastSyncTime && (
            <span className="block mt-2 text-sm text-gray-400">
              آخر مزامنة: {lastSyncTime}
            </span>
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleSyncToFirebase}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            مزامنة المنتجات مع Firebase
          </button>
          
          <button
            onClick={handleSyncFromFirebase}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تحديث من Firebase
          </button>
          
          <button
            onClick={handleResetLocalStorage}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إعادة تعيين البيانات المحلية
          </button>
        </div>
        
        <div className="mb-8">
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            تحديث الصفحة يدوياً بعد المزامنة
          </button>
        </div>
        
        {message && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"
            }`}
          >
            {message.text}
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-8">
            <LoadingIndicator message="جاري المزامنة..." />
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-700 rounded-md">
          <h2 className="text-xl font-semibold mb-4">معلومات حول المزامنة</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <strong>مزامنة مع Firebase:</strong> يقوم بحفظ جميع المنتجات الحالية إلى Firebase، مما يجعلها متاحة لجميع المستخدمين.
            </li>
            <li>
              <strong>تحديث من Firebase:</strong> يقوم بتحميل أحدث بيانات المنتجات من Firebase، مما يضمن أن لديك أحدث تغييرات من المشرفين الآخرين.
            </li>
            <li>
              <strong>إعادة تعيين البيانات المحلية:</strong> يمسح المنتجات المخزنة محليًا ويعيد تحميل البيانات من Firebase، مفيد في حالة مواجهة مشاكل.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">معلومات المنتجات</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-md">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-4 py-2 text-left">الإحصائية</th>
                <th className="px-4 py-2 text-left">القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-2">إجمالي عدد المنتجات</td>
                <td className="px-4 py-2">{products.length}</td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="px-4 py-2">عدد المنتجات المميزة</td>
                <td className="px-4 py-2">{products.filter(p => p.featured).length}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">الفئات</td>
                <td className="px-4 py-2">
                  {Array.from(new Set(products.map(p => p.category))).join(', ')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 