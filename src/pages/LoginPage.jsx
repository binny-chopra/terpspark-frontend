import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // Clear error when user starts typing
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const allowedDomains = ['@umd.edu', '@terpmail.umd.edu'];
    if (!allowedDomains.some((domain) => email.endsWith(domain))) {
      setError('Please use a valid UMD email address');
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const quickLogin = (role) => {
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
          </div>

          {/* Login Form */}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
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

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              <button
                onClick={() => navigate('/register')}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg font-semibold border border-red-600 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Quick Login */}
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
        </div>

        <div className="text-center text-sm text-gray-600 mt-4 space-y-2"></div>
      </div>
    </div>
  );
};

export default LoginPage;
