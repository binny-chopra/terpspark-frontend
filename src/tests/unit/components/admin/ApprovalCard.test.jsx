import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApprovalCard from '@components/admin/ApprovalCard';

const mockOrganizerItem = {
  id: 1,
  name: 'Test Organizer',
  email: 'organizer@umd.edu',
  department: 'Computer Science',
  submittedAt: '2025-01-01T10:00:00Z'
};

const mockEventItem = {
  id: 1,
  title: 'Test Event',
  organizer: {
    name: 'Test Organizer',
    email: 'organizer@umd.edu'
  },
  submittedAt: '2025-01-01T10:00:00Z'
};

describe('ApprovalCard', () => {
  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Organizer Approval', () => {
    it('renders organizer information', () => {
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText('Test Organizer')).toBeInTheDocument();
      expect(screen.getByText('organizer@umd.edu')).toBeInTheDocument();
      expect(screen.getByText(/computer science/i)).toBeInTheDocument();
    });

    it('opens notes modal when approve is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByText(/approve/i);
      await user.click(approveButton);

      await waitFor(() => {
        expect(screen.getByText(/approve organizer request/i)).toBeInTheDocument();
      });
    });

    it('calls onApprove with notes when submitted', async () => {
      const user = userEvent.setup();
      mockOnApprove.mockResolvedValue({ success: true });
      
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByText(/approve/i);
      await user.click(approveButton);

      await waitFor(() => {
        expect(screen.getByText(/approve organizer request/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByPlaceholderText(/optional notes/i);
      await user.type(notesInput, 'Looks good!');

      const submitButton = screen.getByText(/confirm approval/i);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnApprove).toHaveBeenCalledWith(1, 'Looks good!');
      });
    });
  });

  describe('Event Approval', () => {
    it('renders event information', () => {
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
  });
});
