import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import ProtectedRoute from '@components/common/ProtectedRoute';
import { USER_ROLES } from '@utils/constants';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/DashboardPage';
import EventsPage from '@pages/EventsPage';
import MyRegistrationsPage from '@pages/MyRegistrationsPage';
import MyEventsPage from '@pages/MyEventsPage';
import CreateEventPage from '@pages/CreateEventPage';
import EventAttendeesPage from '@pages/EventAttendeesPage';

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

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;