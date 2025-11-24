import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Calendar, Shield } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@utils/constants';
import * as authService from '@services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPRequired, setIsOTPRequired] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const { completeLoginAfterOTP, isAuthenticated } = useAuth();

  // Clear error when user starts typing
  useEffect(() => {
    if (error) setError('');
  }, [email, password, otp]);

  // Auto-focus OTP input when OTP step is shown
  useEffect(() => {
    if (isOTPRequired) {
      const otpInput = document.getElementById('otp');
      if (otpInput) {
        setTimeout(() => otpInput.focus(), 100);
      }
    }
  }, [isOTPRequired]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!email.endsWith('@umd.edu')) {
      setError('Please use a valid UMD email address');
      return;
    }

    setIsLoading(true);

    // Initiate login and trigger OTP
    const result = await authService.initiateLogin(email, password);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.requiresOTP) {
      setIsOTPRequired(true);
      setSuccessMessage(result.message || 'OTP has been sent to your registered email/phone');
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Verify OTP and complete login
    const result = await authService.verifyOTP(otp);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Complete login through AuthContext (user is already stored by verifyOTP)
    const loginResult = await completeLoginAfterOTP();
    if (!loginResult.success) {
      setError(loginResult.error || 'Failed to complete login');
      setIsLoading(false);
      return;
    }

    // Success - AuthContext will handle navigation
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccessMessage('');
    setIsResendingOTP(true);

    const result = await authService.resendOTP();

    if (result.success) {
      setSuccessMessage(result.message || 'A new OTP has been sent');
      setOtp(''); // Clear current OTP input
    } else {
      setError(result.error || 'Failed to resend OTP');
    }

    setIsResendingOTP(false);
  };

  const handleBackToLogin = () => {
    setIsOTPRequired(false);
    setOtp('');
    setError('');
    setSuccessMessage('');
    authService.clearPendingLogin();
  };

  const handleRegistration = () => {
    // TODO: Implement registration - backend work in progress
    setError('Registration is currently being developed. Please check back soon!');
  };

  const quickLogin = (role) => {
    if (isOTPRequired) {
      // If in OTP step, don't allow quick login
      return;
    }
    
    const credentials = {
      student: { email: 'student@umd.edu', password: 'student123' },
      organizer: { email: 'organizer@umd.edu', password: 'organizer123' },
      admin: { email: 'admin@umd.edu', password: 'admin123' }
    };

    const cred = credentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
            <p className="text-gray-600 mt-2">{APP_DESCRIPTION}</p>
            <hr className="my-4 border-gray-200" />
          </div>

          {/* Login Form */}
          {!isOTPRequired ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  University Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="yourname@umd.edu"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {successMessage}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                  {isLoading ? 'Sending OTP...' : 'Log In'}
                </button>

                <button
                  onClick={handleRegistration}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-semibold transition-colors border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Registration
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to your registered email/phone
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleOTPSubmit(e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-center text-2xl tracking-widest"
                  placeholder="xxxxxx"
                  disabled={isLoading}
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {successMessage}
                </div>
              )}

              <button
                onClick={handleOTPSubmit}
                disabled={isLoading || otp.length !== 6}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${isLoading || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
              >
                {isLoading ? 'Verifying...' : 'Verify & Log In'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  ← Back to login
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading || isResendingOTP}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  {isResendingOTP ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Login - Only show when not in OTP step */}
          {!isOTPRequired && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-3">Quick Demo Login:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => quickLogin('student')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  Student
                </button>
                <button
                  onClick={() => quickLogin('organizer')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  Organizer
                </button>
                <button
                  onClick={() => quickLogin('admin')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-purple-50 text-purple-700 rounded text-xs font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Protected by University SSO & Multi-Factor Authentication
        </p>
      </div>
    </div>
  );
};

export default LoginPage;