import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '@components/layout/Header';
import { AuthProvider } from '@context/AuthContext';
import * as authService from '@services/authService';
import * as notificationService from '@services/notificationService';

vi.mock('@services/authService');
vi.mock('@services/notificationService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderWithProviders = (user, unreadCount = 0) => {
  authService.validateSession.mockResolvedValue({
    valid: !!user,
    user: user
  });
  authService.getCurrentUser.mockReturnValue(user);
  notificationService.getUnreadCount.mockResolvedValue({
    success: true,
    data: { count: unreadCount }
  });

  return render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(authService, 'logout').mockImplementation(mockLogout);
  });

  it('renders user information and app name', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@umd.edu')).toBeInTheDocument();
      expect(screen.getByText(/terpspark/i)).toBeInTheDocument();
      expect(screen.getByText(/student/i)).toBeInTheDocument();
    });
  });

  it('renders header without user when user is not loaded', () => {
    renderWithProviders(null);
    expect(screen.getByText(/terpspark/i)).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('displays correct role badge for different roles', async () => {
    const organizer = { id: 2, email: 'org@umd.edu', name: 'Organizer User', role: 'organizer' };
    renderWithProviders(organizer);

    await waitFor(() => {
      const roleBadge = screen.getByText('Organizer', { selector: 'span' });
      expect(roleBadge).toBeInTheDocument();
    });
  });

  it('handles logout button click', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      const logoutButton = screen.getByLabelText('Logout');
      fireEvent.click(logoutButton);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('toggles mobile menu when menu button is clicked', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(document.querySelector('.md\\:hidden')).toBeInTheDocument();
    });
  });

  it('closes mobile menu when logout is clicked from mobile menu', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Toggle menu'));

    await waitFor(() => {
      expect(document.querySelector('.md\\:hidden')).toBeInTheDocument();
    });

    const logoutButtons = screen.getAllByText('Logout');
    const mobileLogoutButton = logoutButtons.find(btn => {
      const parent = btn.closest('.md\\:hidden, [class*="md:hidden"]');
      return parent !== null;
    });

    if (mobileLogoutButton) {
      fireEvent.click(mobileLogoutButton);
      expect(mockLogout).toHaveBeenCalled();
    }
  });

  it('handles error when loading unread count fails', async () => {
    notificationService.getUnreadCount.mockResolvedValue({
      success: false,
      error: 'Failed to load'
    });

    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    expect(notificationService.getUnreadCount).toHaveBeenCalled();
  });
});
