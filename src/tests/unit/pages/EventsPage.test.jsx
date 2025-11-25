import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EventsPage from '@pages/EventsPage';

const mockGetAllEvents = vi.fn();
const mockRegisterForEvent = vi.fn();
const mockCheckRegistrationStatus = vi.fn();
const mockUseAuthUser = { id: 'user-1', name: 'Student One' };

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUseAuthUser }),
}));

vi.mock('@components/layout/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('@components/layout/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));

vi.mock('@components/events/EventCard', () => ({
  default: ({ event, onClick }) => (
    <div data-testid={`event-card-${event.id}`}>
      <button onClick={() => onClick(event)}>{event.title}</button>
    </div>
  ),
}));

vi.mock('@components/events/EventFilters', () => ({
  default: ({ onFilterChange, onClearFilters }) => (
    <div>
      <button onClick={() => onFilterChange({ search: 'tech' })}>Apply Filters</button>
      <button onClick={onClearFilters}>Clear Filters</button>
    </div>
  ),
}));

vi.mock('@components/events/EventDetailModal', () => ({
  default: ({ event, onClose, onRegister }) => (
    <div data-testid="event-detail-modal">
      <p>{event.title}</p>
      <button onClick={() => onRegister(event)}>Register</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('@components/registration/RegistrationModal', () => ({
  default: ({ event, onClose, onSubmit, isWaitlist }) => (
    <div data-testid="registration-modal">
      <p>{event.title}</p>
      <p>{isWaitlist ? 'Waitlist' : 'Registration'}</p>
      <button onClick={() => onSubmit({ notes: 'Excited!' })}>Submit Registration</button>
      <button onClick={onClose}>Close Registration</button>
    </div>
  ),
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@services/eventService', () => ({
  getAllEvents: (...args) => mockGetAllEvents(...args),
}));

vi.mock('@services/registrationService', () => ({
  registerForEvent: (...args) => mockRegisterForEvent(...args),
  checkRegistrationStatus: (...args) => mockCheckRegistrationStatus(...args),
}));

const eventsFixture = [
  {
    id: 1,
    title: 'Innovation Summit',
    category: 'career',
    capacity: 100,
    registeredCount: 80,
  },
  {
    id: 2,
    title: 'Campus Festival',
    category: 'social',
    capacity: 50,
    registeredCount: 50,
  },
];

const mockEventsResponse = (data = eventsFixture) => ({
  success: true,
  events: data,
});

describe('EventsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllEvents.mockResolvedValue(mockEventsResponse());
    mockCheckRegistrationStatus.mockResolvedValue({ isRegistered: false, isWaitlisted: false });
    mockRegisterForEvent.mockResolvedValue({ success: true, message: 'Registered!' });
    window.alert = vi.fn();
  });

  it('shows loading spinner while events are fetched', () => {
    mockGetAllEvents.mockReturnValue(new Promise(() => {}));
    render(<EventsPage />);
    expect(screen.getByText('Loading events...')).toBeInTheDocument();
  });

  it('renders events and allows toggling view modes', async () => {
    render(<EventsPage />);

    await waitFor(() => expect(screen.getByText('Innovation Summit')).toBeInTheDocument());

    expect(screen.getByText(/Showing/)).toHaveTextContent('2 events');

    const listButton = screen.getByRole('button', { name: 'List view' });
    fireEvent.click(listButton);

    expect(listButton).toHaveClass('bg-red-600');
  });

  it('applies filters via EventFilters component', async () => {
    render(<EventsPage />);

    await screen.findByText('Innovation Summit');
    fireEvent.click(screen.getByText('Apply Filters'));
    await waitFor(() =>
      expect(mockGetAllEvents).toHaveBeenCalledWith(expect.objectContaining({ search: 'tech' })),
    );

    fireEvent.click(screen.getByText('Clear Filters'));
    await waitFor(() =>
      expect(mockGetAllEvents).toHaveBeenCalledWith({
        search: '',
        category: 'all',
        sortBy: 'date',
        availableOnly: false,
        startDate: '',
        endDate: '',
        organizer: '',
      }),
    );
  });

  it('shows empty state when no events match filters', async () => {
    mockGetAllEvents.mockResolvedValue(mockEventsResponse([]));
    render(<EventsPage />);

    expect(await screen.findByText('No events found')).toBeInTheDocument();
  });

  it('opens event detail modal and triggers registration flow', async () => {
    render(<EventsPage />);
    await waitFor(() => expect(screen.getByText('Innovation Summit')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Innovation Summit'));
    expect(screen.getByTestId('event-detail-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(mockCheckRegistrationStatus).toHaveBeenCalledWith('user-1', 1),
    );

    expect(screen.getByTestId('registration-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Submit Registration'));

    await waitFor(() =>
      expect(mockRegisterForEvent).toHaveBeenCalledWith('user-1', 1, { notes: 'Excited!' }),
    );
    expect(window.alert).toHaveBeenCalledWith('Registered!');
  });

  it('shows waitlist registration when event is full', async () => {
    render(<EventsPage />);
    await waitFor(() => expect(screen.getByText('Campus Festival')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Campus Festival'));
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() =>
      expect(mockCheckRegistrationStatus).toHaveBeenCalledWith('user-1', 2),
    );
    expect(screen.getByText('Waitlist')).toBeInTheDocument();
  });

  it('alerts user when already registered', async () => {
    mockCheckRegistrationStatus.mockResolvedValueOnce({ isRegistered: true, isWaitlisted: false });

    render(<EventsPage />);
    await waitFor(() => expect(screen.getByText('Innovation Summit')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Innovation Summit'));
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() =>
      expect(mockCheckRegistrationStatus).toHaveBeenCalledWith('user-1', 1),
    );
    expect(window.alert).toHaveBeenCalledWith('You are already registered for this event!');
  });
});
