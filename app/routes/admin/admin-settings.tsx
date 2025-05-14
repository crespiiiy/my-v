import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminTools from '../../components/admin/AdminTools';

export function meta() {
  return [
    { title: 'Admin Tools - Creative' },
    { name: 'description', content: 'Admin tools for Creative store' },
  ];
}

export default function AdminSettings() {
  const { isAdmin, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!loading && (!isLoggedIn || !isAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, isLoggedIn, loading, navigate]);
  
  // Show loading indicator while checking user status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // If user is not admin, don't render (they will be redirected by useEffect)
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Tools</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <AdminTools />
        </div>
      </div>
    </div>
  );
} 