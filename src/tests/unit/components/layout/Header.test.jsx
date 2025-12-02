import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

  return result;
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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

  it.skip('displays notification bell', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      const bellButtons = screen.getAllByLabelText(/notifications/i);
      expect(bellButtons.length).toBeGreaterThan(0);
    });
  });

  it.skip('shows unread count badge when there are unread notifications', async () => {
    const user = { id: 1, email: 'test@umd.edu', name: 'Test User', role: 'student' };
    renderWithProviders(user, 5);

    await waitFor(() => {
      const badges = screen.getAllByText('5');
      expect(badges.length).toBeGreaterThan(0);
    });
  });
});
