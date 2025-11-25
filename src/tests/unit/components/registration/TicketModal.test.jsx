import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TicketModal from '@components/registration/TicketModal';

describe('TicketModal', () => {
  it('renders when open', () => {
    const mockOnClose = vi.fn();
    const mockRegistration = {
      id: 1,
      ticketCode: 'TICKET123',
      qrCode: 'data:image/png;base64,test',
      event: {
        title: 'Test Event',
        venue: 'Test Venue',
        location: 'Test Location',
        date: '2025-12-15',
        startTime: '14:00',
        endTime: '16:00',
        organizer: {
          name: 'Test Organizer',
          email: 'organizer@umd.edu'
        }
      }
    };
    
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Your Ticket')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('TICKET123')).toBeInTheDocument();
  });
});
