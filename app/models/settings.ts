export interface StoreSetting {
  id: string;
  key: string;
  value: string;
  category: 'general' | 'appearance' | 'payment' | 'shipping' | 'tax' | 'notification' | 'homepage';
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sample store settings
export const storeSettings: StoreSetting[] = [
  // General Settings
  {
    id: "1",
    key: "store_name",
    value: "Creative",
    category: "general",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "2",
    key: "store_email",
    value: "info@creative.com",
    category: "general",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "3",
    key: "store_phone",
    value: "+20 1259493602",
    category: "general",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "4",
    key: "store_address",
    value: "Cairo, Egypt",
    category: "general",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Appearance Settings
  {
    id: "5",
    key: "primary_color",
    value: "#3B82F6", // Blue-600
    category: "appearance",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "6",
    key: "secondary_color",
    value: "#8B5CF6", // Purple-600
    category: "appearance",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "7",
    key: "logo_url",
    value: "/images/logo.svg",
    category: "appearance",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "8",
    key: "favicon_url",
    value: "/favicon.ico",
    category: "appearance",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Payment Settings
  {
    id: "9",
    key: "currency_code",
    value: "USD",
    category: "payment",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "10",
    key: "currency_symbol",
    value: "$",
    category: "payment",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "11",
    key: "payment_methods",
    value: "Credit Card,PayPal",
    category: "payment",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Shipping Settings
  {
    id: "12",
    key: "shipping_methods",
    value: "Standard,Express,Priority",
    category: "shipping",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "13",
    key: "shipping_rates",
    value: "Standard:10,Express:20,Priority:30",
    category: "shipping",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Tax Settings
  {
    id: "14",
    key: "tax_rate",
    value: "10",
    category: "tax",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Notification Settings
  {
    id: "15",
    key: "order_confirmation_email",
    value: "true",
    category: "notification",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "16",
    key: "shipping_confirmation_email",
    value: "true",
    category: "notification",
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  
  // Homepage Settings
  {
    id: "17",
    key: "hero_title",
    value: "Premium Tools for Creative Professionals",
    category: "homepage",
    isSystem: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "18",
    key: "hero_subtitle",
    value: "Discover our collection of high-quality products designed to enhance your creative workflow.",
    category: "homepage",
    isSystem: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "19",
    key: "hero_image_url",
    value: "/images/hero.jpg",
    category: "homepage",
    isSystem: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

// Helper functions
export function getAllSettings(): StoreSetting[] {
  return storeSettings;
}

export function getSettingsByCategory(category: StoreSetting['category']): StoreSetting[] {
  return storeSettings.filter(setting => setting.category === category);
}

export function getSettingByKey(key: string): StoreSetting | undefined {
  return storeSettings.find(setting => setting.key === key);
}

export function getSettingValue(key: string): string | undefined {
  const setting = getSettingByKey(key);
  return setting?.value;
}

export function updateSetting(key: string, value: string): StoreSetting | undefined {
  const settingIndex = storeSettings.findIndex(setting => setting.key === key);
  if (settingIndex === -1) return undefined;
  
  storeSettings[settingIndex] = {
    ...storeSettings[settingIndex],
    value,
    updatedAt: new Date().toISOString()
  };
  
  return storeSettings[settingIndex];
}

export function getHomepageSettings(): Record<string, string> {
  const homepageSettings = getSettingsByCategory('homepage');
  return homepageSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
} 