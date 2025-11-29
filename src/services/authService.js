import mockUsers from '@data/mockUsers.json';
import { setStorageItem, getStorageItem, removeStorageItem } from '@utils/storage';

const AUTH_TOKEN_KEY = 'terpspark_auth_token';
const USER_KEY = 'terpspark_user';
const BACKEND_URL = 'http://127.0.0.1:8000';
/**
 * Simulates SSO authentication
 * In production, this would call the backend API
 */
export const login = async (email, password) => {
  try {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    const res = await fetch(BACKEND_URL + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    // console.log(data);

    if (!data.success) {
      return {
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
      };
    }

    // Check if organizer is approved
    if (data.user.role === 'organizer' && !data.user.isApproved) {
      return {
        success: false,
        error: 'Your organizer account is pending approval. Please contact an administrator.'
      };
    }

    // // Remove password from user object
    // const { password: _, ...userWithoutPassword } = user;

  //   // Generate mock token
    const token = data.token;

  //   // Store auth data
    setStorageItem(AUTH_TOKEN_KEY, token);
  //   setStorageItem(USER_KEY, userWithoutPassword);

    return {
      success: true,
      user: data.user,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during login. Please try again.'
    };
  }
};

/**
 * Logs out the current user
 */
export const logout = () => {
  removeStorageItem(AUTH_TOKEN_KEY);
  removeStorageItem(USER_KEY);
};

/**
 * Gets the currently authenticated user
 */
export const getCurrentUser = () => {
  return getStorageItem(USER_KEY);
};

/**
 * Gets the current auth token
 */
export const getAuthToken = () => {
  return getStorageItem(AUTH_TOKEN_KEY);
};

/**
 * Checks if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Validates the current session
 */
export const validateSession = async () => {
  try {
    const token = getAuthToken();
    const user = getCurrentUser();

    if (!token || !user) {
      return { valid: false };
    }

    // In production, this would validate the token with the backend
    // For now, we'll just check if it exists and is properly formatted
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.userId && decoded.timestamp) {
        return { valid: true, user };
      }
    } catch {
      return { valid: false };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
};