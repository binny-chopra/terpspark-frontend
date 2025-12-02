import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AttendeeSearch from '@components/checkin/AttendeeSearch';

describe('AttendeeSearch', () => {
  const mockOnCheckIn = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    expect(screen.getByPlaceholderText(/Search by name, email, or ticket code/i)).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('shows error when searching with empty query', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Please enter a search term');
    });
  });

  it('performs search and displays results', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/Found.*attendee/i)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('searches by name', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('searches by email', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'student@umd.edu' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('searches by ticket code', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'TKT-1699558899' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('displays attendee information in results', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('student@umd.edu')).toBeInTheDocument();
      expect(screen.getByText(/TKT-1699558899-3/)).toBeInTheDocument();
    });
  });

  it('displays guest count when attendee has guests', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/1 guest/)).toBeInTheDocument();
    });
  });

  it('displays checked in badge for already checked in attendees', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Emily' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('✓ Checked In')).toBeInTheDocument();
    });
  });

  it('disables check-in for already checked in attendees', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Emily' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      const attendeeCard = screen.getByText('Emily Davis').closest('.cursor-not-allowed');
      expect(attendeeCard).toBeInTheDocument();
    });
  });

  it('shows confirmation modal when attendee is selected', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkInButton = screen.getAllByText('Check In')[0];
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getAllByText('Confirm Check-In').length).toBeGreaterThan(0);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('calls onCheckIn when check-in is confirmed', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkInButton = screen.getAllByText('Check In')[0];
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getAllByText('Confirm Check-In').length).toBeGreaterThan(0);
    });

    const confirmButtons = screen.getAllByText('Confirm Check-In');
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() => {
      expect(mockOnCheckIn).toHaveBeenCalled();
    });
  });

  it('clears selection when cancel is clicked', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkInButton = screen.getAllByText('Check In')[0];
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getAllByText('Confirm Check-In').length).toBeGreaterThan(0);
    });

    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByText('Confirm Check-In')).not.toBeInTheDocument();
    });
  });

  it('displays guests in confirmation modal', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const checkInButton = screen.getAllByText('Check In')[0];
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getByText(/Guests \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Guest One/)).toBeInTheDocument();
    });
  });

  it('shows no results message when search returns empty', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/No attendees found matching/i)).toBeInTheDocument();
    });
  });

  it('submits search on Enter key press', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });


  it('clears search results after successful check-in', async () => {
    render(<AttendeeSearch eventId="1" onCheckIn={mockOnCheckIn} onError={mockOnError} />);

    const searchInput = screen.getByPlaceholderText(/Search by name, email, or ticket code/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const checkInButton = screen.getAllByText('Check In')[0];
    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getAllByText('Confirm Check-In').length).toBeGreaterThan(0);
    });

    const confirmButtons = screen.getAllByText('Confirm Check-In');
    fireEvent.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});