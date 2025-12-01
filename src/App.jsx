import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import ProtectedRoute from '@components/common/ProtectedRoute';
import { USER_ROLES } from '@utils/constants';

// Pages
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import EventsPage from '@pages/EventsPage';
import MyRegistrationsPage from '@pages/MyRegistrationsPage';
import MyEventsPage from '@pages/MyEventsPage';
import CreateEventPage from '@pages/CreateEventPage';
import EventAttendeesPage from '@pages/EventAttendeesPage';

// Admin Pages (Phase 5)
import ApprovalsPage from '@pages/ApprovalsPage';
import ManagementPage from '@pages/ManagementPage';
import AuditLogsPage from '@pages/AuditLogsPage';
import AnalyticsPage from '@pages/AnalyticsPage';

// Phase 6 Pages
import CheckInPage from '@pages/CheckInPage';
import EditEventPage from '@pages/EditEventPage';
import NotificationsPage from '@pages/NotificationsPage';
import ProfilePage from '@pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Common Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: Profile (All authenticated users) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: Notifications (All authenticated users) */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Organizer Routes */}
          <Route
            path="/my-events"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZER, USER_ROLES.ADMIN]}>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZER, USER_ROLES.ADMIN]}>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-attendees/:eventId"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZER, USER_ROLES.ADMIN]}>
                <EventAttendeesPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: Edit Event */}
          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZER, USER_ROLES.ADMIN]}>
                <EditEventPage />
              </ProtectedRoute>
            }
          />

          {/* Phase 6: Check-in */}
          <Route
            path="/checkin/:eventId"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZER, USER_ROLES.ADMIN]}>
                <CheckInPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Phase 5) */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <ApprovalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <ManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
