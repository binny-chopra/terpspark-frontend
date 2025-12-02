import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '@context/ToastContext';

const TestComponent = ({ message, type, duration }) => {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast(message, type, duration)}>
      Add Toast
    </button>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ToastProvider with children', () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('adds and displays a toast with default type', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Test message" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    const toast = screen.getByText('Test message').closest('div');
    expect(toast).toHaveClass('bg-gray-900');
  });

  it('adds and displays a success toast', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Success!" type="success" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    const toast = screen.getByText('Success!').closest('div');
    expect(toast).toHaveClass('bg-green-600');
  });

  it('adds and displays an error toast', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Error occurred" type="error" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    const toast = screen.getByText('Error occurred').closest('div');
    expect(toast).toHaveClass('bg-red-600');
  });

  it('adds and displays a warning toast', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Warning message" type="warning" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    const toast = screen.getByText('Warning message').closest('div');
    expect(toast).toHaveClass('bg-amber-500');
  });

  it('adds and displays an info toast', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Info message" type="info" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    const toast = screen.getByText('Info message').closest('div');
    expect(toast).toHaveClass('bg-gray-900');
  });

  it('displays multiple toasts simultaneously', async () => {
    render(
      <ToastProvider>
        <TestComponent message="First toast" />
        <TestComponent message="Second toast" />
      </ToastProvider>
    );

    const buttons = screen.getAllByText('Add Toast');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      expect(screen.getByText('First toast')).toBeInTheDocument();
      expect(screen.getByText('Second toast')).toBeInTheDocument();
    });
  });

  it('removes toast automatically after duration', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Auto remove" duration={100} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Auto remove')).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Auto remove')).not.toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it('removes toast when close button is clicked', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Close me" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Close me')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Close me')).not.toBeInTheDocument();
    });
  });

  it('uses default duration of 3000ms when not specified', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Default duration" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Default duration')).toBeInTheDocument();
    });

    const toast = screen.getByText('Default duration').closest('div');
    const progressBar = toast.querySelector('.toast-progress');
    expect(progressBar).toHaveStyle({ animationDuration: '3000ms' });
  });

  it('uses custom duration when specified', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Custom duration" duration={5000} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Custom duration')).toBeInTheDocument();
    });

    const toast = screen.getByText('Custom duration').closest('div');
    const progressBar = toast.querySelector('.toast-progress');
    expect(progressBar).toHaveStyle({ animationDuration: '5000ms' });
  });

  it('handles unknown toast type by defaulting to info', async () => {
    render(
      <ToastProvider>
        <TestComponent message="Unknown type" type="unknown" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    await waitFor(() => {
      expect(screen.getByText('Unknown type')).toBeInTheDocument();
    });

    const toast = screen.getByText('Unknown type').closest('div');
    expect(toast).toHaveClass('bg-gray-900');
  });

  it('provides addToast function through useToast hook', () => {
    const TestHook = () => {
      const { addToast } = useToast();
      expect(typeof addToast).toBe('function');
      return <div>Hook works</div>;
    };

    render(
      <ToastProvider>
        <TestHook />
      </ToastProvider>
    );

    expect(screen.getByText('Hook works')).toBeInTheDocument();
  });
});

