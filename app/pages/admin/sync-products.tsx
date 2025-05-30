import React, { useState } from 'react';
import { products, initializeFirebaseProducts, resetCoursesToDefault } from '../../models/product';
import { saveAllProducts } from '../../services/productService';
import LoadingIndicator from '../../components/LoadingIndicator';

export default function SyncProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSyncToFirebase = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const success = await saveAllProducts(products);
      
      if (success) {
        setMessage({
          text: "تم مزامنة المنتجات مع Firebase بنجاح!",
          type: "success"
        });
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
      
      // Force page reload to get fresh data from code
      window.location.reload();
      
      setMessage({
        text: "تم إعادة تعيين البيانات المحلية بنجاح!",
        type: "success"
      });
    } catch (error) {
      console.error("Error resetting data:", error);
      setMessage({
        text: `حدث خطأ أثناء إعادة التعيين: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        type: "error"
      });
      setIsLoading(false);
    }
  };

  const handleResetCourses = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const success = await resetCoursesToDefault();
      
      if (success) {
        setMessage({
          text: "تم إعادة تعيين الكورسات إلى الحالة الافتراضية بنجاح!",
          type: "success"
        });
        
        // Reload page after a short delay to refresh data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({
          text: "فشلت عملية إعادة تعيين الكورسات!",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error resetting courses:", error);
      setMessage({
        text: `حدث خطأ أثناء إعادة تعيين الكورسات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">إدارة مزامنة المنتجات</h1>
      
      {message && (
        <div 
          className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">خيارات المزامنة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">مزامنة إلى Firebase</h3>
            <p className="text-gray-300 mb-4">
              تحديث قاعدة بيانات Firebase بالمنتجات المحلية الحالية.
              استخدم هذا الخيار بعد إجراء تغييرات محلية ترغب في نشرها لجميع المستخدمين.
            </p>
            <button
              onClick={handleSyncToFirebase}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? <LoadingIndicator size="sm" /> : "مزامنة المنتجات إلى Firebase"}
            </button>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">مزامنة من Firebase</h3>
            <p className="text-gray-300 mb-4">
              تحديث المنتجات المحلية بالبيانات من Firebase.
              استخدم هذا الخيار إذا قام مسؤول آخر بإجراء تغييرات وتريد الحصول على أحدث البيانات.
            </p>
            <button
              onClick={handleSyncFromFirebase}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? <LoadingIndicator size="sm" /> : "تحديث المنتجات من Firebase"}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">إعادة تعيين البيانات المحلية</h3>
            <p className="text-gray-300 mb-4">
              إعادة تعيين البيانات المحلية إلى الحالة الافتراضية المحددة في الكود.
              استخدم هذا الخيار إذا كنت تريد التأكد من تحميل أحدث تغييرات الكود.
            </p>
            <button
              onClick={handleResetLocalStorage}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? <LoadingIndicator size="sm" /> : "إعادة تعيين البيانات المحلية"}
            </button>
          </div>
          
          <div className="bg-yellow-900 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-2">إعادة تعيين الكورسات فقط</h3>
            <p className="text-gray-300 mb-4">
              إعادة تعيين الكورسات (المنتجات 13-20) إلى البيانات المحددة في الكود مع الاحتفاظ بالمنتجات الأخرى.
              استخدم هذا لتطبيق تحديثات الكورسات الجديدة.
            </p>
            <button
              onClick={handleResetCourses}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? <LoadingIndicator size="sm" /> : "إعادة تعيين الكورسات فقط"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">المنتجات الحالية ({products.length})</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  المعرف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  السعر
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className={`${product.category === "Courses" ? "bg-gray-850" : ""} ${
                    product.id >= "13" && product.id <= "20" ? "border-l-4 border-yellow-600" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${product.price.toFixed(2)}
                    {product.originalPrice && (
                      <span className="ml-2 text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 