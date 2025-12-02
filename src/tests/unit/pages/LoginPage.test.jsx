import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@pages/LoginPage';

const mockNavigate = vi.fn();
let mockIsAuthenticated = false;
const mockLogin = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/login' }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it('redirects to dashboard when already authenticated', () => {
    mockIsAuthenticated = true;
    render(<LoginPage />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });

  it('shows validation error for missing credentials', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Please enter both email and password')).toBeInTheDocument();
  });

  it('shows error for invalid email domain', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Please use a valid UMD email address')).toBeInTheDocument();
  });

  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    expect(signInButton).toBeDisabled();
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('clears error when user starts typing', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'new@umd.edu' } });

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('submits form when Enter key is pressed in email field', async () => {
    mockLogin.mockResolvedValue({ success: true });
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('University Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'user@umd.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.keyPress(emailInput, { key: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@umd.edu', 'password');
    });
  });

  it('submits form when Enter key is pressed in password field', async () => {
    mockLogin.mockResolvedValue({ success: true });
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('University Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'user@umd.edu' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.keyPress(passwordInput, { key: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@umd.edu', 'password');
    });
  });

  it('disables buttons during loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
    });
  });

  it('shows registration message when registration button is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('populates credentials for student quick login', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Student'));
    expect(screen.getByDisplayValue('student@umd.edu')).toBeInTheDocument();
    expect(screen.getByDisplayValue('student123')).toBeInTheDocument();
  });

  it('populates credentials for organizer quick login', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Organizer'));
    expect(screen.getByDisplayValue('organizer@umd.edu')).toBeInTheDocument();
    expect(screen.getByDisplayValue('organizer123')).toBeInTheDocument();
  });

  it('populates credentials for admin quick login', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Admin'));
    expect(screen.getByDisplayValue('admin@umd.edu')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin123')).toBeInTheDocument();
  });
});
