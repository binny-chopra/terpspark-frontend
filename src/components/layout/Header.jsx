import React, { useState } from 'react';
import { User, LogOut, Calendar, Menu, X } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { ROLE_LABELS, ROLE_COLORS, APP_NAME } from '@utils/constants';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = () => {
    return ROLE_COLORS[user.role] || ROLE_COLORS.student;
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-red-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">{APP_NAME}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;