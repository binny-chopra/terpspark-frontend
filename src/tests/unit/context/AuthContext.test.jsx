import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@context/AuthContext';
import * as authService from '@services/authService';
import { ROUTES } from '@utils/constants';

// Mock authService
vi.mock('@services/authService', () => ({
  validateSession: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn()
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Test component that uses useAuth hook
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">{auth.user ? JSON.stringify(auth.user) : 'null'}</div>
      <div data-testid="loading">{auth.loading ? 'true' : 'false'}</div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <button data-testid="login-btn" onClick={() => auth.login('test@example.com', 'password')}>
        Login
      </button>
      <button data-testid="complete-login-btn" onClick={() => auth.completeLoginAfterOTP()}>
        Complete Login
      </button>
      <button data-testid="logout-btn" onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
};

// Component to test useAuth error when used outside provider
const ComponentWithoutProvider = () => {
  useAuth();
  return <div>Should not render</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('AuthProvider', () => {
    it('should initialize with loading state and no user', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    it('should set user when validateSession returns valid session', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };
      authService.validateSession.mockResolvedValue({ valid: true, user: mockUser });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });

    it('should handle login successfully', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });
      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };
      authService.login.mockResolvedValue({ success: true, user: mockUser });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByTestId('login-btn');
      loginButton.click();

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });

    it('should handle login failure', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });
      authService.login.mockResolvedValue({ success: false, error: 'Invalid credentials' });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByTestId('login-btn');
      loginButton.click();

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });

    it('should complete login after OTP successfully', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });
      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };
      authService.getCurrentUser.mockReturnValue(mockUser);

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const completeLoginButton = screen.getByTestId('complete-login-btn');
      completeLoginButton.click();

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });

    it('should handle completeLoginAfterOTP failure when no user found', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });
      authService.getCurrentUser.mockReturnValue(null);

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      const completeLoginButton = screen.getByTestId('complete-login-btn');
      completeLoginButton.click();

      await waitFor(() => {
        expect(authService.getCurrentUser).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });

    it('should handle logout', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };
      authService.validateSession.mockResolvedValue({ valid: true, user: mockUser });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByTestId('logout-btn');
      logoutButton.click();

      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });

    it('should update isAuthenticated based on user state', async () => {
      authService.validateSession.mockResolvedValue({ valid: false });

      render(
        <BrowserRouter>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });

      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };
      authService.login.mockResolvedValue({ success: true, user: mockUser });

      const loginButton = screen.getByTestId('login-btn');
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <BrowserRouter>
            <ComponentWithoutProvider />
          </BrowserRouter>
        );
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});

