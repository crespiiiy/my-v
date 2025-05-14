import React, { useState } from 'react';
import { promoteUserToAdmin, createAdminUser } from '../../services/AuthService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

/**
 * مكون أدوات الإدارة للمسؤولين
 */
const AdminTools: React.FC = () => {
  // حالة إنشاء مسؤول جديد
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  // حالة ترقية مستخدم
  const [userIdToPromote, setUserIdToPromote] = useState('');
  const [userEmailToPromote, setUserEmailToPromote] = useState('');
  const [searchMethod, setSearchMethod] = useState<'id' | 'email'>('email');
  
  // حالة الرسائل
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // التعامل مع تغيير بيانات المسؤول الجديد
  const handleAdminDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
  };
  
  // إنشاء مسؤول جديد
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // التحقق من البيانات
      if (!newAdminData.email || !newAdminData.password || !newAdminData.firstName || !newAdminData.lastName) {
        throw new Error('جميع الحقول مطلوبة');
      }
      
      // التحقق من طول كلمة المرور
      if (newAdminData.password.length < 6) {
        throw new Error('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      }
      
      // إنشاء المستخدم الإداري مباشرة
      const adminUser = await createAdminUser(
        newAdminData.email,
        newAdminData.password,
        newAdminData.firstName,
        newAdminData.lastName
      );
      
      // عرض رسالة نجاح
      setMessage({ 
        text: `تم إنشاء المسؤول بنجاح: ${newAdminData.email}`, 
        type: 'success' 
      });
      
      // إعادة تعيين النموذج
      setNewAdminData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      console.error('خطأ في إنشاء مسؤول:', error);
      setMessage({ 
        text: `فشل في إنشاء المسؤول: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ترقية مستخدم موجود إلى مسؤول
  const handlePromoteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (searchMethod === 'id' && !userIdToPromote) {
        throw new Error('معرف المستخدم مطلوب');
      }
      
      if (searchMethod === 'email' && !userEmailToPromote) {
        throw new Error('البريد الإلكتروني للمستخدم مطلوب');
      }
      
      // إذا تم البحث بالبريد الإلكتروني، فابحث عن معرف المستخدم أولاً
      let userId = userIdToPromote;
      
      if (searchMethod === 'email') {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmailToPromote));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('لم يتم العثور على مستخدم بهذا البريد الإلكتروني');
        }
        
        userId = querySnapshot.docs[0].id;
      }
      
      // ترقية المستخدم
      await promoteUserToAdmin(userId);
      
      // عرض رسالة نجاح
      setMessage({ 
        text: `تمت ترقية المستخدم بنجاح ${searchMethod === 'email' ? userEmailToPromote : userId}`, 
        type: 'success' 
      });
      
      // إعادة تعيين النموذج
      setUserIdToPromote('');
      setUserEmailToPromote('');
    } catch (error) {
      console.error('خطأ في ترقية المستخدم:', error);
      setMessage({ 
        text: `فشل في ترقية المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">أدوات الإدارة</h2>
      
      {/* رسالة النجاح أو الخطأ */}
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* نموذج إنشاء مسؤول جديد */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">إنشاء حساب مسؤول جديد</h3>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                الاسم الأول
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={newAdminData.firstName}
                onChange={handleAdminDataChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                الاسم الأخير
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newAdminData.lastName}
                onChange={handleAdminDataChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newAdminData.email}
              onChange={handleAdminDataChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
              dir="ltr"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newAdminData.password}
              onChange={handleAdminDataChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
              minLength={6}
              dir="ltr"
            />
            <p className="text-xs text-gray-400 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء مسؤول جديد'}
          </button>
        </form>
      </div>
      
      <hr className="border-gray-600" />
      
      {/* نموذج ترقية مستخدم موجود */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">ترقية مستخدم موجود إلى مسؤول</h3>
        
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                name="searchMethod"
                checked={searchMethod === 'email'}
                onChange={() => setSearchMethod('email')}
                className="mr-2"
              />
              البحث بالبريد الإلكتروني
            </label>
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                name="searchMethod"
                checked={searchMethod === 'id'}
                onChange={() => setSearchMethod('id')}
                className="mr-2"
              />
              البحث بمعرف المستخدم
            </label>
          </div>
        </div>
        
        <form onSubmit={handlePromoteUser} className="space-y-4">
          {searchMethod === 'email' ? (
            <div>
              <label htmlFor="userEmailToPromote" className="block text-sm font-medium text-gray-300 mb-1">
                البريد الإلكتروني للمستخدم
              </label>
              <input
                type="email"
                id="userEmailToPromote"
                value={userEmailToPromote}
                onChange={(e) => setUserEmailToPromote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
                dir="ltr"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="userIdToPromote" className="block text-sm font-medium text-gray-300 mb-1">
                معرف المستخدم
              </label>
              <input
                type="text"
                id="userIdToPromote"
                value={userIdToPromote}
                onChange={(e) => setUserIdToPromote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
                dir="ltr"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'جاري الترقية...' : 'ترقية إلى مسؤول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminTools; 