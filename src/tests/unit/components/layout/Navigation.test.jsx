import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navigation from '@components/layout/Navigation';
import { AuthProvider } from '@context/AuthContext';
import * as authService from '@services/authService';

vi.mock('@services/authService');

const renderWithProviders = (user, initialPath = '/') => {
  authService.validateSession.mockResolvedValue({
    valid: !!user,
    user: user
  });
  authService.getCurrentUser.mockReturnValue(user);

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders home navigation item for all users', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/home/i)).toBeInTheDocument();
    });
  });

  it('renders student-specific navigation items', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'student' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/browse events/i)).toBeInTheDocument();
      expect(screen.getByText(/my registrations/i)).toBeInTheDocument();
    });
  });

  it('renders organizer-specific navigation items', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'organizer' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/my events/i)).toBeInTheDocument();
      expect(screen.getByText(/create event/i)).toBeInTheDocument();
    });
  });

  it('renders admin-specific navigation items', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'admin' };
    renderWithProviders(user);

    await waitFor(() => {
      expect(screen.getByText(/approvals/i)).toBeInTheDocument();
      expect(screen.getByText(/management/i)).toBeInTheDocument();
      expect(screen.getByText(/analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/audit logs/i)).toBeInTheDocument();
    });
  });
});
