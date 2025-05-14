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
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // If user is logged in, fetch their data
        const userData = await getCurrentUserData();
        setUser(userData);
        setIsLoggedIn(!!userData);
        setIsAdmin(userData?.role === 'admin' || false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    
    // Unsubscribe when unmounting
    return () => unsubscribe();
  }, []);
  
  // Login
  const login = async (email: string, password: string) => {
    setLoadingAuth(true);
    setError(null);
    
    try {
      const response = await loginUser(email, password);
      
      if (response.success && response.userData) {
        setUser(response.userData);
        setIsLoggedIn(true);
        setIsAdmin(response.userData.role === 'admin');
        
        return { success: true };
      } else {
        setError(response.error || 'Failed to sign in');
        return { success: false, error: response.error || 'Failed to sign in' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoadingAuth(false);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Register
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
      
      // Make sure that the user is set correctly after registration
      setUser(newUser);
      setIsLoggedIn(true);
      setIsAdmin(newUser.role === 'admin');
      
      // Successfully registered
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Determine appropriate error message
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error instanceof Error) {
        // Handle common Firebase Auth errors
        if (error.message.includes('email-already-in-use')) {
          errorMessage = "This email is already in use";
        } else if (error.message.includes('weak-password')) {
          errorMessage = "Password is too weak. It must be at least 6 characters.";
        } else if (error.message.includes('invalid-email')) {
          errorMessage = "Invalid email address";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // Update user info
  const updateUserInfo = async (updatedInfo: Partial<Omit<UserData, 'id' | 'role' | 'createdAt' | 'email'>>) => {
    if (!user) return;
    
    try {
      await updateUserInfoService(user.id, updatedInfo);
      
      // Update user in local state
      const updatedUser = await getCurrentUserData();
      if (updatedUser) {
        setUser(updatedUser);
        setIsLoggedIn(true);
        setIsAdmin(updatedUser.role === 'admin');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  };
  
  // Update email
  const updateEmail = async (newEmail: string) => {
    try {
      await updateUserEmail(newEmail);
      
      // Update user in local state
      const updatedUser = await getCurrentUserData();
      if (updatedUser) {
        setUser(updatedUser);
        setIsLoggedIn(true);
        setIsAdmin(updatedUser.role === 'admin');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating email:', error);
      
      let errorMessage = "Failed to update email";
      
      if (error instanceof Error) {
        if (error.message.includes('requires-recent-login')) {
          errorMessage = "This operation is sensitive and requires recent login. Please log out and log in again.";
        } else if (error.message.includes('email-already-in-use')) {
          errorMessage = "This email is already in use by another account";
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      await updateUserPassword(newPassword);
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      
      let errorMessage = "Failed to update password";
      
      if (error instanceof Error) {
        if (error.message.includes('requires-recent-login')) {
          errorMessage = "This operation is sensitive and requires recent login. Please log out and log in again.";
        } else if (error.message.includes('weak-password')) {
          errorMessage = "Password is too weak. It must be at least 6 characters.";
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
    isLoggedIn,
    isAdmin
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