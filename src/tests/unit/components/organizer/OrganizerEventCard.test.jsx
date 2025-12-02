import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrganizerEventCard from '@components/organizer/OrganizerEventCard';

const mockEvent = {
  id: 1,
  title: 'Test Event',
  date: '2025-12-15',
  category: 'academic',
  venue: 'Test Venue',
  registeredCount: 50,
  capacity: 100,
  status: 'published',
  waitlistCount: 5,
  createdAt: '2025-01-01T00:00:00Z'
};

describe('OrganizerEventCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnDuplicate = vi.fn();
  const mockOnViewAttendees = vi.fn();
  const mockOnSendForApproval = vi.fn();
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders event information', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('displays status badge for published event', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('displays status badge for draft event', () => {
    const draftEvent = { ...mockEvent, status: 'draft' };
    render(
      <OrganizerEventCard 
        event={draftEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('displays status badge for pending event', () => {
    const pendingEvent = { ...mockEvent, status: 'pending' };
    render(
      <OrganizerEventCard 
        event={pendingEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
  });

  it('displays status badge for cancelled event', () => {
    const cancelledEvent = { ...mockEvent, status: 'cancelled' };
    render(
      <OrganizerEventCard 
        event={cancelledEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays registration stats for published event', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText(/50.*100/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrations/i)).toBeInTheDocument();
  });

  it('displays waitlist count when present', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/on waitlist/i)).toBeInTheDocument();
  });

  it('does not display waitlist when count is 0', () => {
    const eventWithoutWaitlist = { ...mockEvent, waitlistCount: 0 };
    render(
      <OrganizerEventCard 
        event={eventWithoutWaitlist} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.queryByText(/on waitlist/i)).not.toBeInTheDocument();
  });

  it('displays pending approval message for pending event', () => {
    const pendingEvent = { ...mockEvent, status: 'pending' };
    render(
      <OrganizerEventCard 
        event={pendingEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText(/Waiting for admin approval/i)).toBeInTheDocument();
  });

  it('displays draft message and send for approval button for draft event', () => {
    const draftEvent = { ...mockEvent, status: 'draft' };
    render(
      <OrganizerEventCard 
        event={draftEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
        onSendForApproval={mockOnSendForApproval}
      />
    );

    expect(screen.getByText(/Complete and submit for approval/i)).toBeInTheDocument();
    expect(screen.getByText(/Send for Approval/i)).toBeInTheDocument();
  });

  it('calls onSendForApproval when send for approval button is clicked', async () => {
    const user = userEvent.setup();
    const draftEvent = { ...mockEvent, status: 'draft' };
    render(
      <OrganizerEventCard 
        event={draftEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
        onSendForApproval={mockOnSendForApproval}
      />
    );

    const sendButton = screen.getByText(/Send for Approval/i);
    await user.click(sendButton);

    expect(mockOnSendForApproval).toHaveBeenCalledWith(draftEvent);
  });

  it('displays cancelled message for cancelled event', () => {
    const cancelledEvent = { ...mockEvent, status: 'cancelled' };
    render(
      <OrganizerEventCard 
        event={cancelledEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText(/This event has been cancelled/i)).toBeInTheDocument();
  });

  it('opens menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    expect(screen.getByText(/Duplicate/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const draftEvent = { ...mockEvent, status: 'draft' };
    
    render(
      <OrganizerEventCard 
        event={draftEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    const editButton = screen.getByText(/Edit Event/i);
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(draftEvent.id);
  });

  it('calls onViewAttendees when view attendees button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    const viewAttendeesButton = screen.getByText(/View Attendees/i);
    await user.click(viewAttendeesButton);

    expect(mockOnViewAttendees).toHaveBeenCalledWith(mockEvent.id);
  });

  it('calls onDuplicate when duplicate button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    const duplicateButton = screen.getByText(/Duplicate/i);
    await user.click(duplicateButton);

    expect(mockOnDuplicate).toHaveBeenCalledWith(mockEvent.id);
  });

  it('calls onCancel when cancel event button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    const cancelButton = screen.getByText(/Cancel Event/i);
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledWith(mockEvent.id);
  });

  it('does not show edit button for published events', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    expect(screen.queryByText(/Edit Event/i)).not.toBeInTheDocument();
  });

  it('does not show cancel event button for draft events', async () => {
    const user = userEvent.setup();
    const draftEvent = { ...mockEvent, status: 'draft' };
    render(
      <OrganizerEventCard 
        event={draftEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    expect(screen.queryByText(/Cancel Event/i)).not.toBeInTheDocument();
  });

  it('calls onViewDetails when card is clicked', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
        onViewDetails={mockOnViewDetails}
      />
    );

    const card = screen.getByText('Test Event').closest('.cursor-pointer');
    fireEvent.click(card);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockEvent);
  });

  it('handles object category', () => {
    const eventWithObjectCategory = {
      ...mockEvent,
      category: { name: 'Career', slug: 'career' }
    };
    render(
      <OrganizerEventCard 
        event={eventWithObjectCategory} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText('Career')).toBeInTheDocument();
  });

  it('displays created date', () => {
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    expect(screen.getByText(/Created:/i)).toBeInTheDocument();
  });

  it('closes menu when X button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <OrganizerEventCard 
        event={mockEvent} 
        onEdit={mockOnEdit}
        onCancel={mockOnCancel}
        onDuplicate={mockOnDuplicate}
        onViewAttendees={mockOnViewAttendees}
      />
    );

    const menuButton = screen.getAllByRole('button')[0];
    await user.click(menuButton);

    expect(screen.getByText(/Duplicate/i)).toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.queryByText(/Duplicate/i)).not.toBeInTheDocument();
  });
});
