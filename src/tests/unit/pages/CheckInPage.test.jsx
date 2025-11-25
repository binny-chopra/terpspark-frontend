import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CheckInPage from '@pages/CheckInPage';

const mockNavigate = vi.fn();
const mockGetEventById = vi.fn();
const mockGetCheckInStats = vi.fn();
const mockValidateQRCode = vi.fn();
const mockCheckInAttendee = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => ({ eventId: '123' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@components/checkin/QRScanner', () => ({
  default: ({ onScan, onError }) => (
    <div data-testid="qr-scanner">
      <button onClick={() => onScan('mock-code')} data-testid="trigger-scan">
        Scan QR
      </button>
      <button onClick={() => onError('Scan error')} data-testid="trigger-scan-error">
        Trigger Error
      </button>
    </div>
  ),
}));

vi.mock('@components/checkin/AttendeeSearch', () => ({
  default: ({ onCheckIn, onError }) => (
    <div data-testid="manual-search">
      <button
        onClick={() => onCheckIn({ registrationId: 'reg-1', name: 'Manual Attendee' })}
        data-testid="trigger-manual-checkin"
      >
        Manual Check-In
      </button>
      <button onClick={() => onError('Manual error')} data-testid="trigger-manual-error">
        Manual Error
      </button>
    </div>
  ),
}));

vi.mock('@components/checkin/CheckInHistory', () => ({
  default: ({ onRefresh }) => (
    <div data-testid="history-panel">
      <button onClick={onRefresh} data-testid="trigger-refresh">
        Refresh History
      </button>
    </div>
  ),
}));

vi.mock('@services/eventService', () => ({
  getEventById: (...args) => mockGetEventById(...args),
}));

vi.mock('@services/checkInService', () => ({
  getCheckInStats: (...args) => mockGetCheckInStats(...args),
  validateQRCode: (...args) => mockValidateQRCode(...args),
  checkInAttendee: (...args) => mockCheckInAttendee(...args),
}));

const eventFixture = {
  id: 123,
  title: 'Innovation Summit',
  date: '2024-04-15T10:00:00Z',
  startTime: '10:00 AM',
};

const statsFixture = {
  totalRegistrations: 200,
  checkedIn: 80,
  notCheckedIn: 120,
  checkInRate: 40,
};

describe('CheckInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetEventById.mockResolvedValue({ success: true, data: eventFixture });
    mockGetCheckInStats.mockResolvedValue({ success: true, data: statsFixture });
    mockValidateQRCode.mockResolvedValue({
      success: true,
      data: { id: 'reg-qr', attendeeName: 'QR Guest' },
    });
    mockCheckInAttendee.mockResolvedValue({ success: true });
  });

  it('renders event details and stats after data loads', async () => {
    render(<CheckInPage />);

    await waitFor(() => expect(screen.getByText('Event Check-In')).toBeInTheDocument());

    expect(screen.getByText(eventFixture.title)).toBeInTheDocument();
    expect(screen.getByText('Total Registered')).toBeInTheDocument();
    expect(screen.getByText(String(statsFixture.totalRegistrations))).toBeInTheDocument();
    expect(mockGetEventById).toHaveBeenCalledWith('123');
    expect(mockGetCheckInStats).toHaveBeenCalledWith('123');
  });

  it('shows not found state when event data fails to load', async () => {
    mockGetEventById.mockResolvedValueOnce({ success: false });

    render(<CheckInPage />);

    await waitFor(() => expect(screen.getByText('Event not found')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('switches between tabs and renders corresponding components', async () => {
    render(<CheckInPage />);
    await waitFor(() => expect(screen.getByTestId('qr-scanner')).toBeInTheDocument());

    const manualTab = screen.getByRole('button', { name: /manual check-in/i });
    fireEvent.click(manualTab);
    expect(screen.getByTestId('manual-search')).toBeInTheDocument();

    const historyTab = screen.getByRole('button', { name: /history/i });
    fireEvent.click(historyTab);
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
  });

  it('handles successful manual check-in and refreshes data', async () => {
    render(<CheckInPage />);
    await waitFor(() => expect(screen.getByTestId('qr-scanner')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /manual check-in/i }));
    fireEvent.click(screen.getByTestId('trigger-manual-checkin'));

    await waitFor(() =>
      expect(mockCheckInAttendee).toHaveBeenCalledWith(123, 'reg-1', 'manual', 2),
    );
    expect(screen.getByText('✓ Manual Attendee checked in successfully!')).toBeInTheDocument();
    await waitFor(() => expect(mockGetCheckInStats).toHaveBeenCalledTimes(2));
    expect(mockGetEventById).toHaveBeenCalledTimes(2);
  });

  it('handles QR scan success and shows toast message', async () => {
    render(<CheckInPage />);
    await waitFor(() => expect(screen.getByTestId('qr-scanner')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('trigger-scan'));

    await waitFor(() =>
      expect(mockValidateQRCode).toHaveBeenCalledWith('mock-code', 123),
    );
    expect(mockCheckInAttendee).toHaveBeenCalledWith(123, 'reg-qr', 'qr_scan', 2);
    expect(screen.getByText('✓ QR Guest checked in successfully!')).toBeInTheDocument();
  });
});
