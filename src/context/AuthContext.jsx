import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '@services/authService';
import { ROUTES } from '@utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on mount
    const initializeAuth = async () => {
      const { valid, user: currentUser } = await authService.validateSession();
      if (valid && currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(result.user);
      navigate(ROUTES.DASHBOARD);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};