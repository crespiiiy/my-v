import React, { useState } from 'react';
import { promoteUserToAdmin, createAdminUser } from '../../services/AuthService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

/**
 * Admin Tools Component
 */
const AdminTools: React.FC = () => {
  // New admin user state
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  // User promotion state
  const [userIdToPromote, setUserIdToPromote] = useState('');
  const [userEmailToPromote, setUserEmailToPromote] = useState('');
  const [searchMethod, setSearchMethod] = useState<'id' | 'email'>('email');
  
  // Messages state
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Handle admin data changes
  const handleAdminDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
  };
  
  // Create new admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Validate data
      if (!newAdminData.email || !newAdminData.password || !newAdminData.firstName || !newAdminData.lastName) {
        throw new Error('All fields are required');
      }
      
      // Check password length
      if (newAdminData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create admin user directly
      const adminUser = await createAdminUser(
        newAdminData.email,
        newAdminData.password,
        newAdminData.firstName,
        newAdminData.lastName
      );
      
      // Show success message
      setMessage({ 
        text: `Admin user created successfully: ${newAdminData.email}`, 
        type: 'success' 
      });
      
      // Reset form
      setNewAdminData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage({ 
        text: `Failed to create admin: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Promote existing user to admin
  const handlePromoteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (searchMethod === 'id' && !userIdToPromote) {
        throw new Error('User ID is required');
      }
      
      if (searchMethod === 'email' && !userEmailToPromote) {
        throw new Error('User email is required');
      }
      
      // If searching by email, find user ID first
      let userId = userIdToPromote;
      
      if (searchMethod === 'email') {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmailToPromote));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('No user found with this email');
        }
        
        userId = querySnapshot.docs[0].id;
      }
      
      // Promote user
      await promoteUserToAdmin(userId);
      
      // Show success message
      setMessage({ 
        text: `User ${searchMethod === 'email' ? userEmailToPromote : userId} promoted to admin successfully`, 
        type: 'success' 
      });
      
      // Reset form
      setUserIdToPromote('');
      setUserEmailToPromote('');
    } catch (error) {
      console.error('Error promoting user:', error);
      setMessage({ 
        text: `Failed to promote user: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Tools</h2>
      
      {/* Success or error message */}
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
          {message.text}
        </div>
      )}
      
      {/* Create new admin form */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Create New Admin Account</h3>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={newAdminData.firstName}
                onChange={handleAdminDataChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newAdminData.lastName}
                onChange={handleAdminDataChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newAdminData.email}
              onChange={handleAdminDataChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
              dir="ltr"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newAdminData.password}
              onChange={handleAdminDataChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
              minLength={6}
              dir="ltr"
            />
            <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
        </form>
      </div>
      
      <hr className="border-gray-600" />
      
      {/* Promote existing user form */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Promote Existing User to Admin</h3>
        
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                name="searchMethod"
                checked={searchMethod === 'email'}
                onChange={() => setSearchMethod('email')}
                className="mr-2"
              />
              Search by Email
            </label>
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                name="searchMethod"
                checked={searchMethod === 'id'}
                onChange={() => setSearchMethod('id')}
                className="mr-2"
              />
              Search by User ID
            </label>
          </div>
        </div>
        
        <form onSubmit={handlePromoteUser} className="space-y-4">
          {searchMethod === 'email' ? (
            <div>
              <label htmlFor="userEmailToPromote" className="block text-sm font-medium text-gray-300 mb-1">
                User Email
              </label>
              <input
                type="email"
                id="userEmailToPromote"
                value={userEmailToPromote}
                onChange={(e) => setUserEmailToPromote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
                dir="ltr"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="userIdToPromote" className="block text-sm font-medium text-gray-300 mb-1">
                User ID
              </label>
              <input
                type="text"
                id="userIdToPromote"
                value={userIdToPromote}
                onChange={(e) => setUserIdToPromote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                required
                dir="ltr"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'Promoting...' : 'Promote to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminTools; 