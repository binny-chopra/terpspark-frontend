import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationCard from '@components/registration/RegistrationCard';

const mockRegistration = {
  id: 1,
  ticketCode: 'TICKET123',
  status: 'confirmed',
  checkInStatus: 'not_checked_in',
  event: {
    id: 1,
    title: 'Test Event',
    category: 'academic',
    date: '2025-12-15',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Test Venue'
  },
  guests: []
};

describe('RegistrationCard', () => {
  it('does not render when event is null', () => {
    const registrationWithoutEvent = { ...mockRegistration, event: null };
    render(
      <RegistrationCard
        registration={registrationWithoutEvent}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });

  it('renders registration information', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('TICKET123')).toBeInTheDocument();
  });

  it('displays cancel button for confirmed, non-past events', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });

  it('shows cancel confirmation modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn();
    
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={mockOnCancel}
        onViewTicket={vi.fn()}
      />
    );

    // Find the cancel button by getting all buttons and filtering for the one with exact "Cancel" text
    const buttons = screen.getAllByRole('button');
    const cancelButton = buttons.find(btn => btn.textContent.trim() === 'Cancel');
    expect(cancelButton).toBeInTheDocument();
    await user.click(cancelButton);

    // Wait for modal to appear and check for the modal heading
    await waitFor(() => {
      expect(screen.getByText(/cancel registration\?/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancellation is confirmed', async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn();
    
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={mockOnCancel}
        onViewTicket={vi.fn()}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);

    const confirmButton = screen.getByText(/yes, cancel registration/i);
    await user.click(confirmButton);

    expect(mockOnCancel).toHaveBeenCalledWith(1);
  });

  it('displays guests when present', () => {
    const registrationWithGuests = {
      ...mockRegistration,
      guests: [
        { name: 'Guest 1', email: 'guest1@umd.edu' },
        { name: 'Guest 2', email: 'guest2@umd.edu' }
      ]
    };

    render(
      <RegistrationCard
        registration={registrationWithGuests}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText(/guests \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/guest 1/i)).toBeInTheDocument();
    expect(screen.getByText(/guest 2/i)).toBeInTheDocument();
  });

  it('displays check-in status when checked in', () => {
    const checkedInRegistration = {
      ...mockRegistration,
      checkInStatus: 'checked_in'
    };

    render(
      <RegistrationCard
        registration={checkedInRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText(/checked in at event/i)).toBeInTheDocument();
  });

  it('calls onViewTicket when view QR code button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnViewTicket = vi.fn();
    
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={mockOnViewTicket}
      />
    );

    const viewTicketButton = screen.getByText(/view qr code/i);
    await user.click(viewTicketButton);

    expect(mockOnViewTicket).toHaveBeenCalledWith(mockRegistration);
  });
});
