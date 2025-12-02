import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import Toast, { ToastContainer, useToast } from '@components/common/Toast';

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

  it('renders toast with different types', () => {
    const toasts = [
      { id: 1, message: 'Success', type: 'success', duration: 3000 },
      { id: 2, message: 'Error', type: 'error', duration: 3000 },
      { id: 3, message: 'Warning', type: 'warning', duration: 3000 },
      { id: 4, message: 'Info', type: 'info', duration: 3000 }
    ];

    render(<ToastContainer toasts={toasts} removeToast={mockRemoveToast} />);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('renders empty container when no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} removeToast={mockRemoveToast} />);
    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
    expect(screen.queryByText(/Toast/i)).not.toBeInTheDocument();
  });
});

describe('Toast component types', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders success toast with correct styles', () => {
    render(<Toast message="Success message" type="success" onClose={mockOnClose} />);
    const toast = screen.getByText('Success message').closest('div');
    expect(toast).toHaveClass('bg-green-50', 'text-green-800', 'border-green-200');
  });

  it('renders error toast with correct styles', () => {
    render(<Toast message="Error message" type="error" onClose={mockOnClose} />);
    const toast = screen.getByText('Error message').closest('div');
    expect(toast).toHaveClass('bg-red-50', 'text-red-800', 'border-red-200');
  });

  it('renders warning toast with correct styles', () => {
    render(<Toast message="Warning message" type="warning" onClose={mockOnClose} />);
    const toast = screen.getByText('Warning message').closest('div');
    expect(toast).toHaveClass('bg-orange-50', 'text-orange-800', 'border-orange-200');
  });

  it('renders info toast with correct styles', () => {
    render(<Toast message="Info message" type="info" onClose={mockOnClose} />);
    const toast = screen.getByText('Info message').closest('div');
    expect(toast).toHaveClass('bg-blue-50', 'text-blue-800', 'border-blue-200');
  });

  it('renders default toast when type is unknown', () => {
    render(<Toast message="Default message" type="unknown" onClose={mockOnClose} />);
    const toast = screen.getByText('Default message').closest('div');
    expect(toast).toHaveClass('bg-blue-50', 'text-blue-800', 'border-blue-200');
  });
});

describe('useToast hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds toast and returns id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const id = result.current.addToast('Test message', 'info', 3000);
      expect(id).toBeDefined();
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test message');
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('removes toast by id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const id = result.current.addToast('Test message');
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('auto-removes toast after duration', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message', 'info', 3000);
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('does not auto-remove when duration is 0', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Test message', 'info', 0);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('provides convenience methods', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message');
      result.current.error('Error message');
      result.current.warning('Warning message');
      result.current.info('Info message');
    });

    expect(result.current.toasts).toHaveLength(4);
    expect(result.current.toasts[0].type).toBe('success');
    expect(result.current.toasts[1].type).toBe('error');
    expect(result.current.toasts[2].type).toBe('warning');
    expect(result.current.toasts[3].type).toBe('info');
  });

  it('allows custom duration in convenience methods', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success message', 5000);
    });

    expect(result.current.toasts[0].duration).toBe(5000);
  });
});
