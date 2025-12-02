import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationCard from '@components/registration/RegistrationCard';

vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mock-image-data',
    width: 800,
    height: 600
  }))
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    internal: {
      pageSize: {
        getWidth: () => 210
      }
    }
  }))
}));

const mockRegistration = {
  id: 1,
  ticketCode: 'TICKET123',
  qrCode: 'data:image/png;base64,test',
  status: 'confirmed',
  checkInStatus: 'not_checked_in',
  event: {
    id: 1,
    title: 'Test Event',
    category: 'academic',
    date: '2025-12-15',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Test Venue',
    organizer: {
      name: 'Test Organizer',
      email: 'organizer@umd.edu'
    }
  },
  guests: []
};

describe('RegistrationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('does not render when event is null', () => {
    const registrationWithoutEvent = { ...mockRegistration, event: null };
    const { container } = render(
      <RegistrationCard
        registration={registrationWithoutEvent}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
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

  it('displays event details', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  it('displays status badge for upcoming event', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('displays status badge for today event', () => {
    // Use a date far in the future to ensure it's not past
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const futureDateString = futureDate.toISOString().split('T')[0];
    const futureRegistration = {
      ...mockRegistration,
      event: { 
        ...mockRegistration.event, 
        date: futureDateString,
        endTime: '23:59'
      }
    };

    render(
      <RegistrationCard
        registration={futureRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    // Should show "Upcoming" for future events
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('displays status badge for future event', () => {
    // Use a date far in the future to ensure it's not past
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const futureDateString = futureDate.toISOString().split('T')[0];
    const futureRegistration = {
      ...mockRegistration,
      event: { 
        ...mockRegistration.event, 
        date: futureDateString,
        endTime: '23:59'
      }
    };

    render(
      <RegistrationCard
        registration={futureRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    // Should show "Upcoming" for future events
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('displays status badge for cancelled registration', () => {
    const cancelledRegistration = {
      ...mockRegistration,
      status: 'cancelled'
    };

    render(
      <RegistrationCard
        registration={cancelledRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays status badge for completed event', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];
    const pastRegistration = {
      ...mockRegistration,
      event: {
        ...mockRegistration.event,
        date: pastDateString,
        endTime: '12:00'
      }
    };

    render(
      <RegistrationCard
        registration={pastRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows cancel button for confirmed upcoming events', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not show cancel button for past events', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];
    const pastRegistration = {
      ...mockRegistration,
      event: {
        ...mockRegistration.event,
        date: pastDateString,
        endTime: '12:00'
      }
    };

    render(
      <RegistrationCard
        registration={pastRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
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

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/Cancel Registration\?/i)).toBeInTheDocument();
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

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    const confirmButton = await screen.findByText(/Yes, Cancel Registration/i);
    await user.click(confirmButton);

    expect(mockOnCancel).toHaveBeenCalledWith(1);
  });

  it('closes cancel modal when keep registration is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/Cancel Registration\?/i)).toBeInTheDocument();
    });

    const keepButton = screen.getByText(/Keep Registration/i);
    await user.click(keepButton);

    await waitFor(() => {
      expect(screen.queryByText(/Cancel Registration\?/i)).not.toBeInTheDocument();
    });
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

    expect(screen.getByText(/Guests \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest 1.*guest1@umd.edu/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest 2.*guest2@umd.edu/i)).toBeInTheDocument();
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

    expect(screen.getByText(/Checked in at event/i)).toBeInTheDocument();
  });

  it('shows action buttons for confirmed upcoming events', () => {
    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText(/View QR Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
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

    const viewTicketButton = screen.getByText(/View QR Code/i);
    await user.click(viewTicketButton);

    expect(mockOnViewTicket).toHaveBeenCalledWith(mockRegistration);
  });

  it('downloads ticket as PDF', async () => {
    const jsPDF = (await import('jspdf')).default;
    const user = userEvent.setup();

    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    const downloadButton = screen.getByText(/Download/i);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalled();
    });

    const pdfInstance = jsPDF.mock.results[0].value;
    expect(pdfInstance.addImage).toHaveBeenCalled();
    expect(pdfInstance.save).toHaveBeenCalledWith('ticket-TICKET123.pdf');
  });

  it('handles download error gracefully', async () => {
    const html2canvas = (await import('html2canvas')).default;
    html2canvas.mockRejectedValueOnce(new Error('Canvas error'));
    const user = userEvent.setup();

    render(
      <RegistrationCard
        registration={mockRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const downloadButton = screen.getByText(/Download/i);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Failed to download ticket. Please try again.');
    });

    consoleError.mockRestore();
  });

  it('handles object category', () => {
    const registrationWithObjectCategory = {
      ...mockRegistration,
      event: {
        ...mockRegistration.event,
        category: { name: 'Career', slug: 'career' }
      }
    };

    render(
      <RegistrationCard
        registration={registrationWithObjectCategory}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.getByText('Career')).toBeInTheDocument();
  });

  it('does not show action buttons for past events', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];
    const pastRegistration = {
      ...mockRegistration,
      event: {
        ...mockRegistration.event,
        date: pastDateString,
        endTime: '12:00'
      }
    };

    render(
      <RegistrationCard
        registration={pastRegistration}
        onCancel={vi.fn()}
        onViewTicket={vi.fn()}
      />
    );

    expect(screen.queryByText(/View QR Code/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download/i)).not.toBeInTheDocument();
  });
});
