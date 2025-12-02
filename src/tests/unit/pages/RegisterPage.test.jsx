import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@pages/RegisterPage';

const mockNavigate = vi.fn();
const mockAddToast = vi.fn();
const mockRegister = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@context/ToastContext', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock('@services/authService', () => ({
  register: (...args) => mockRegister(...args),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form with all fields', () => {
    render(<RegisterPage />);

    expect(screen.getByText(/Create your/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('yourname@umd.edu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Computer Science')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 234 567 8900')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('shows validation error for name less than 2 characters', async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('John Doe');
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email domain', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Use your UMD or terpmail email')).toBeInTheDocument();
    });
  });

  it('accepts @umd.edu email domain', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText('yourname@umd.edu');
    fireEvent.change(emailInput, { target: { value: 'test@umd.edu' } });

    expect(emailInput).toHaveValue('test@umd.edu');
  });

  it('accepts @terpmail.umd.edu email domain', async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText('yourname@umd.edu');
    fireEvent.change(emailInput, { target: { value: 'test@terpmail.umd.edu' } });

    expect(emailInput).toHaveValue('test@terpmail.umd.edu');
  });

  it('shows validation error for password less than 8 characters', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('shows validation error for department exceeding 100 characters', async () => {
    render(<RegisterPage />);

    const departmentInput = screen.getByPlaceholderText('Computer Science');
    const longDepartment = 'A'.repeat(101);
    fireEvent.change(departmentInput, { target: { value: longDepartment } });
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Max 100 characters')).toBeInTheDocument();
    });
  });

  it('shows validation error for phone exceeding 20 characters', async () => {
    render(<RegisterPage />);

    const phoneInput = screen.getByPlaceholderText('+1 234 567 8900');
    const longPhone = '1'.repeat(21);
    fireEvent.change(phoneInput, { target: { value: longPhone } });
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Max 20 characters')).toBeInTheDocument();
    });
  });

  it('clears error when user starts typing in field', async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText('John Doe');
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'test@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    await waitFor(() => {
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });
  });

  it('allows selecting student role', () => {
    render(<RegisterPage />);

    const roleLabel = screen.getByText('Role');
    const roleSelect = roleLabel.parentElement.querySelector('select');
    expect(roleSelect).toHaveValue('student');
    fireEvent.change(roleSelect, { target: { value: 'organizer' } });
    expect(roleSelect).toHaveValue('organizer');
  });

  it('submits registration successfully for student', async () => {
    mockRegister.mockResolvedValue({ success: true });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'john@umd.edu',
        password: 'password123',
        name: 'John Doe',
        role: 'student',
        department: undefined,
        phone: undefined
      });
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Registration successful. Please sign in.', 'success');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('submits registration successfully for organizer', async () => {
    mockRegister.mockResolvedValue({ success: true });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane Organizer' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'jane@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    const roleLabel = screen.getByText('Role');
    const roleSelect = roleLabel.parentElement.querySelector('select');
    fireEvent.change(roleSelect, { target: { value: 'organizer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'jane@umd.edu',
        password: 'password123',
        name: 'Jane Organizer',
        role: 'organizer',
        department: undefined,
        phone: undefined
      });
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        'Registration submitted. Organizer accounts require admin approval.',
        'warning'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('includes optional fields when provided', async () => {
    mockRegister.mockResolvedValue({ success: true });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Computer Science'), { target: { value: 'Computer Science' } });
    fireEvent.change(screen.getByPlaceholderText('+1 234 567 8900'), { target: { value: '+1 234 567 8900' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'john@umd.edu',
        password: 'password123',
        name: 'John Doe',
        role: 'student',
        department: 'Computer Science',
        phone: '+1 234 567 8900'
      });
    });
  });

  it('shows error toast when registration fails', async () => {
    mockRegister.mockResolvedValue({ success: false, error: 'Email already exists' });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Email already exists', 'error');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('shows generic error toast when registration fails without error message', async () => {
    mockRegister.mockResolvedValue({ success: false });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Registration failed', 'error');
    });
  });

  it('shows loading state during registration', async () => {
    mockRegister.mockImplementation(() => new Promise(() => {}));

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Registering...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Registering...' })).toBeDisabled();
    });
  });

  it('disables form fields during loading', async () => {
    mockRegister.mockImplementation(() => new Promise(() => {}));

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('yourname@umd.edu'), { target: { value: 'john@umd.edu' } });
    fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('John Doe')).toBeDisabled();
      expect(screen.getByPlaceholderText('yourname@umd.edu')).toBeDisabled();
      expect(screen.getByPlaceholderText('At least 8 characters')).toBeDisabled();
    });
  });

  it('navigates to login when sign in link is clicked', () => {
    render(<RegisterPage />);

    const signInLink = screen.getByText('Sign in');
    fireEvent.click(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not submit form when validation fails', async () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });
});

