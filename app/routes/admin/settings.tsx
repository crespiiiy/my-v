import { useState } from "react";
import type { Route } from "./+types/settings";
import { 
  getAllSettings, 
  getSettingsByCategory, 
  updateSetting 
} from "../../models/settings";
import type { StoreSetting } from "../../models/settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Creative Admin" },
    { name: "description", content: "Store settings" },
  ];
}

export default function Settings() {
  const [settings, setSettings] = useState<StoreSetting[]>(getAllSettings());
  const [activeTab, setActiveTab] = useState<StoreSetting['category']>("general");
  const [isUploading, setIsUploading] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  
  // Get settings for the active category
  const categorySettings = settings.filter(setting => setting.category === activeTab);
  
  // Handle setting value change
  const handleSettingChange = (key: string, value: string) => {
    const updatedSetting = updateSetting(key, value);
    if (updatedSetting) {
      setSettings(prevSettings => 
        prevSettings.map(s => s.key === key ? updatedSetting : s)
      );
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would submit these settings to an API
    setSavedMessage("Settings saved successfully!");
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);
  };
  
  // Handle file upload for images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, you would upload this file to a server
    // Here we're simulating the upload and generating a local URL
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create a fake URL (in a real app, this would be the URL from your server/CDN)
      const fakeUploadedUrl = URL.createObjectURL(file);
      
      // Update the setting with the new URL
      handleSettingChange(settingKey, fakeUploadedUrl);
      setIsUploading(false);
    }, 1500);
  };
  
  // Render different input types based on setting key
  const renderSettingInput = (setting: StoreSetting) => {
    // Check if this is an image setting
    const isImage = setting.key.includes('image') || setting.key.includes('logo') || setting.key.includes('favicon');
    
    if (isImage) {
      return (
        <div>
          <div className="flex items-center gap-4 mb-2">
            {setting.value && (
              <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                <img 
                  src={setting.value} 
                  alt={setting.key} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="text"
                value={setting.value}
                onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {isUploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => handleImageUpload(e, setting.key)}
              />
            </label>
          </div>
        </div>
      );
    }
    
    // Boolean settings (render as toggle)
    if (setting.value === "true" || setting.value === "false") {
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={setting.value === "true"}
            onChange={(e) => handleSettingChange(setting.key, e.target.checked ? "true" : "false")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      );
    }
    
    // For multiline text (like hero subtitle)
    if (setting.key.includes('subtitle') || setting.key.includes('description')) {
      return (
        <textarea
          value={setting.value}
          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        ></textarea>
      );
    }
    
    // Default to text input
    return (
      <input
        type="text"
        value={setting.value}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
      />
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Store Settings</h1>
      
      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
        {["general", "appearance", "payment", "shipping", "tax", "notification", "homepage"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category as StoreSetting['category'])}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === category
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Settings Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        {savedMessage && (
          <div className="bg-green-900/30 text-green-300 p-4 rounded-lg mb-6">
            {savedMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {categorySettings.map((setting) => (
              <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  {setting.isSystem && (
                    <span className="text-xs text-gray-500">System setting</span>
                  )}
                </div>
                <div className="md:col-span-2">
                  {renderSettingInput(setting)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 