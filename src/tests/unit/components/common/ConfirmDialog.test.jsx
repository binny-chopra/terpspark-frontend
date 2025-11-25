import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from '@components/common/ConfirmDialog';

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Escape key is pressed', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom confirm and cancel text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test message"
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    expect(screen.getByText('No, Keep')).toBeInTheDocument();
  });

  it('hides cancel button when showCancelButton is false', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test message"
        showCancelButton={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });
});
