import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import { USER_ROLES, ROUTES } from '@utils/constants';
import { getAllEvents } from '@services/eventService';
import { getUserRegistrations } from '@services/registrationService';
import { getOrganizerEvents } from '@services/organizerService';
import { fetchDashboardStats } from '@services/adminService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentStats, setStudentStats] = useState({
    upcoming: 0,
    registrations: 0,
    attended: 0
  });
  const [loadingStats, setLoadingStats] = useState(user?.role === USER_ROLES.STUDENT);
  const [organizerStats, setOrganizerStats] = useState({
    events: 0,
    attendees: 0,
    pending: 0
  });
  const [loadingOrganizerStats, setLoadingOrganizerStats] = useState(user?.role === USER_ROLES.ORGANIZER);
  const [adminStats, setAdminStats] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    activeOrganizers: 0
  });
  const [loadingAdminStats, setLoadingAdminStats] = useState(user?.role === USER_ROLES.ADMIN);

  useEffect(() => {
    const loadStudentStats = async () => {
      if (user?.role !== USER_ROLES.STUDENT) return;
      setLoadingStats(true);

      const [eventsResult, regsResult] = await Promise.all([
        getAllEvents(),
        getUserRegistrations(user.id)
      ]);

      const now = new Date();
      const upcoming = eventsResult.success
        ? (eventsResult.events || []).filter(evt => {
            const date = evt.date ? new Date(evt.date) : null;
            return date && date >= now;
          }).length
        : 0;

      const registrations = regsResult.success ? (regsResult.registrations || []) : [];
      const attended = registrations.filter(reg =>
        reg.checkInStatus === 'checked_in' || reg.status === 'attended'
      ).length;

      setStudentStats({
        upcoming,
        registrations: registrations.length,
        attended
      });
      setLoadingStats(false);
    };

    loadStudentStats();
  }, [user]);

  useEffect(() => {
    const loadOrganizerStats = async () => {
      if (user?.role !== USER_ROLES.ORGANIZER && user?.role !== USER_ROLES.ADMIN) return;
      setLoadingOrganizerStats(true);

      const eventsResult = await getOrganizerEvents(user.id);
      if (eventsResult.success) {
        const events = eventsResult.events || [];
        const publishedEvents = events.filter((e) => e.status === 'published');
        const eventsCount = publishedEvents.length;
        const pending = events.filter((e) => e.status === 'pending').length;
        const attendees = publishedEvents.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
        setOrganizerStats({ events: eventsCount, attendees, pending });
      }

      setLoadingOrganizerStats(false);
    };

    loadOrganizerStats();
  }, [user]);

  useEffect(() => {
    const loadAdminStats = async () => {
      if (user?.role !== USER_ROLES.ADMIN) return;
      setLoadingAdminStats(true);
      const [dashboardResult, eventsResult] = await Promise.all([
        fetchDashboardStats(),
        getAllEvents()
      ]);

      const stats = dashboardResult.success ? (dashboardResult.stats || dashboardResult.data || {}) : {};
      const publishedCount = eventsResult.success
        ? (eventsResult.total ?? (eventsResult.events || []).length)
        : 0;

      setAdminStats({
        totalEvents: publishedCount,
        pendingApprovals: stats.totalPending || stats.pendingEvents || 0,
        activeOrganizers: stats.activeOrganizers || 0
      });

      setLoadingAdminStats(false);
    };

    loadAdminStats();
  }, [user]);

  const getRoleContent = () => {
    const content = {
      [USER_ROLES.STUDENT]: {
        title: 'Welcome to TerpSpark',
        description: 'Discover and register for campus events',
        stats: [
          {
            label: 'Upcoming Events',
            value: loadingStats ? '...' : studentStats.upcoming,
            color: 'bg-blue-50 text-blue-700',
            bgColor: 'bg-blue-500'
          },
          {
            label: 'My Registrations',
            value: loadingStats ? '...' : studentStats.registrations,
            color: 'bg-green-50 text-green-700',
            bgColor: 'bg-green-500'
          },
          {
            label: 'Attended',
            value: loadingStats ? '...' : studentStats.attended,
            color: 'bg-purple-50 text-purple-700',
            bgColor: 'bg-purple-500'
          }
        ],
        primaryAction: { label: 'Browse Events', path: ROUTES.EVENTS },
        secondaryAction: { label: 'View My Registrations', path: ROUTES.MY_REGISTRATIONS }
      },
      [USER_ROLES.ORGANIZER]: {
        title: 'Organizer Dashboard',
        description: 'Manage your events and attendees',
        stats: [
          {
            label: 'My Events',
            value: loadingOrganizerStats ? '...' : organizerStats.events,
            color: 'bg-blue-50 text-blue-700',
            bgColor: 'bg-blue-500'
          },
          {
            label: 'Total Attendees',
            value: loadingOrganizerStats ? '...' : organizerStats.attendees,
            color: 'bg-green-50 text-green-700',
            bgColor: 'bg-green-500'
          },
          {
            label: 'Pending Approval',
            value: loadingOrganizerStats ? '...' : organizerStats.pending,
            color: 'bg-orange-50 text-orange-700',
            bgColor: 'bg-orange-500'
          }
        ],
        primaryAction: { label: 'Create New Event', path: ROUTES.CREATE_EVENT },
        secondaryAction: { label: 'View My Events', path: ROUTES.MY_EVENTS }
      },
      [USER_ROLES.ADMIN]: {
        title: 'Admin Dashboard',
        description: 'Oversee all campus events and activities',
        stats: [
          {
            label: 'Total Events',
            value: loadingAdminStats ? '...' : adminStats.totalEvents,
            color: 'bg-blue-50 text-blue-700',
            bgColor: 'bg-blue-500'
          },
          {
            label: 'Pending Approvals',
            value: loadingAdminStats ? '...' : adminStats.pendingApprovals,
            color: 'bg-orange-50 text-orange-700',
            bgColor: 'bg-orange-500'
          },
          {
            label: 'Active Organizers',
            value: loadingAdminStats ? '...' : adminStats.activeOrganizers,
            color: 'bg-green-50 text-green-700',
            bgColor: 'bg-green-500'
          }
        ],
        primaryAction: { label: 'View Pending Approvals', path: ROUTES.APPROVALS },
        secondaryAction: { label: 'Manage Categories', path: ROUTES.MANAGEMENT }
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
            <button
              onClick={() => navigate(roleContent.primaryAction.path)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
            >
              {roleContent.primaryAction.label}
            </button>
            <button
              onClick={() => navigate(roleContent.secondaryAction.path)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {roleContent.secondaryAction.label}
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
                  <p className="text-sm font-medium text-gray-900">Phase 2 features now available!</p>
                  <p className="text-xs text-gray-500">Browse and discover campus events</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">8 new events published this week</p>
                  <p className="text-xs text-gray-500">Check them out in Browse Events</p>
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
