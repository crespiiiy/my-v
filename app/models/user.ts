export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string; // In a real app, never store plain passwords
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

// Sample users data
export const users: User[] = [
  {
    id: "1",
    email: "admin@creative.com",
    firstName: "Admin",
    lastName: "User",
    passwordHash: "hashed_password_123", // In a real app, use proper password hashing
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    passwordHash: "hashed_password_456",
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    phoneNumber: "555-123-4567"
  },
  {
    id: "3",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    passwordHash: "hashed_password_789",
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States"
    },
    phoneNumber: "555-987-6543"
  }
];

// Local storage key for current user
export const CURRENT_USER_KEY = "creative_current_user";

// User authentication functions (simplified for demo)
export function authenticateUser(email: string, password: string): User | null {
  // In a real app, we would properly hash the password and compare with the stored hash
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // For demo purposes, we're just checking if the user exists and pretending the password is correct
  return user || null;
}

// Get current user from storage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

// Save current user to storage
export function saveCurrentUser(user: User): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user from storage (logout)
export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

// Register new user (simplified for demo)
export function registerUser(userData: Omit<User, 'id' | 'passwordHash' | 'role' | 'createdAt' | 'updatedAt'> & { password: string }): User {
  // In a real app, we would properly hash the password
  const newUser: User = {
    id: (users.length + 1).toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash: `hashed_${userData.password}`, // Simulated hashing
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: userData.address,
    phoneNumber: userData.phoneNumber
  };
  
  users.push(newUser);
  return newUser;
}

// Update user (simplified for demo)
export function updateUser(id: string, userData: Partial<Omit<User, 'id' | 'passwordHash' | 'role' | 'createdAt' | 'updatedAt'>>): User | null {
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  return users[userIndex];
} 