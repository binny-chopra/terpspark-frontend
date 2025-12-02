import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitlistCard from '@components/registration/WaitlistCard';

describe('WaitlistCard', () => {
  const mockOnLeave = vi.fn();
  const mockWaitlistEntry = {
    id: 1,
    position: 5,
    notificationPreference: 'email_sms',
    joinedAt: '2025-01-01T10:00:00Z',
    event: {
      title: 'Test Event',
      category: { name: 'Academic', slug: 'academic' },
      date: '2025-12-15',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'Test Venue'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders waitlist information', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/waitlist position: #5/i)).toBeInTheDocument();
    expect(screen.getByText(/you're/i)).toBeInTheDocument();
    expect(screen.getByText(/on the waitlist/i)).toBeInTheDocument();
  });

  it('renders null when event is missing', () => {
    const { container } = render(
      <WaitlistCard waitlistEntry={{ ...mockWaitlistEntry, event: null }} onLeave={mockOnLeave} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('displays event details correctly', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('displays waitlist position', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    const positionText = screen.getByText(/waitlist position: #5/i);
    expect(positionText).toBeInTheDocument();
  });

  it('displays notification preference', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    const notificationText = screen.getByText(/email.*sms/i);
    expect(notificationText).toBeInTheDocument();
  });

  it('displays joined date', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    expect(screen.getByText(/Joined waitlist:/i)).toBeInTheDocument();
  });

  it('shows leave waitlist button', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    expect(screen.getByText('Leave Waitlist')).toBeInTheDocument();
  });

  it('shows confirmation modal when leave button is clicked', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    fireEvent.click(screen.getByText('Leave Waitlist'));

    expect(screen.getByText('Leave Waitlist?')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to leave the waitlist/i)).toBeInTheDocument();
  });

  it('calls onLeave when confirmed', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    fireEvent.click(screen.getByText('Leave Waitlist'));
    fireEvent.click(screen.getByText('Yes, Leave Waitlist'));

    expect(mockOnLeave).toHaveBeenCalledWith(1);
  });

  it('closes confirmation modal when stay button is clicked', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    fireEvent.click(screen.getByText('Leave Waitlist'));
    expect(screen.getByText('Leave Waitlist?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Stay on Waitlist'));

    expect(screen.queryByText('Leave Waitlist?')).not.toBeInTheDocument();
    expect(mockOnLeave).not.toHaveBeenCalled();
  });

  it('handles string category', () => {
    const entryWithStringCategory = {
      ...mockWaitlistEntry,
      event: {
        ...mockWaitlistEntry.event,
        category: 'Academic'
      }
    };

    render(<WaitlistCard waitlistEntry={entryWithStringCategory} onLeave={mockOnLeave} />);

    expect(screen.getByText('Academic')).toBeInTheDocument();
  });

  it('displays position in confirmation modal', () => {
    render(<WaitlistCard waitlistEntry={mockWaitlistEntry} onLeave={mockOnLeave} />);

    fireEvent.click(screen.getByText('Leave Waitlist'));

    const modalText = screen.getByText(/you'll lose your position/i).textContent;
    expect(modalText).toContain('#5');
  });
});
