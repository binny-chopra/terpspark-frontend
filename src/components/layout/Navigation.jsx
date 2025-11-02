import React, { useState } from 'react';
import { Calendar, Users, Shield, Home, Plus } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { USER_ROLES } from '@utils/constants';

const Navigation = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home }
    ];

    const roleSpecificItems = {
      [USER_ROLES.STUDENT]: [
        { id: 'events', label: 'Browse Events', icon: Calendar },
        { id: 'my-registrations', label: 'My Registrations', icon: Users }
      ],
      [USER_ROLES.ORGANIZER]: [
        { id: 'events', label: 'Browse Events', icon: Calendar },
        { id: 'my-events', label: 'My Events', icon: Calendar },
        { id: 'create-event', label: 'Create Event', icon: Plus }
      ],
      [USER_ROLES.ADMIN]: [
        { id: 'events', label: 'All Events', icon: Calendar },
        { id: 'approvals', label: 'Approvals', icon: Shield },
        { id: 'management', label: 'Management', icon: Users },
        { id: 'audit', label: 'Audit Logs', icon: Shield }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[user.role] || [])];
  };

  const navItems = getNavigationItems();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id
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