import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventCard from '@components/events/EventCard';

const mockEvent = {
  id: 1,
  title: 'Test Event',
  description: 'This is a test event description',
  category: 'academic',
  date: '2025-12-15',
  startTime: '14:00',
  endTime: '16:00',
  venue: 'Test Venue',
  capacity: 100,
  registeredCount: 50,
  organizer: {
    name: 'Test Organizer'
  },
  waitlistCount: 0
};

describe('EventCard', () => {
  it('renders event information', () => {
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/test event description/i)).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('Test Organizer')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    const card = screen.getByText('Test Event').closest('div');
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
  });

  it('displays capacity information', () => {
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    expect(screen.getByText(/50 \/ 100 registered/i)).toBeInTheDocument();
  });

  it('displays waitlist count when present', () => {
    const eventWithWaitlist = { ...mockEvent, waitlistCount: 5 };
    const mockOnClick = vi.fn();
    render(<EventCard event={eventWithWaitlist} onClick={mockOnClick} />);

    expect(screen.getByText(/5 on waitlist/i)).toBeInTheDocument();
  });

  it('does not display waitlist when count is 0', () => {
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    expect(screen.queryByText(/on waitlist/i)).not.toBeInTheDocument();
  });

  it('displays category badge', () => {
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    expect(screen.getByText('academic')).toBeInTheDocument();
  });

  it('displays status badge', () => {
    const mockOnClick = vi.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);

    // Status badge should be present (exact text depends on eventUtils)
    const badges = screen.getAllByText(/available|full|past|today/i);
    expect(badges.length).toBeGreaterThan(0);
  });
});
