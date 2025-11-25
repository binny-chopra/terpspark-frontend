import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '@pages/DashboardPage';
import { USER_ROLES, ROUTES } from '@utils/constants';

const mockNavigate = vi.fn();
const mockUser = { id: 'u-1', name: 'Test User', role: USER_ROLES.STUDENT };

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@components/layout/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('@components/layout/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
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
    expect(screen.getByText('My Registrations')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Browse Events' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View My Registrations' })).toBeInTheDocument();
  });

  it('renders organizer dashboard when user role is organizer', () => {
    mockUser.role = USER_ROLES.ORGANIZER;
    render(<DashboardPage />);

    expect(screen.getByText('Organizer Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage your events and attendees')).toBeInTheDocument();
    expect(screen.getByText('My Events')).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Create New Event' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View My Events' })).toBeInTheDocument();
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
