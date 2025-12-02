import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckInHistory from '@components/checkin/CheckInHistory';

const mockGetEventCheckIns = vi.fn();
const mockExportCheckIns = vi.fn();
const mockUndoCheckIn = vi.fn();
const mockOnRefresh = vi.fn();

vi.mock('@services/checkInService', () => ({
  getEventCheckIns: (...args) => mockGetEventCheckIns(...args),
  exportCheckIns: (...args) => mockExportCheckIns(...args),
  undoCheckIn: (...args) => mockUndoCheckIn(...args),
}));

describe('CheckInHistory', () => {
  const checkInsFixture = [
    {
      id: 1,
      attendeeName: 'John Doe',
      attendeeEmail: 'john@umd.edu',
      checkedInAt: '2025-12-01T10:00:00Z',
      method: 'qr_scan',
      guestCount: 0,
      checkedInBy: { name: 'Staff One', role: 'staff' }
    },
    {
      id: 2,
      attendeeName: 'Jane Smith',
      attendeeEmail: 'jane@umd.edu',
      checkedInAt: '2025-12-01T11:00:00Z',
      method: 'manual',
      guestCount: 1,
      checkedInBy: { name: 'Staff Two', role: 'staff' }
    },
    {
      id: 3,
      attendeeName: 'Bob Wilson',
      attendeeEmail: 'bob@umd.edu',
      checkedInAt: '2025-12-01T12:00:00Z',
      method: 'search',
      guestCount: 0,
      checkedInBy: { name: 'Staff One', role: 'staff' }
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true);
    mockGetEventCheckIns.mockResolvedValue({ success: true, data: checkInsFixture });
  });

  it('shows loading spinner while fetching check-ins', () => {
    mockGetEventCheckIns.mockReturnValue(new Promise(() => {}));

    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('loads and displays check-ins', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });

  it('displays check-in count in header', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText(/Check-In History \(3\)/)).toBeInTheDocument();
    });
  });

  it('displays check-in method badges', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getAllByText('QR Scan').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Manual').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Search').length).toBeGreaterThan(0);
    });
  });

  it('displays attendee email and check-in time', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('john@umd.edu')).toBeInTheDocument();
      expect(screen.getByText('jane@umd.edu')).toBeInTheDocument();
    });
  });

  it('displays guest count when present', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText(/1 guest/)).toBeInTheDocument();
    });
  });

  it('displays who checked in the attendee', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Checked in by: Staff One/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Checked in by: Staff Two/).length).toBeGreaterThan(0);
    });
  });

  it('filters check-ins by search query', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('filters check-ins by method', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const methodSelect = screen.getByDisplayValue('All Methods');
    fireEvent.change(methodSelect, { target: { value: 'qr_scan' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
    });
  });

  it('combines search and method filters', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    const methodSelect = screen.getByDisplayValue('All Methods');
    fireEvent.change(methodSelect, { target: { value: 'manual' } });

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no check-ins', async () => {
    mockGetEventCheckIns.mockResolvedValue({ success: true, data: [] });

    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('No check-ins yet')).toBeInTheDocument();
    });
  });

  it('shows no match message when filters return no results', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No check-ins match your search')).toBeInTheDocument();
    });
  });

  it('refreshes check-ins when refresh button is clicked', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(mockGetEventCheckIns).toHaveBeenCalledTimes(2);
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('exports check-ins as CSV', async () => {
    const mockBlob = new Blob(['csv,data'], { type: 'text/csv' });
    mockExportCheckIns.mockResolvedValue({
      success: true,
      data: mockBlob,
      filename: 'check-ins.csv'
    });

    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Export CSV'));

    await waitFor(() => {
      expect(mockExportCheckIns).toHaveBeenCalledWith('1');
    });
  });

  it('undoes check-in when undo button is clicked', async () => {
    mockUndoCheckIn.mockResolvedValue({ success: true });

    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const undoButtons = screen.getAllByText('Undo');
    fireEvent.click(undoButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockUndoCheckIn).toHaveBeenCalledWith(1);
      expect(mockGetEventCheckIns).toHaveBeenCalledTimes(2);
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('does not undo check-in when confirmation is cancelled', async () => {
    window.confirm.mockReturnValue(false);

    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const undoButtons = screen.getAllByText('Undo');
    fireEvent.click(undoButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockUndoCheckIn).not.toHaveBeenCalled();
    });
  });

  it('displays summary statistics', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total Check-Ins')).toBeInTheDocument();
    });
  });

  it('calculates method statistics correctly', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('QR Scans')).toBeInTheDocument();
      expect(screen.getAllByText('Manual').length).toBeGreaterThan(0);
    });
  });

  it('calculates total guests correctly', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(screen.getByText('Total Guests')).toBeInTheDocument();
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThan(0);
    });
  });

  it('formats time and date correctly', async () => {
    render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      const allText = screen.getByText('John Doe').closest('.bg-white').textContent;
      expect(allText).toMatch(/10:00|AM|PM/);
      expect(screen.getAllByText(/Dec 1, 2025/).length).toBeGreaterThan(0);
    });
  });

  it('reloads check-ins when eventId changes', async () => {
    const { rerender } = render(<CheckInHistory eventId="1" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(mockGetEventCheckIns).toHaveBeenCalledWith('1');
    });

    rerender(<CheckInHistory eventId="2" onRefresh={mockOnRefresh} />);

    await waitFor(() => {
      expect(mockGetEventCheckIns).toHaveBeenCalledWith('2');
    });
  });
});
