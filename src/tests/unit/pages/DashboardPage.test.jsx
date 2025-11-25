import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '@pages/DashboardPage';
import { USER_ROLES, ROUTES } from '@utils/constants';
import '../setup/layoutMocks';

const mockNavigate = vi.fn();
const mockUser = { id: 'u-1', name: 'Test User', role: USER_ROLES.STUDENT };

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockUser.role = USER_ROLES.STUDENT;
  });

  it('renders student dashboard content by default', () => {
    mockUser.role = USER_ROLES.STUDENT;
    render(<DashboardPage />);

    expect(screen.getByText('Welcome to TerpSpark')).toBeInTheDocument();
    expect(screen.getByText('Discover and register for campus events')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    // "My Registrations" appears in both Navigation and Dashboard content, so use getAllByText
    expect(screen.getAllByText('My Registrations').length).toBeGreaterThan(0);

    // Buttons may appear in both Navigation and Dashboard, so use getAllByRole
    expect(screen.getAllByRole('button', { name: 'Browse Events' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'View My Registrations' }).length).toBeGreaterThan(0);
  });

  it('renders organizer dashboard when user role is organizer', () => {
    mockUser.role = USER_ROLES.ORGANIZER;
    render(<DashboardPage />);

    expect(screen.getByText('Organizer Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage your events and attendees')).toBeInTheDocument();
    // "My Events" appears in both Navigation and Dashboard content, so use getAllByText
    expect(screen.getAllByText('My Events').length).toBeGreaterThan(0);
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();

    // Buttons may appear in both Navigation and Dashboard, so use getAllByRole
    expect(screen.getAllByRole('button', { name: 'Create New Event' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'View My Events' }).length).toBeGreaterThan(0);
  });

  it('navigates to quick action routes when buttons are clicked', () => {
    mockUser.role = USER_ROLES.ADMIN;
    render(<DashboardPage />);

    const primaryButton = screen.getByRole('button', { name: 'View Pending Approvals' });
    const secondaryButton = screen.getByRole('button', { name: 'Manage Categories' });

    fireEvent.click(primaryButton);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.APPROVALS);

    fireEvent.click(secondaryButton);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.MANAGEMENT);
  });
});
