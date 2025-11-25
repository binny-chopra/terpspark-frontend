import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast, { ToastContainer } from '@components/common/Toast';

describe('Toast', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders toast message', () => {
    render(<Toast message="Test message" onClose={mockOnClose} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    // Use real timers for user interaction
    vi.useRealTimers();
    const user = userEvent.setup();
    render(<Toast message="Test message" onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    // Restore fake timers
    vi.useFakeTimers();
  });

  it('auto-closes after duration', () => {
    render(<Toast message="Test message" duration={3000} onClose={mockOnClose} />);

    // Initially not called
    expect(mockOnClose).not.toHaveBeenCalled();

    // Advance timers to trigger the timeout
    vi.advanceTimersByTime(3000);
    
    // Should be called after advancing timers
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-close when duration is 0', () => {
    render(<Toast message="Test message" duration={0} onClose={mockOnClose} />);

    vi.advanceTimersByTime(5000);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders success toast with correct styling', () => {
    render(<Toast message="Success!" type="success" onClose={mockOnClose} />);
    const toast = screen.getByText('Success!').closest('div');
    expect(toast).toHaveClass('bg-green-50');
  });

  it('renders error toast with correct styling', () => {
    render(<Toast message="Error!" type="error" onClose={mockOnClose} />);
    const toast = screen.getByText('Error!').closest('div');
    expect(toast).toHaveClass('bg-red-50');
  });

  it('renders warning toast with correct styling', () => {
    render(<Toast message="Warning!" type="warning" onClose={mockOnClose} />);
    const toast = screen.getByText('Warning!').closest('div');
    expect(toast).toHaveClass('bg-orange-50');
  });

  it('renders info toast with correct styling', () => {
    render(<Toast message="Info!" type="info" onClose={mockOnClose} />);
    const toast = screen.getByText('Info!').closest('div');
    expect(toast).toHaveClass('bg-blue-50');
  });
});

describe('ToastContainer', () => {
  const mockRemoveToast = vi.fn();

  it('renders multiple toasts', () => {
    const toasts = [
      { id: 1, message: 'Toast 1', type: 'success', duration: 3000 },
      { id: 2, message: 'Toast 2', type: 'error', duration: 3000 }
    ];

    render(<ToastContainer toasts={toasts} removeToast={mockRemoveToast} />);

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  it('calls removeToast when toast is closed', async () => {
    const user = userEvent.setup();
    const toasts = [
      { id: 1, message: 'Toast 1', type: 'success', duration: 3000 }
    ];

    render(<ToastContainer toasts={toasts} removeToast={mockRemoveToast} />);

    const closeButton = screen.getAllByRole('button')[0];
    await user.click(closeButton);

    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });
});
