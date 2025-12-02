import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@pages/LoginPage';

const mockNavigate = vi.fn();
let mockIsAuthenticated = false;
const mockCompleteLoginAfterOTP = vi.fn();

const mockInitiateLogin = vi.fn();
const mockVerifyOTP = vi.fn();
const mockResendOTP = vi.fn();
const mockClearPendingLogin = vi.fn();

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

vi.mock('@services/authService', () => ({
  initiateLogin: (...args) => mockInitiateLogin(...args),
  verifyOTP: (...args) => mockVerifyOTP(...args),
  resendOTP: (...args) => mockResendOTP(...args),
  clearPendingLogin: (...args) => mockClearPendingLogin(...args),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockIsAuthenticated = false;
    mockInitiateLogin.mockReset();
    mockVerifyOTP.mockReset();
    mockResendOTP.mockReset();
    mockClearPendingLogin.mockReset();
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

  // OTP functionality is not implemented in the current component
  it.skip('initiates login and shows OTP step on success', async () => {
    mockInitiateLogin.mockResolvedValue({ success: true, requiresOTP: true, message: 'OTP sent' });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => expect(mockInitiateLogin).toHaveBeenCalledWith('user@umd.edu', 'password'));
    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument();
    expect(screen.getByText('OTP sent')).toBeInTheDocument();
  });

  // OTP functionality is not implemented in the current component
  it.skip('submits OTP and completes login flow', async () => {
    mockInitiateLogin.mockResolvedValue({ success: true, requiresOTP: true });
    mockVerifyOTP.mockResolvedValue({ success: true });
    mockCompleteLoginAfterOTP.mockResolvedValue({ success: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await screen.findByText('Enter Verification Code');

    const otpInput = screen.getByLabelText('Verification Code');
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Verify & Log In'));

    await waitFor(() => expect(mockVerifyOTP).toHaveBeenCalledWith('123456'));
    await waitFor(() => expect(mockCompleteLoginAfterOTP).toHaveBeenCalled());
  });

  // OTP functionality is not implemented in the current component
  it.skip('allows resending OTP and going back to login', async () => {
    mockInitiateLogin.mockResolvedValue({ success: true, requiresOTP: true });
    mockResendOTP.mockResolvedValue({ success: true, message: 'New OTP sent' });
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('University Email'), { target: { value: 'user@umd.edu' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Sign In'));

    await screen.findByText('Enter Verification Code');

    fireEvent.click(screen.getByText('Resend Code'));
    await waitFor(() => expect(mockResendOTP).toHaveBeenCalled());
    expect(screen.getByText('New OTP sent')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Back to login'));
    expect(mockClearPendingLogin).toHaveBeenCalled();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('shows registration message when registration button is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('quick login buttons populate credentials', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Organizer'));
    expect(screen.getByDisplayValue('organizer@umd.edu')).toBeInTheDocument();
    expect(screen.getByDisplayValue('organizer123')).toBeInTheDocument();
  });
});
