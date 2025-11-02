import React from 'react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import { USER_ROLES } from '@utils/constants';

const DashboardPage = () => {
  const { user } = useAuth();

  const getRoleContent = () => {
    const content = {
      [USER_ROLES.STUDENT]: {
        title: 'Welcome to TerpSpark',
        description: 'Discover and register for campus events',
        stats: [
          { label: 'Upcoming Events', value: '24', color: 'bg-blue-50 text-blue-700', bgColor: 'bg-blue-500' },
          { label: 'My Registrations', value: '3', color: 'bg-green-50 text-green-700', bgColor: 'bg-green-500' },
          { label: 'Attended', value: '12', color: 'bg-purple-50 text-purple-700', bgColor: 'bg-purple-500' }
        ],
        primaryAction: 'Browse Events',
        secondaryAction: 'View My Registrations'
      },
      [USER_ROLES.ORGANIZER]: {
        title: 'Organizer Dashboard',
        description: 'Manage your events and attendees',
        stats: [
          { label: 'My Events', value: '8', color: 'bg-blue-50 text-blue-700', bgColor: 'bg-blue-500' },
          { label: 'Total Attendees', value: '156', color: 'bg-green-50 text-green-700', bgColor: 'bg-green-500' },
          { label: 'Pending Approval', value: '2', color: 'bg-orange-50 text-orange-700', bgColor: 'bg-orange-500' }
        ],
        primaryAction: 'Create New Event',
        secondaryAction: 'View My Events'
      },
      [USER_ROLES.ADMIN]: {
        title: 'Admin Dashboard',
        description: 'Oversee all campus events and activities',
        stats: [
          { label: 'Total Events', value: '47', color: 'bg-blue-50 text-blue-700', bgColor: 'bg-blue-500' },
          { label: 'Pending Approvals', value: '5', color: 'bg-orange-50 text-orange-700', bgColor: 'bg-orange-500' },
          { label: 'Active Organizers', value: '23', color: 'bg-green-50 text-green-700', bgColor: 'bg-green-500' }
        ],
        primaryAction: 'View Pending Approvals',
        secondaryAction: 'Manage Categories'
      }
    };

    return content[user.role] || content[USER_ROLES.STUDENT];
  };

  const roleContent = getRoleContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{roleContent.title}</h1>
          <p className="text-gray-600 mt-2">{roleContent.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleContent.stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className={`w-3 h-3 rounded-full ${stat.bgColor}`}></div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${stat.bgColor}`} style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm">
              {roleContent.primaryAction}
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              {roleContent.secondaryAction}
            </button>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">System initialized successfully</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Welcome to TerpSpark Phase 1</p>
                  <p className="text-xs text-gray-500">1 minute ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;