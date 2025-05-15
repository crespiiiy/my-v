import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminTools from '../../components/admin/AdminTools';
import { getHomepageSettings, updateHomepageSettings } from '../../models/settings';
import ImageUploader from '../../components/ImageUploader';

export function meta() {
  return [
    { title: 'إعدادات المسؤول - كرييتيف' },
    { name: 'description', content: 'صفحة إعدادات المسؤول لمتجر كرييتيف' },
  ];
}

export default function AdminSettings() {
  const { isAdmin, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>({
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // التحقق من أن المستخدم مسؤول
  useEffect(() => {
    if (!loading && (!isLoggedIn || !isAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, isLoggedIn, loading, navigate]);
  
  useEffect(() => {
    // Load initial settings
    const currentSettings = getHomepageSettings();
    setSettings(currentSettings);
  }, []);
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setSettings(prev => ({
      ...prev,
      hero_image_url: imageUrl
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Save settings to your backend/storage
      updateHomepageSettings(settings);
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Homepage Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">Hero Title</label>
          <input
            type="text"
            name="hero_title"
            value={settings.hero_title}
            onChange={handleInputChange}
            placeholder="Premium Tools for Creative Professionals"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">Hero Subtitle</label>
          <textarea
            name="hero_subtitle"
            value={settings.hero_subtitle}
            onChange={handleInputChange}
            placeholder="Discover our collection of high-quality products..."
            rows={3}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        
        <div className="mb-6">
          <ImageUploader 
            initialImageUrl={settings.hero_image_url}
            onImageChange={handleImageChange}
          />
          <p className="text-xs text-gray-400 mt-1">
            Recommended size: 800x600px (4:3 ratio)
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          
          {saveMessage && (
            <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
} 