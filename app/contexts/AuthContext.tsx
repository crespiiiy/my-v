import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { 
  registerUser,
  loginUser,
  logoutUser,
  updateUserInfo as updateUserInfoService,
  updateUserEmail,
  updateUserPassword,
  getCurrentUserData,
  type UserData
} from "../services/AuthService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phoneNumber?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateUserInfo: (updatedInfo: Partial<Omit<UserData, 'id' | 'role' | 'createdAt' | 'email'>>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // استمع إلى تغييرات حالة المصادقة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // إذا كان المستخدم مسجل الدخول، قم بجلب بياناته
        const userData = await getCurrentUserData();
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    // إلغاء الاشتراك عند فك التحميل
    return () => unsubscribe();
  }, []);
  
  // تسجيل الدخول
  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      // تحديد رسالة خطأ مناسبة
      let errorMessage = "فشل تسجيل الدخول. تحقق من بريدك الإلكتروني وكلمة المرور.";
      
      if (error instanceof Error) {
        // معالجة أخطاء Firebase Auth الشائعة
        if (error.message.includes('wrong-password') || error.message.includes('user-not-found')) {
          errorMessage = "بريد إلكتروني أو كلمة مرور غير صحيحة";
        } else if (error.message.includes('too-many-requests')) {
          errorMessage = "تم تقييد الوصول بسبب محاولات تسجيل دخول متكررة. حاول مرة أخرى لاحقًا.";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // تسجيل الخروج
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };
  
  // التسجيل
  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phoneNumber?: string;
  }) => {
    try {
      const newUser = await registerUser(
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.phoneNumber,
        userData.address
      );
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
      
      // تحديد رسالة خطأ مناسبة
      let errorMessage = "فشل إنشاء الحساب. حاول مرة أخرى.";
      
      if (error instanceof Error) {
        // معالجة أخطاء Firebase Auth الشائعة
        if (error.message.includes('email-already-in-use')) {
          errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل";
        } else if (error.message.includes('weak-password')) {
          errorMessage = "كلمة المرور ضعيفة جدًا. يجب أن تكون على الأقل 6 أحرف.";
        } else if (error.message.includes('invalid-email')) {
          errorMessage = "البريد الإلكتروني غير صالح";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // تحديث معلومات المستخدم
  const updateUserInfo = async (updatedInfo: Partial<Omit<UserData, 'id' | 'role' | 'createdAt' | 'email'>>) => {
    if (!user) return;
    
    try {
      await updateUserInfoService(user.id, updatedInfo);
      
      // تحديث المستخدم في الحالة المحلية
      const updatedUser = await getCurrentUserData();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('خطأ في تحديث معلومات المستخدم:', error);
      throw error;
    }
  };
  
  // تحديث البريد الإلكتروني
  const updateEmail = async (newEmail: string) => {
    try {
      await updateUserEmail(newEmail);
      
      // تحديث المستخدم في الحالة المحلية
      const updatedUser = await getCurrentUserData();
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      return { success: true };
    } catch (error) {
      console.error('خطأ في تحديث البريد الإلكتروني:', error);
      
      let errorMessage = "فشل تحديث البريد الإلكتروني";
      
      if (error instanceof Error) {
        if (error.message.includes('requires-recent-login')) {
          errorMessage = "هذه العملية حساسة وتتطلب إعادة تسجيل الدخول مؤخرًا. يرجى تسجيل الخروج وإعادة تسجيل الدخول.";
        } else if (error.message.includes('email-already-in-use')) {
          errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // تحديث كلمة المرور
  const updatePassword = async (newPassword: string) => {
    try {
      await updateUserPassword(newPassword);
      return { success: true };
    } catch (error) {
      console.error('خطأ في تحديث كلمة المرور:', error);
      
      let errorMessage = "فشل تحديث كلمة المرور";
      
      if (error instanceof Error) {
        if (error.message.includes('requires-recent-login')) {
          errorMessage = "هذه العملية حساسة وتتطلب إعادة تسجيل الدخول مؤخرًا. يرجى تسجيل الخروج وإعادة تسجيل الدخول.";
        } else if (error.message.includes('weak-password')) {
          errorMessage = "كلمة المرور ضعيفة جدًا. يجب أن تكون على الأقل 6 أحرف.";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUserInfo,
    updateEmail,
    updatePassword,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
} 