import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TicketModal from '@components/registration/TicketModal';

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

describe('TicketModal', () => {
  const mockOnClose = vi.fn();
  const mockRegistration = {
    id: 1,
    ticketCode: 'TICKET123',
    qrCode: 'data:image/png;base64,test',
    guests: [
      { name: 'Guest One', email: 'guest1@umd.edu' },
      { name: 'Guest Two', email: 'guest2@umd.edu' }
    ],
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

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('renders ticket modal with event details', () => {
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

  it('displays event information', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    expect(screen.getAllByText('Test Venue').length).toBeGreaterThan(0);
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('displays organizer information', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Organizer')).toBeInTheDocument();
    expect(screen.getByText('organizer@umd.edu')).toBeInTheDocument();
  });

  it('displays QR code image', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    const qrImage = screen.getByAltText('Ticket QR Code');
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute('src', 'data:image/png;base64,test');
  });

  it('displays guests when present', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Guests \(2\)/)).toBeInTheDocument();
    const guestSection = screen.getByText(/Guests \(2\)/).closest('.bg-blue-50');
    expect(within(guestSection).getByText(/• Guest One/)).toBeInTheDocument();
    expect(within(guestSection).getByText(/• Guest Two/)).toBeInTheDocument();
  });

  it('does not display guests section when no guests', () => {
    const registrationWithoutGuests = {
      ...mockRegistration,
      guests: []
    };

    render(
      <TicketModal
        registration={registrationWithoutGuests}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText(/Guests \(\d+\)/)).not.toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when close button in footer is clicked', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Close'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('downloads ticket as PDF', async () => {
    const jsPDF = (await import('jspdf')).default;

    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Download Ticket'));

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

    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.click(screen.getByText('Download Ticket'));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error generating PDF:', expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Failed to download ticket. Please try again.');
    });

    consoleError.mockRestore();
  });

  it('displays check-in instructions', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Check-in Instructions')).toBeInTheDocument();
    expect(screen.getByText(/Show this QR code at the event entrance/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrive 15 minutes early/i)).toBeInTheDocument();
    expect(screen.getByText(/Bring a valid student ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Guests must check in with you/i)).toBeInTheDocument();
  });

  it('displays footer note', () => {
    render(
      <TicketModal
        registration={mockRegistration}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Save this ticket or take a screenshot/i)).toBeInTheDocument();
  });
});
