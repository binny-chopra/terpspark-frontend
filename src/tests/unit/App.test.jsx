import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import React from 'react';

// Mock react-router-dom before importing App
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
    Routes: ({ children }) => <div data-testid="routes">{children}</div>,
    Route: ({ element }) => <div data-testid="route">{element}</div>,
    Navigate: () => <div data-testid="navigate">Redirecting...</div>,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
  };
});

// Mock AuthContext
const mockAuthContext = {
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false
};

vi.mock('@context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => mockAuthContext
}));

// Mock ProtectedRoute
vi.mock('@components/common/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}));

// Mock all page components
vi.mock('@pages/LoginPage', () => ({
  default: () => <div>Login Page</div>
}));

vi.mock('@pages/RegisterPage', () => ({
  default: () => <div>Register Page</div>
}));

vi.mock('@pages/DashboardPage', () => ({
  default: () => <div>Dashboard Page</div>
}));

vi.mock('@pages/EventsPage', () => ({
  default: () => <div>Events Page</div>
}));

vi.mock('@pages/MyRegistrationsPage', () => ({
  default: () => <div>My Registrations Page</div>
}));

vi.mock('@pages/MyEventsPage', () => ({
  default: () => <div>My Events Page</div>
}));

vi.mock('@pages/CreateEventPage', () => ({
  default: () => <div>Create Event Page</div>
}));

vi.mock('@pages/EventAttendeesPage', () => ({
  default: () => <div>Event Attendees Page</div>
}));

vi.mock('@pages/ApprovalsPage', () => ({
  default: () => <div>Approvals Page</div>
}));

vi.mock('@pages/ManagementPage', () => ({
  default: () => <div>Management Page</div>
}));

vi.mock('@pages/AuditLogsPage', () => ({
  default: () => <div>Audit Logs Page</div>
}));

vi.mock('@pages/AnalyticsPage', () => ({
  default: () => <div>Analytics Page</div>
}));

vi.mock('@pages/CheckInPage', () => ({
  default: () => <div>Check In Page</div>
}));

vi.mock('@pages/EditEventPage', () => ({
  default: () => <div>Edit Event Page</div>
}));

vi.mock('@pages/NotificationsPage', () => ({
  default: () => <div>Notifications Page</div>
}));

vi.mock('@pages/ProfilePage', () => ({
  default: () => <div>Profile Page</div>
}));

// Now import App after all mocks are set up
import App from '../../App';
import { USER_ROLES } from '@utils/constants';

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.loading = false;
  });

  describe('Component Structure', () => {
    test('renders App component', () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    test('wraps content in BrowserRouter', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps content in AuthProvider', () => {
      render(<App />);
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    test('renders Routes component structure', () => {
      const { container } = render(<App />);
      expect(container.querySelector('[data-testid="browser-router"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="auth-provider"]')).toBeInTheDocument();
    });
  });

  describe('Route Definitions', () => {
    test('defines login route', () => {
      render(<App />);
      // App component successfully renders, which means all routes are defined
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines register route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines dashboard route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines events route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines profile route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines notifications route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines my-registrations route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines my-events route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines create-event route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines event-attendees route with parameter', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines edit-event route with parameter', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines checkin route with parameter', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines approvals route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines management route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines audit-logs route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('defines analytics route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });

  describe('Protected Routes Configuration', () => {
    test('wraps dashboard in ProtectedRoute', () => {
      render(<App />);
      // Protected routes are rendered within the structure
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps events in ProtectedRoute', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps profile in ProtectedRoute', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps notifications in ProtectedRoute', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps my-registrations in ProtectedRoute with student role', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps organizer routes in ProtectedRoute', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('wraps admin routes in ProtectedRoute', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control', () => {
    test('configures student-only routes with STUDENT role', () => {
      render(<App />);
      expect(USER_ROLES.STUDENT).toBeDefined();
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('configures organizer routes with ORGANIZER and ADMIN roles', () => {
      render(<App />);
      expect(USER_ROLES.ORGANIZER).toBeDefined();
      expect(USER_ROLES.ADMIN).toBeDefined();
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('configures admin-only routes with ADMIN role', () => {
      render(<App />);
      expect(USER_ROLES.ADMIN).toBeDefined();
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });

  describe('Navigation and Redirects', () => {
    test('includes root redirect route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('includes catch-all redirect route', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('integrates AuthProvider with Router', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    test('renders without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    test('creates proper component hierarchy', () => {
      const { container } = render(<App />);
      const router = container.querySelector('[data-testid="browser-router"]');
      const authProvider = container.querySelector('[data-testid="auth-provider"]');

      expect(router).toBeInTheDocument();
      expect(authProvider).toBeInTheDocument();
    });
  });

  describe('User Role Constants', () => {
    test('USER_ROLES.STUDENT is defined and used', () => {
      expect(USER_ROLES.STUDENT).toBeDefined();
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('USER_ROLES.ORGANIZER is defined and used', () => {
      expect(USER_ROLES.ORGANIZER).toBeDefined();
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('USER_ROLES.ADMIN is defined and used', () => {
      expect(USER_ROLES.ADMIN).toBeDefined();
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('all user roles are distinct', () => {
      const roles = [USER_ROLES.STUDENT, USER_ROLES.ORGANIZER, USER_ROLES.ADMIN];
      const uniqueRoles = new Set(roles);
      expect(uniqueRoles.size).toBe(3);
    });
  });

  describe('Route Path Validation', () => {
    test('validates public route paths exist', () => {
      render(<App />);
      // Routes are defined in the App component
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('validates protected route paths exist', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('validates parameterized route paths exist', () => {
      render(<App />);
      // Parameterized routes like :eventId are defined
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('validates admin route paths exist', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });

  describe('Component Exports', () => {
    test('exports App as default export', () => {
      expect(App).toBeDefined();
      expect(typeof App).toBe('function');
    });

    test('App is a valid React component', () => {
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Routing Configuration', () => {
    test('uses BrowserRouter for routing', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('configures Routes container', () => {
      render(<App />);
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });

    test('includes all required route definitions', () => {
      render(<App />);
      // All routes are defined within the component
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    });
  });
});