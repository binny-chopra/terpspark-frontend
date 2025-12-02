import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import EventAttendeesPage from '@pages/EventAttendeesPage';
import '../setup/layoutMocks';

const mockUseParams = vi.fn();
const mockNavigate = vi.fn();
const mockUseAuth = vi.fn();
const mockGetEventById = vi.fn();
const mockGetEventAttendees = vi.fn();
const mockExportAttendeesCSV = vi.fn();
const mockSendAnnouncement = vi.fn();
const mockAddToast = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/organizer/events/42/attendees' }),
}));

vi.mock('@context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@context/ToastContext', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@services/organizerService', () => ({
  getEventById: (...args) => mockGetEventById(...args),
  getEventAttendees: (...args) => mockGetEventAttendees(...args),
  exportAttendeesCSV: (...args) => mockExportAttendeesCSV(...args),
  sendAnnouncement: (...args) => mockSendAnnouncement(...args),
}));

const eventFixture = {
  id: 42,
  title: 'Innovation Summit',
  capacity: 120,
};

const attendeesFixture = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    registeredAt: '2024-01-01T00:00:00Z',
    guests: [],
    checkInStatus: 'checked_in',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    registeredAt: '2024-01-02T00:00:00Z',
    guests: [{ name: 'Guest 1' }],
    checkInStatus: 'not_checked_in',
  },
];

const resolveData = () => {
  mockUseParams.mockReturnValue({ eventId: '42' });
  mockUseAuth.mockReturnValue({ user: { id: 'org-1' } });
  mockGetEventById.mockResolvedValue({
    success: true,
    data: eventFixture,
  });
  mockGetEventAttendees.mockResolvedValue({
    success: true,
    attendees: attendeesFixture,
    statistics: {
      totalRegistrations: attendeesFixture.length,
      totalAttendees: attendeesFixture.reduce((sum, a) => sum + 1 + (a.guests?.length || 0), 0),
      checkedIn: attendeesFixture.filter(a => a.checkInStatus === 'checked_in').length,
      notCheckedIn: attendeesFixture.filter(a => a.checkInStatus === 'not_checked_in').length,
    },
  });
  mockExportAttendeesCSV.mockResolvedValue({ success: true });
  mockSendAnnouncement.mockResolvedValue({ success: true, message: 'Announcement sent successfully!' });
};

describe('EventAttendeesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveData();
  });

  it('shows loading spinner while fetching data', () => {
    mockGetEventById.mockReturnValue(new Promise(() => {}));
    mockGetEventAttendees.mockReturnValue(new Promise(() => {}));

    render(<EventAttendeesPage />);
    expect(screen.getByText('Loading attendees...')).toBeInTheDocument();
  });

  it('renders event details and attendees table', async () => {
    render(<EventAttendeesPage />);

    await waitFor(() => expect(screen.getByText('Innovation Summit')).toBeInTheDocument());
    expect(screen.getByText('Total Registrations')).toBeInTheDocument();
    expect(screen.getByText(String(attendeesFixture.length))).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('shows event not found message when event is missing', async () => {
    mockGetEventById.mockResolvedValue({ success: false, error: 'Event not found' });
    render(<EventAttendeesPage />);

    await waitFor(() => expect(screen.getByText('Event Not Found')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Back to My Events'));
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });

  it('filters attendees via search input', async () => {
    render(<EventAttendeesPage />);
    await screen.findByText('Innovation Summit');

    // Mock filtered results for search
    mockGetEventAttendees.mockResolvedValueOnce({
      success: true,
      attendees: [attendeesFixture[0]], // Only Alice
      statistics: {
        totalRegistrations: 1,
        totalAttendees: 1,
        checkedIn: 1,
        notCheckedIn: 0,
      },
    });

    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'alice' } });
    
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });

    // Mock empty results for unknown search
    mockGetEventAttendees.mockResolvedValueOnce({
      success: true,
      attendees: [],
      statistics: {
        totalRegistrations: 0,
        totalAttendees: 0,
        checkedIn: 0,
        notCheckedIn: 0,
      },
    });

    fireEvent.change(searchInput, { target: { value: 'unknown' } });
    expect(await screen.findByText('No attendees match your search criteria')).toBeInTheDocument();
  });

  it('exports CSV when button clicked', async () => {
    render(<EventAttendeesPage />);
    await screen.findByText('Innovation Summit');

    fireEvent.click(screen.getByText('Export CSV'));
    await waitFor(() => expect(mockExportAttendeesCSV).toHaveBeenCalledWith('42', 'Innovation Summit'));
  });

  it('opens announcement modal and sends announcement', async () => {
    render(<EventAttendeesPage />);
    await screen.findByText('Send Announcement');

    fireEvent.click(screen.getByRole('button', { name: /Send Announcement/i }));
    const modalHeading = await screen.findByRole('heading', { name: 'Send Announcement' });
    expect(modalHeading).toBeInTheDocument();

    const subjectInput = screen.getByPlaceholderText('Enter announcement subject...');
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

    const textarea = screen.getByPlaceholderText('Enter your announcement message...');
    fireEvent.change(textarea, { target: { value: 'Hello attendees!' } });

    // Find the modal container by navigating from the textarea
    const modalContainer = within(textarea.closest('.bg-white'));
    const modalSendButton = modalContainer.getByRole('button', { name: 'Send Announcement' });
    fireEvent.click(modalSendButton);
    await waitFor(() => expect(mockSendAnnouncement).toHaveBeenCalledWith('42', {
      subject: 'Test Subject',
      message: 'Hello attendees!',
      sendVia: 'email'
    }));
    expect(mockAddToast).toHaveBeenCalledWith('Announcement sent successfully!', 'success');
  });
});
