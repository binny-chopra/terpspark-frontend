import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@components/common/ProtectedRoute';
import { AuthProvider } from '@context/AuthContext';
import * as authService from '@services/authService';

vi.mock('@services/authService');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>
  };
});

const renderWithProviders = (ui, initialUser = null) => {
  if (initialUser) {
    authService.getCurrentUser.mockReturnValue(initialUser);
    authService.validateSession.mockResolvedValue({
      valid: true,
      user: initialUser
    });
  } else {
    authService.getCurrentUser.mockReturnValue(null);
    authService.validateSession.mockResolvedValue({
      valid: false,
      user: null
    });
  }

  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows loading spinner while checking authentication', () => {
    authService.validateSession.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', async () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/login');
    });
  });

  it('renders children when authenticated', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'student' };
    
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      user
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('allows access when user role is in allowedRoles', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'admin' };
    
    renderWithProviders(
      <ProtectedRoute allowedRoles={['admin', 'organizer']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      user
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  it('shows access denied when user role is not in allowedRoles', async () => {
    const user = { id: 1, email: 'test@umd.edu', role: 'student' };
    
    renderWithProviders(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      user
    );

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText(/don't have permission/i)).toBeInTheDocument();
    });
  });
});
