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
 * User data interface
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
 * Register a new user
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
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set user's display name in the profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Create user data in Firestore
    const userData: UserData = {
      id: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      role: 'customer', // Default user role
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phoneNumber,
      address
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), userData);
    
    // Make sure to return the user data after successful registration
    return userData;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login
 */
export const loginUser = async (email: string, password: string): Promise<{success: boolean; userData?: UserData; error?: string}> => {
  try {
    // Login using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    try {
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // If user exists in Auth but not in Firestore, create a record for them
        console.warn('User exists in Auth but not in Firestore, creating user record');
        
        // Create user data in Firestore
        const userData: UserData = {
          id: user.uid,
          email: user.email || email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          role: 'customer', // Default user role
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), userData);
        
        return {
          success: true,
          userData
        };
      }
      
      return {
        success: true,
        userData: userDoc.data() as UserData
      };
    } catch (firestoreError) {
      console.error('Error getting user data from Firestore:', firestoreError);
      
      // If error is due to being offline, log in anyway with limited data
      if (firestoreError instanceof Error && firestoreError.message.includes('offline')) {
        console.warn('Offline mode - returning limited user data');
        
        return {
          success: true,
          userData: {
            id: user.uid,
            email: user.email || email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            role: 'customer', // Assume user is regular in offline mode
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }
      
      // Other Firestore error
      return {
        success: false,
        error: 'Error retrieving user data. Please try again.'
      };
    }
  } catch (authError) {
    console.error('Error in authentication:', authError);
    
    let errorMessage = "Failed to sign in. Please check your email and password.";
    
    if (authError instanceof Error) {
      if (authError.message.includes('auth/wrong-password') || authError.message.includes('auth/user-not-found')) {
        errorMessage = "Incorrect email or password.";
      } else if (authError.message.includes('auth/too-many-requests')) {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (authError.message.includes('auth/network-request-failed')) {
        errorMessage = "Network error. Please check your internet connection.";
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset link:', error);
    throw error;
  }
};

/**
 * Update user information
 */
export const updateUserInfo = async (
  userId: string, 
  data: Partial<Omit<UserData, 'id' | 'role' | 'createdAt' | 'email'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update user data in Firestore
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    // Update display name in Firebase Auth if name was changed
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
    console.error('Error updating user information:', error);
    throw error;
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (
  newEmail: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    
    // Update email in Firebase Auth
    await updateEmail(currentUser, newEmail);
    
    // Update email in Firestore
    await updateDoc(doc(db, 'users', currentUser.uid), {
      email: newEmail,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};

/**
 * Update password
 */
export const updateUserPassword = async (
  newPassword: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Get current user and their data
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
    console.error('Error getting current user data:', error);
    return null;
  }
};

/**
 * Convert Firebase user to our user data model
 */
export const firebaseUserToUserData = async (firebaseUser: FirebaseUser): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    return null;
  }
};

/**
 * Promote user to admin
 */
export const promoteUserToAdmin = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update user role in Firestore
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date().toISOString()
    });
    
    console.log(`User ${userId} has been successfully promoted to admin`);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
};

/**
 * Create admin user directly (for creating the first admin in the system)
 */
export const createAdminUser = async (
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
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set user's display name in profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Create user data in Firestore with admin role directly
    const userData: UserData = {
      id: user.uid,
      email: user.email || email,
      firstName,
      lastName,
      role: 'admin', // Set role as admin directly
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phoneNumber,
      address
    };
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log(`Admin user created successfully: ${email}`);
    return userData;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  updateUserInfo,
  updateUserEmail,
  updateUserPassword,
  getCurrentUserData,
  firebaseUserToUserData,
  promoteUserToAdmin,
  createAdminUser
}; 