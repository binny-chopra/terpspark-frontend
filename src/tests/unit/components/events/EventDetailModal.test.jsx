import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventDetailModal from '@components/events/EventDetailModal';

const mockEvent = {
  id: 1,
  title: 'Test Event',
  description: 'Test description',
  category: 'academic',
  date: '2025-12-15',
  startTime: '14:00',
  endTime: '16:00',
  venue: 'Test Venue',
  location: 'Test Location',
  capacity: 100,
  registeredCount: 50,
  waitlistCount: 0,
  organizer: {
    name: 'Test Organizer',
    email: 'organizer@umd.edu'
  },
  isFeatured: false,
  tags: []
};

describe('EventDetailModal', () => {
  const mockOnClose = vi.fn();
  const mockOnRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when event is null', () => {
    const { container } = render(
      <EventDetailModal
        event={null}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders event details', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('displays organizer information', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('Test Organizer')).toBeInTheDocument();
    expect(screen.getByText('organizer@umd.edu')).toBeInTheDocument();
  });

  it('displays capacity information', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText(/registered: 50/i)).toBeInTheDocument();
    expect(screen.getByText(/total: 100/i)).toBeInTheDocument();
    expect(screen.getByText(/spots remaining/i)).toBeInTheDocument();
  });

  it('displays featured badge when event is featured', () => {
    const featuredEvent = { ...mockEvent, isFeatured: true };
    render(
      <EventDetailModal
        event={featuredEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('displays category and status badges', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('academic')).toBeInTheDocument();
  });

  it('displays tags when present', () => {
    const eventWithTags = {
      ...mockEvent,
      tags: ['networking', 'career', 'professional']
    };

    render(
      <EventDetailModal
        event={eventWithTags}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('networking')).toBeInTheDocument();
    expect(screen.getByText('career')).toBeInTheDocument();
    expect(screen.getByText('professional')).toBeInTheDocument();
  });

  it('does not display tags section when no tags', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.queryByText(/tags/i)).not.toBeInTheDocument();
  });

  it('displays waitlist count when present', () => {
    const eventWithWaitlist = {
      ...mockEvent,
      waitlistCount: 10
    };

    render(
      <EventDetailModal
        event={eventWithWaitlist}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/people are currently on the waitlist/i)).toBeInTheDocument();
  });

  it('does not display waitlist section when count is 0', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.queryByText(/waitlist/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    const closeButton = screen.getByLabelText(/close modal/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button in footer is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows register button for non-admin/non-organizer users when event is not full', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'student' }}
      />
    );

    expect(screen.getByText(/register for event/i)).toBeInTheDocument();
  });

  it('shows join waitlist button when event is full', () => {
    const fullEvent = {
      ...mockEvent,
      capacity: 100,
      registeredCount: 100
    };

    render(
      <EventDetailModal
        event={fullEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'student' }}
      />
    );

    expect(screen.getByText(/join waitlist/i)).toBeInTheDocument();
  });

  it('calls onRegister when register button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'student' }}
      />
    );

    const registerButton = screen.getByText(/register for event/i);
    await user.click(registerButton);

    expect(mockOnRegister).toHaveBeenCalledWith(mockEvent);
  });

  it('calls onRegister when join waitlist button is clicked', async () => {
    const user = userEvent.setup();
    const fullEvent = {
      ...mockEvent,
      capacity: 100,
      registeredCount: 100
    };

    render(
      <EventDetailModal
        event={fullEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'student' }}
      />
    );

    const waitlistButton = screen.getByText(/join waitlist/i);
    await user.click(waitlistButton);

    expect(mockOnRegister).toHaveBeenCalledWith(fullEvent);
  });

  it('does not show register button for admin users', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'admin' }}
      />
    );

    expect(screen.queryByText(/register for event/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/join waitlist/i)).not.toBeInTheDocument();
  });

  it('does not show register button for organizer users', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
        user={{ role: 'organizer' }}
      />
    );

    expect(screen.queryByText(/register for event/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/join waitlist/i)).not.toBeInTheDocument();
  });

  it('does not show register button when onRegister is not provided', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        user={{ role: 'student' }}
      />
    );

    expect(screen.queryByText(/register for event/i)).not.toBeInTheDocument();
  });

  it('handles object category', () => {
    const eventWithObjectCategory = {
      ...mockEvent,
      category: { name: 'Career', slug: 'career' }
    };

    render(
      <EventDetailModal
        event={eventWithObjectCategory}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('Career')).toBeInTheDocument();
  });

  it('displays capacity percentage bar', () => {
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    const progressBar = screen.getByText(/spots remaining/i).closest('.space-y-2').querySelector('.bg-gray-200');
    expect(progressBar).toBeInTheDocument();
  });
});
