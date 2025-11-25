import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import MyRegistrationsPage from '@pages/MyRegistrationsPage';

const mockUser = { id: 'user-1', name: 'Student One' };
const mockGetUserRegistrations = vi.fn();
const mockGetUserWaitlist = vi.fn();
const mockCancelRegistration = vi.fn();
const mockLeaveWaitlist = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('@components/layout/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('@components/layout/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@components/registration/RegistrationCard', () => ({
  default: ({ registration, onCancel, onViewTicket }) => (
    <div data-testid={`registration-card-${registration.id}`}>
      <p>{registration.event.title}</p>
      <button onClick={() => onCancel(registration.id)}>cancel</button>
      <button onClick={() => onViewTicket(registration)}>view ticket</button>
    </div>
  ),
}));

vi.mock('@components/registration/WaitlistCard', () => ({
  default: ({ waitlistEntry, onLeave }) => (
    <div data-testid={`waitlist-card-${waitlistEntry.id}`}>
      <p>{waitlistEntry.event.title}</p>
      <button onClick={() => onLeave(waitlistEntry.id)}>leave</button>
    </div>
  ),
}));

vi.mock('@components/registration/TicketModal', () => ({
  default: ({ registration, onClose }) => (
    <div data-testid="ticket-modal">
      <p>Ticket for {registration.event.title}</p>
      <button onClick={onClose}>close ticket</button>
    </div>
  ),
}));

vi.mock('@services/registrationService', () => ({
  getUserRegistrations: (...args) => mockGetUserRegistrations(...args),
  getUserWaitlist: (...args) => mockGetUserWaitlist(...args),
  cancelRegistration: (...args) => mockCancelRegistration(...args),
  leaveWaitlist: (...args) => mockLeaveWaitlist(...args),
}));

const futureDate = '2100-01-01T00:00:00.000Z';
const pastDate = '2000-01-01T00:00:00.000Z';

const registrationsFixture = [
  {
    id: 'reg-1',
    status: 'confirmed',
    event: { title: 'Future Conference', date: futureDate },
  },
  {
    id: 'reg-2',
    status: 'confirmed',
    event: { title: 'Past Workshop', date: pastDate },
  },
  {
    id: 'reg-3',
    status: 'cancelled',
    event: { title: 'Cancelled Meetup', date: futureDate },
  },
];

const waitlistFixture = [
  {
    id: 'wait-1',
    event: { title: 'Popular Seminar', date: futureDate },
  },
];

const resolveData = () => {
  mockGetUserRegistrations.mockResolvedValue({ success: true, registrations: registrationsFixture });
  mockGetUserWaitlist.mockResolvedValue({ success: true, waitlist: waitlistFixture });
};

describe('MyRegistrationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveData();
    mockCancelRegistration.mockResolvedValue({ success: true });
    mockLeaveWaitlist.mockResolvedValue({ success: true });
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner while fetching data', () => {
    mockGetUserRegistrations.mockReturnValue(new Promise(() => {}));
    mockGetUserWaitlist.mockReturnValue(new Promise(() => {}));

    render(<MyRegistrationsPage />);
    expect(screen.getByText('Loading your registrations...')).toBeInTheDocument();
  });

  it('renders upcoming registrations and opens ticket modal', async () => {
    render(<MyRegistrationsPage />);

    await waitFor(() => expect(screen.getByText('My Registrations')).toBeInTheDocument());
    expect(screen.getByText('Registrations (1)')).toBeInTheDocument();

    const cards = screen.getAllByTestId(/registration-card-/);
    expect(cards).toHaveLength(1);

    fireEvent.click(within(cards[0]).getByText('view ticket'));
    expect(screen.getByTestId('ticket-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('close ticket'));
    expect(screen.queryByTestId('ticket-modal')).not.toBeInTheDocument();
  });

  it('handles cancelling registration and reloads data', async () => {
    render(<MyRegistrationsPage />);
    const upcomingCard = await screen.findByTestId('registration-card-reg-1');

    fireEvent.click(within(upcomingCard).getByText('cancel'));

    await waitFor(() => expect(mockCancelRegistration).toHaveBeenCalledWith('user-1', 'reg-1'));
    expect(window.alert).toHaveBeenCalledWith('Registration cancelled successfully');
    await waitFor(() => expect(mockGetUserRegistrations).toHaveBeenCalledTimes(2));
    expect(mockGetUserWaitlist).toHaveBeenCalledTimes(2);
  });

  it('switches to waitlist tab and leaves waitlist entry', async () => {
    render(<MyRegistrationsPage />);
    await screen.findByText('My Registrations');

    fireEvent.click(screen.getByRole('button', { name: /waitlist \(1\)/i }));
    const waitlistCard = await screen.findByTestId('waitlist-card-wait-1');

    fireEvent.click(within(waitlistCard).getByText('leave'));

    await waitFor(() => expect(mockLeaveWaitlist).toHaveBeenCalledWith('user-1', 'wait-1'));
    expect(window.alert).toHaveBeenCalledWith('Removed from waitlist successfully');
    await waitFor(() => expect(mockGetUserRegistrations).toHaveBeenCalledTimes(2));
    expect(mockGetUserWaitlist).toHaveBeenCalledTimes(2);
  });

  it('shows past and cancelled registrations in past tab', async () => {
    render(<MyRegistrationsPage />);
    await screen.findByText('My Registrations');

    fireEvent.click(screen.getByRole('button', { name: /past events/i }));

    expect(screen.getByText('Past Workshop')).toBeInTheDocument();
    expect(screen.getByText('Cancelled Meetup')).toBeInTheDocument();
    expect(screen.getByText('Cancelled Registrations')).toBeInTheDocument();
  });

  it('shows empty states when no registrations or waitlist entries exist', async () => {
    mockGetUserRegistrations.mockResolvedValueOnce({ success: true, registrations: [] });
    mockGetUserWaitlist.mockResolvedValueOnce({ success: true, waitlist: [] });

    render(<MyRegistrationsPage />);

    await screen.findByText('No Upcoming Registrations');
    expect(screen.getByText("You haven't registered for any upcoming events yet.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /waitlist \(0\)/i }));
    expect(await screen.findByText('No Waitlist Entries')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /past events \(0\)/i }));
    expect(await screen.findByText('No Past Events')).toBeInTheDocument();
  });
});
