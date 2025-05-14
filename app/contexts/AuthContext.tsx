import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { 
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  authenticateUser,
  registerUser
} from "../models/user";
import type { User } from "../models/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
  updateUserInfo: (updatedInfo: Partial<Omit<User, 'id' | 'passwordHash' | 'role' | 'createdAt' | 'updatedAt'>>) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state on page load
  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const authenticatedUser = authenticateUser(email, password);
      
      if (!authenticatedUser) {
        return { success: false, error: "Invalid email or password" };
      }
      
      // Store user in context and localStorage
      setUser(authenticatedUser);
      saveCurrentUser(authenticatedUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "An error occurred during login. Please try again." 
      };
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };
  
  // Register function
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
      // Register the user
      const newUser = registerUser(userData);
      
      // Auto login after registration
      setUser(newUser);
      saveCurrentUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "An error occurred during registration. Please try again." 
      };
    }
  };
  
  // Update user information
  const updateUserInfo = (updatedInfo: Partial<Omit<User, 'id' | 'passwordHash' | 'role' | 'createdAt' | 'updatedAt'>>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...updatedInfo,
      updatedAt: new Date().toISOString()
    };
    
    setUser(updatedUser);
    saveCurrentUser(updatedUser);
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUserInfo,
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