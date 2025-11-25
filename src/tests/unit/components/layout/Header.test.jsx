import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from '@components/layout/Header';
import { AuthProvider } from '@context/AuthContext';
import * as authService from '@services/authService';
import * as notificationService from '@services/notificationService';

vi.mock('@services/authService');
vi.mock('@services/notificationService');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

const renderWithProviders = (user, unreadCount = 0) => {
  // Set up mocks before rendering
  authService.validateSession.mockResolvedValue({
    valid: !!user,
    user: user
  });
  authService.getCurrentUser.mockReturnValue(user);
  notificationService.getUnreadCount.mockResolvedValue({
    success: true,
    data: { count: unreadCount }
  });

  const result = render(
    <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
    </BrowserRouter>
  );

  // Wait for AuthContext to initialize
  return result;
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders app name', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/terpspark/i)).toBeInTheDocument();
    });
  });

  it('displays user name and email', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@umd.edu')).toBeInTheDocument();
    });
  });

  it('displays role badge', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'admin' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/admin/i)).toBeInTheDocument();
    });
  });

  it('displays notification bell', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      // There might be multiple notification bells (desktop and mobile), so use getAllByLabelText
      const bellButtons = screen.getAllByLabelText(/notifications/i);
      expect(bellButtons.length).toBeGreaterThan(0);
    });
  });

  it('shows unread count badge when there are unread notifications', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user, 5);

    await waitFor(() => {
      // There might be multiple "5" badges (desktop and mobile), so use getAllByText
      const badges = screen.getAllByText('5');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  it('shows 9+ when unread count exceeds 9', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user, 15);

    await waitFor(() => {
      // There might be multiple "9+" badges (desktop and mobile), so use getAllByText
      const badges = screen.getAllByText('9+');
      expect(badges.length).toBeGreaterThan(0);
    });
  });
});
