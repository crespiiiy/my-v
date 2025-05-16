import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forceResyncProductsToFirebase, resetLocalStorage } from '../../services/productSync';

export default function SyncProducts() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    try {
      setSyncStatus('syncing');
      setMessage('جاري مزامنة المنتجات مع Firebase...');
      
      const success = await forceResyncProductsToFirebase();
      
      if (success) {
        setSyncStatus('success');
        setMessage('تمت مزامنة المنتجات بنجاح! قد تحتاج إلى إعادة تحميل الصفحة لرؤية التغييرات.');
      } else {
        setSyncStatus('error');
        setMessage('حدث خطأ أثناء مزامنة المنتجات. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setSyncStatus('error');
      setMessage(`حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  const handleReset = async () => {
    if (window.confirm('هل أنت متأكد أنك تريد مسح التخزين المحلي وإعادة تحميل البيانات من Firebase؟')) {
      try {
        setResetStatus('resetting');
        setMessage('جاري إعادة ضبط التخزين المحلي...');
        
        await resetLocalStorage();
        // هذا لن ينفذ لأن الصفحة ستعاد تحميلها، ولكن نضعه للاكتمال
        setResetStatus('success');
      } catch (error) {
        setResetStatus('error');
        setMessage(`حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center">
        <Link
          to="/admin"
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold">مزامنة المنتجات</h1>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">مزامنة المنتجات مع Firebase</h2>
          <p className="text-gray-400 mb-4">
            استخدم هذا الخيار لإعادة مزامنة جميع المنتجات الحالية مع Firebase. هذا مفيد إذا قمت بتغييرات على المنتجات وتريد التأكد من أنها محفوظة بشكل صحيح.
          </p>
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className={`px-4 py-2 rounded-md ${
              syncStatus === 'syncing' ? 'bg-gray-600 cursor-not-allowed' : 
              syncStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 
              syncStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : 
              'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {syncStatus === 'syncing' ? 'جاري المزامنة...' : 
             syncStatus === 'success' ? 'تمت المزامنة بنجاح' : 
             syncStatus === 'error' ? 'إعادة المحاولة' : 
             'مزامنة المنتجات'}
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-amber-400">إعادة ضبط التخزين المحلي</h2>
          <p className="text-gray-400 mb-2">
            استخدم هذا الخيار لمسح التخزين المحلي وإعادة تحميل البيانات من Firebase. هذا مفيد في حالة وجود اختلافات بين البيانات المحلية وبيانات Firebase.
          </p>
          <p className="text-amber-400 mb-4 text-sm">
            تحذير: سيؤدي هذا إلى إعادة تحميل الصفحة وقد تفقد أي تغييرات غير محفوظة.
          </p>
          <button
            onClick={handleReset}
            disabled={resetStatus === 'resetting'}
            className={`px-4 py-2 rounded-md ${
              resetStatus === 'resetting' ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'
            } transition-colors`}
          >
            {resetStatus === 'resetting' ? 'جاري إعادة الضبط...' : 'إعادة ضبط التخزين المحلي'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          syncStatus === 'success' || resetStatus === 'success' ? 'bg-green-900 text-green-200' : 
          syncStatus === 'error' || resetStatus === 'error' ? 'bg-red-900 text-red-200' : 
          'bg-blue-900 text-blue-200'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">حل مشاكل المزامنة</h2>
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="text-lg font-medium mb-1">المشكلة: التغييرات لا تظهر للمستخدمين الآخرين</h3>
            <p className="text-gray-400">
              الحل: اضغط على "مزامنة المنتجات" للتأكد من أن التغييرات محفوظة في Firebase.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">المشكلة: القيم القديمة تظهر على موقعك</h3>
            <p className="text-gray-400">
              الحل: استخدم "إعادة ضبط التخزين المحلي" لمسح القيم المخزنة محليًا وإعادة تحميلها من Firebase.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">المشكلة: مشاكل عامة في المزامنة</h3>
            <p className="text-gray-400">
              الحل: قم بتسجيل الخروج وإعادة تسجيل الدخول، أو قم بمسح ذاكرة التخزين المؤقت للمتصفح.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 