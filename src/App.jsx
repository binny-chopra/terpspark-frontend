import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import ProtectedRoute from '@components/common/ProtectedRoute';
import { USER_ROLES } from '@utils/constants';

// Pages
import LoginPage from '@pages/LoginPage';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

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