import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminTools from '../../components/admin/AdminTools';

export function meta() {
  return [
    { title: 'إعدادات المسؤول - كرييتيف' },
    { name: 'description', content: 'صفحة إعدادات المسؤول لمتجر كرييتيف' },
  ];
}

export default function AdminSettings() {
  const { isAdmin, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  
  // التحقق من أن المستخدم مسؤول
  useEffect(() => {
    if (!loading && (!isLoggedIn || !isAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, isLoggedIn, loading, navigate]);
  
  // عرض رسالة تحميل أثناء التحقق من حالة المستخدم
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // إذا لم يكن المستخدم مسؤولًا، لا نعرض شيئًا (سيتم توجيهه بواسطة useEffect)
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">إعدادات المسؤول</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <AdminTools />
        </div>
      </div>
    </div>
  );
} 