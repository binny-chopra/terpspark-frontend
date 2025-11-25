import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Shield, Home, Plus, FileText, Tag, BarChart2 } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { USER_ROLES, ROUTES } from '@utils/constants';

const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home, path: ROUTES.DASHBOARD }
    ];

    if (!user) {
      return baseItems;
    }

    const roleSpecificItems = {
      [USER_ROLES.STUDENT]: [
        { id: 'events', label: 'Browse Events', icon: Calendar, path: ROUTES.EVENTS },
        { id: 'my-registrations', label: 'My Registrations', icon: Users, path: ROUTES.MY_REGISTRATIONS }
      ],
      [USER_ROLES.ORGANIZER]: [
        { id: 'events', label: 'Browse Events', icon: Calendar, path: ROUTES.EVENTS },
        { id: 'my-events', label: 'My Events', icon: Calendar, path: ROUTES.MY_EVENTS },
        { id: 'create-event', label: 'Create Event', icon: Plus, path: ROUTES.CREATE_EVENT }
      ],
      [USER_ROLES.ADMIN]: [
        { id: 'events', label: 'All Events', icon: Calendar, path: ROUTES.EVENTS },
        { id: 'approvals', label: 'Approvals', icon: Shield, path: ROUTES.APPROVALS },
        { id: 'management', label: 'Management', icon: Tag, path: ROUTES.MANAGEMENT },
        { id: 'analytics', label: 'Analytics', icon: BarChart2, path: ROUTES.ANALYTICS },
        { id: 'audit', label: 'Audit Logs', icon: FileText, path: ROUTES.AUDIT_LOGS }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user.role] || [])];
  };

  const navItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = (item) => {
    navigate(item.path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${active
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;