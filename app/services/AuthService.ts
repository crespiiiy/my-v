import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * واجهة بيانات المستخدم
 */
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phoneNumber?: string;
}

/**
 * تسجيل مستخدم جديد
 */
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
): Promise<UserData> => {
  try {
    // إنشاء المستخدم في Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // تعيين اسم المستخدم في الملف الشخصي
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    
    // إنشاء بيانات المستخدم في Firestore
    const userData: UserData = {
      id: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      role: 'customer', // دور المستخدم الافتراضي
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phoneNumber,
      address
    };
    
    // حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return userData;
  } catch (error) {
    console.error('خطأ في تسجيل المستخدم:', error);
    throw error;
  }
};

/**
 * تسجيل الدخول
 */
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    // تسجيل الدخول باستخدام Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // جلب بيانات المستخدم من Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('بيانات المستخدم غير موجودة');
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    throw error;
  }
};

/**
 * تسجيل الخروج
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    throw error;
  }
};

/**
 * إرسال رابط إعادة تعيين كلمة المرور
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('خطأ في إرسال رابط إعادة تعيين كلمة المرور:', error);
    throw error;
  }
};

/**
 * تحديث معلومات المستخدم
 */
export const updateUserInfo = async (
  userId: string, 
  data: Partial<Omit<UserData, 'id' | 'role' | 'createdAt' | 'email'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // تحديث بيانات المستخدم في Firestore
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    // تحديث اسم العرض في Firebase Auth إذا تم تغيير الاسم
    if (data.firstName || data.lastName) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as UserData;
        
        const firstName = data.firstName || userData.firstName;
        const lastName = data.lastName || userData.lastName;
        
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`
        });
      }
    }
  } catch (error) {
    console.error('خطأ في تحديث معلومات المستخدم:', error);
    throw error;
  }
};

/**
 * تحديث البريد الإلكتروني للمستخدم
 */
export const updateUserEmail = async (
  newEmail: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('المستخدم غير مسجل الدخول');
    }
    
    // تحديث البريد الإلكتروني في Firebase Auth
    await updateEmail(currentUser, newEmail);
    
    // تحديث البريد الإلكتروني في Firestore
    await updateDoc(doc(db, 'users', currentUser.uid), {
      email: newEmail,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('خطأ في تحديث البريد الإلكتروني:', error);
    throw error;
  }
};

/**
 * تحديث كلمة المرور
 */
export const updateUserPassword = async (
  newPassword: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('المستخدم غير مسجل الدخول');
    }
    
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error('خطأ في تحديث كلمة المرور:', error);
    throw error;
  }
};

/**
 * الحصول على المستخدم الحالي وبياناته
 */
export const getCurrentUserData = async (): Promise<UserData | null> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return null;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('خطأ في الحصول على بيانات المستخدم الحالي:', error);
    return null;
  }
};

/**
 * تحويل مستخدم Firebase إلى نموذج بيانات المستخدم الخاص بنا
 */
export const firebaseUserToUserData = async (firebaseUser: FirebaseUser): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('خطأ في تحويل مستخدم Firebase:', error);
    return null;
  }
}; 