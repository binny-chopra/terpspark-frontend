import mockUsers from '@data/mockUsers.json';
import { setStorageItem, getStorageItem, removeStorageItem } from '@utils/storage';

const AUTH_TOKEN_KEY = 'terpspark_auth_token';
const USER_KEY = 'terpspark_user';
const BACKEND_URL = 'http://127.0.0.1:8000';
/**
 * Initiates login and triggers MFA OTP
 * TODO: Call the backend API
 */
export const initiateLogin = async (email, password) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
      };
    }

    // Check if organizer is approved
    if (user.role === 'organizer' && !user.isApproved) {
      return {
        success: false,
        error: 'Your organizer account is pending approval. Please contact an administrator.'
      };
    }

    // Simulate OTP being sent (in production, backend would send OTP via email/SMS)
    // For demo purposes, we'll generate a mock OTP
    const mockOTP = '123456'; // In production, this would come from backend
    
    // Store pending login session (temporary, until OTP is verified)
    const pendingSession = {
      email,
      userId: user.id,
      timestamp: Date.now(),
      otp: mockOTP // In production, OTP would be stored on backend
    };
    
    setStorageItem('terpspark_pending_login', JSON.stringify(pendingSession));

    return {
      success: true,
      requiresOTP: true,
      message: 'OTP has been sent to your registered email/phone'
    };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during login. Please try again.'
    };
  }
};

/**
 * Verifies OTP and completes login
 * TODO: Call the backend API
 */
export const verifyOTP = async (otp) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const pendingSessionStr = getStorageItem('terpspark_pending_login');
    
    if (!pendingSessionStr) {
      return {
        success: false,
        error: 'No pending login session. Please start over.'
      };
    }

    const pendingSession = JSON.parse(pendingSessionStr);
    
    // Check if OTP matches (in production, backend would verify)
    if (otp !== pendingSession.otp) {
      return {
        success: false,
        error: 'Invalid OTP. Please try again.'
      };
    }

    // Check if OTP is expired (5 minutes)
    const now = Date.now();
    if (now - pendingSession.timestamp > 5 * 60 * 1000) {
      removeStorageItem('terpspark_pending_login');
      return {
        success: false,
        error: 'OTP has expired. Please request a new one.'
      };
    }

    // Find user
    const user = mockUsers.users.find(u => u.id === pendingSession.userId);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found. Please try again.'
      };
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate mock token
    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));

    // Store auth data
    setStorageItem(AUTH_TOKEN_KEY, token);
    setStorageItem(USER_KEY, userWithoutPassword);
    
    // Clear pending session
    removeStorageItem('terpspark_pending_login');

    return {
      success: true,
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during OTP verification. Please try again.'
    };
  }
};

/**
 * Resends OTP
 * TODO: Call the backend API
 */
export const resendOTP = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const pendingSessionStr = getStorageItem('terpspark_pending_login');
    
    if (!pendingSessionStr) {
      return {
        success: false,
        error: 'No pending login session. Please start over.'
      };
    }

    const pendingSession = JSON.parse(pendingSessionStr);
    
    // Generate new mock OTP (TODO: backend would send new OTP)
    const mockOTP = '123456';
    
    // Update pending session with new OTP and timestamp
    const updatedSession = {
      ...pendingSession,
      otp: mockOTP,
      timestamp: Date.now()
    };
    
    setStorageItem('terpspark_pending_login', JSON.stringify(updatedSession));

    return {
      success: true,
      message: 'A new OTP has been sent to your registered email/phone'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to resend OTP. Please try again.'
    };
  }
};

/**
 * Legacy login function (kept for backward compatibility)
 * Direct login without MFA - used by AuthContext and other parts of the app
 * For MFA flow, use initiateLogin() -> verifyOTP() instead
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

/**
 * Clears pending login session
 */
export const clearPendingLogin = () => {
  removeStorageItem('terpspark_pending_login');
};