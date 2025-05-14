import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../services/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';

const PasswordPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password validation rules
  const [passwordError, setPasswordError] = useState('');
  const passwordRequirements = [
    { regex: /.{8,}/, message: 'At least 8 characters long' },
    { regex: /[0-9]/, message: 'At least one number' },
    { regex: /[a-z]/, message: 'At least one lowercase letter' },
    { regex: /[A-Z]/, message: 'At least one uppercase letter' },
    { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
  ];

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Validate new password against requirements
  const validatePassword = (password: string): boolean => {
    const failedRequirements = passwordRequirements
      .filter(requirement => !requirement.regex.test(password))
      .map(requirement => requirement.message);
    
    if (failedRequirements.length > 0) {
      setPasswordError(`Password must be: ${failedRequirements.join(', ')}`);
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    // Validate password
    if (!validatePassword(newPassword)) {
      return;
    }
    
    setLoading(true);
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser || !currentUser.email) {
        throw new Error('No authenticated user found');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      
      // Success
      setSuccess('Your password has been successfully updated');
      
      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const authError = error as AuthError;
      if (authError.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else if (authError.code === 'auth/weak-password') {
        setError('New password is too weak');
      } else {
        setError(`Failed to update password: ${authError.message || 'Unknown error'}`);
      }
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="text-gray-400 mt-2">Update your account password</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-800/30 text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-md bg-green-800/30 text-green-200">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">Account Menu</h2>
            </div>
            <nav className="border-t border-gray-700">
              <Link
                to="/account"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/account/orders"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Order History
              </Link>
              <Link
                to="/account/addresses"
                className="block px-4 py-3 border-l-4 border-transparent hover:bg-gray-750 transition-colors"
              >
                Saved Addresses
              </Link>
              <Link
                to="/account/password"
                className="block px-4 py-3 border-l-4 border-blue-500 bg-gray-750"
              >
                Change Password
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Password Settings</h2>
            
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    passwordError ? 'border-red-500' : 'border-gray-600'
                  } rounded-md text-white`}
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400">{passwordError}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    newPassword !== confirmPassword && confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-600'
                  } rounded-md text-white`}
                  required
                />
                {newPassword !== confirmPassword && confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage; 