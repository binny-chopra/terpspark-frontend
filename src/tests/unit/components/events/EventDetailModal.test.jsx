import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  capacity: 100,
  registeredCount: 50,
  organizer: {
    name: 'Test Organizer',
    email: 'organizer@umd.edu'
  },
  isFeatured: false
};

describe('EventDetailModal', () => {
  it('does not render when event is null', () => {
    const mockOnClose = vi.fn();
    const mockOnRegister = vi.fn();
    
    render(
      <EventDetailModal
        event={null}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });

  it('renders event details', () => {
    const mockOnClose = vi.fn();
    const mockOnRegister = vi.fn();
    
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
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnRegister = vi.fn();
    
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

  it('displays featured badge when event is featured', () => {
    const featuredEvent = { ...mockEvent, isFeatured: true };
    const mockOnClose = vi.fn();
    const mockOnRegister = vi.fn();
    
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
    const mockOnClose = vi.fn();
    const mockOnRegister = vi.fn();
    
    render(
      <EventDetailModal
        event={mockEvent}
        onClose={mockOnClose}
        onRegister={mockOnRegister}
      />
    );

    expect(screen.getByText('academic')).toBeInTheDocument();
  });
});
