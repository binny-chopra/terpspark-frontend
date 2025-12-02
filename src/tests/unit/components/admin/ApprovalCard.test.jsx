import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApprovalCard from '@components/admin/ApprovalCard';

const mockOrganizerItem = {
  id: 1,
  name: 'Test Organizer',
  email: 'organizer@umd.edu',
  department: 'Computer Science',
  reason: 'Want to organize events for my department',
  requestedAt: '2025-01-01T10:00:00Z'
};

const mockEventItem = {
  id: 1,
  title: 'Test Event',
  description: 'Test event description',
  category: 'academic',
  date: '2025-12-15',
  startTime: '14:00',
  endTime: '16:00',
  venue: 'Test Venue',
  capacity: 100,
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
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('displays organizer reason', () => {
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText(/Want to organize events/i)).toBeInTheDocument();
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

    it('opens notes modal when reject is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        expect(screen.getByText(/reject organizer request/i)).toBeInTheDocument();
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

    it('calls onReject with notes when submitted', async () => {
      const user = userEvent.setup();
      mockOnReject.mockResolvedValue({ success: true });
      
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        expect(screen.getByText(/reject organizer request/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByPlaceholderText(/reason for rejection/i);
      await user.type(notesInput, 'Incomplete information');

      const submitButton = screen.getByText(/confirm rejection/i);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnReject).toHaveBeenCalledWith(1, 'Incomplete information');
      });
    });

    it('disables reject button when notes are empty', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockOrganizerItem}
          type="organizer"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        const submitButton = screen.getByText(/confirm rejection/i);
        expect(submitButton).toBeDisabled();
      });
    });

    it('closes modal when cancel is clicked', async () => {
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

      const cancelButton = screen.getByText(/cancel/i);
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/approve organizer request/i)).not.toBeInTheDocument();
      });
    });

    it('shows processing state during submission', async () => {
      const user = userEvent.setup();
      mockOnApprove.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
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

      const submitButton = screen.getByText(/confirm approval/i);
      await user.click(submitButton);

      expect(screen.getByText(/processing/i)).toBeInTheDocument();
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
      expect(screen.getByText('Test event description')).toBeInTheDocument();
      expect(screen.getByText(/pending review/i)).toBeInTheDocument();
    });

    it('displays event details', () => {
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText('Test Venue')).toBeInTheDocument();
      expect(screen.getByText(/capacity: 100/i)).toBeInTheDocument();
    });

    it('displays organizer information', () => {
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText(/submitted by/i)).toBeInTheDocument();
      expect(screen.getByText('Test Organizer')).toBeInTheDocument();
      expect(screen.getByText('organizer@umd.edu')).toBeInTheDocument();
    });

    it('handles object category', () => {
      const eventWithObjectCategory = {
        ...mockEventItem,
        category: { name: 'Career', slug: 'career' }
      };

      render(
        <ApprovalCard
          item={eventWithObjectCategory}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText('Career')).toBeInTheDocument();
    });

    it('handles missing organizer', () => {
      const eventWithoutOrganizer = {
        ...mockEventItem,
        organizer: null
      };

      render(
        <ApprovalCard
          item={eventWithoutOrganizer}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByText(/unknown organizer/i)).toBeInTheDocument();
    });

    it('opens notes modal when approve is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByText(/approve.*publish/i);
      await user.click(approveButton);

      await waitFor(() => {
        expect(screen.getByText(/approve.*publish.*event/i)).toBeInTheDocument();
      });
    });

    it('opens notes modal when reject is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        expect(screen.getByText(/reject event/i)).toBeInTheDocument();
      });
    });

    it('calls onApprove with notes when submitted', async () => {
      const user = userEvent.setup();
      mockOnApprove.mockResolvedValue({ success: true });
      
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByText(/approve.*publish/i);
      await user.click(approveButton);

      await waitFor(() => {
        expect(screen.getByText(/approve.*publish.*event/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByPlaceholderText(/optional notes/i);
      await user.type(notesInput, 'Approved!');

      const submitButtons = screen.getAllByText(/publish event/i);
      await user.click(submitButtons[submitButtons.length - 1]);

      await waitFor(() => {
        expect(mockOnApprove).toHaveBeenCalledWith(1, 'Approved!');
      });
    });

    it('calls onReject with notes when submitted', async () => {
      const user = userEvent.setup();
      mockOnReject.mockResolvedValue({ success: true });
      
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        expect(screen.getByText(/reject event/i)).toBeInTheDocument();
      });

      const notesInput = screen.getByPlaceholderText(/feedback for organizer/i);
      await user.type(notesInput, 'Needs more details');

      const submitButton = screen.getByText(/confirm rejection/i);
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnReject).toHaveBeenCalledWith(1, 'Needs more details');
      });
    });

    it('disables reject button when notes are empty', async () => {
      const user = userEvent.setup();
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByText(/reject/i);
      await user.click(rejectButton);

      await waitFor(() => {
        const submitButton = screen.getByText(/confirm rejection/i);
        expect(submitButton).toBeDisabled();
      });
    });

    it('shows processing state during submission', async () => {
      const user = userEvent.setup();
      mockOnApprove.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <ApprovalCard
          item={mockEventItem}
          type="event"
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByText(/approve.*publish/i);
      await user.click(approveButton);

      await waitFor(() => {
        expect(screen.getByText(/approve.*publish.*event/i)).toBeInTheDocument();
      });

      const submitButtons = screen.getAllByText(/publish event/i);
      await user.click(submitButtons[submitButtons.length - 1]);

      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });
});
