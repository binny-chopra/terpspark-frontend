import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import MyEventsPage from '@pages/MyEventsPage';

const mockNavigate = vi.fn();
const mockGetOrganizerEvents = vi.fn();
const mockCancelEvent = vi.fn();
const mockDuplicateEvent = vi.fn();

const mockUser = { id: 'org-1', name: 'Organizer One' };

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
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

vi.mock('@components/organizer/OrganizerEventCard', () => ({
  default: ({ event, onEdit, onCancel, onDuplicate, onViewAttendees }) => (
    <div data-testid={`event-card-${event.id}`}>
      <p>{event.title}</p>
      <button onClick={() => onEdit(event.id)}>edit</button>
      <button onClick={() => onCancel(event.id)}>cancel</button>
      <button onClick={() => onDuplicate(event.id)}>duplicate</button>
      <button onClick={() => onViewAttendees(event.id)}>attendees</button>
    </div>
  ),
}));

vi.mock('@services/organizerService', () => ({
  getOrganizerEvents: (...args) => mockGetOrganizerEvents(...args),
  cancelEvent: (...args) => mockCancelEvent(...args),
  duplicateEvent: (...args) => mockDuplicateEvent(...args),
}));

const eventsFixture = [
  { id: 'evt-1', title: 'Draft Event', status: 'draft' },
  { id: 'evt-2', title: 'Pending Event', status: 'pending' },
  { id: 'evt-3', title: 'Published Event', status: 'published' },
  { id: 'evt-4', title: 'Cancelled Event', status: 'cancelled' },
];

const resolveEvents = () => {
  mockGetOrganizerEvents.mockResolvedValue({ success: true, events: eventsFixture });
};

describe('MyEventsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockGetOrganizerEvents.mockReset();
    mockCancelEvent.mockReset();
    mockDuplicateEvent.mockReset();
    resolveEvents();
    mockCancelEvent.mockResolvedValue({ success: true });
    mockDuplicateEvent.mockResolvedValue({ success: true });
    window.alert = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner while fetching events', () => {
    mockGetOrganizerEvents.mockReturnValue(new Promise(() => {}));
    render(<MyEventsPage />);
    expect(screen.getByText('Loading your events...')).toBeInTheDocument();
  });

  it('renders stats, tabs, and event cards by default', async () => {
    render(<MyEventsPage />);

    await waitFor(() => expect(screen.getByText('My Events')).toBeInTheDocument());
    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getAllByTestId(/event-card-/)).toHaveLength(eventsFixture.length);
  });

  it('navigates to create-event when clicking primary button', async () => {
    render(<MyEventsPage />);
    await screen.findByText('Create Event');
    fireEvent.click(screen.getByText('Create Event'));
    expect(mockNavigate).toHaveBeenCalledWith('/create-event');
  });

  it('filters events when switching tabs', async () => {
    render(<MyEventsPage />);
    await screen.findByText('My Events');

    fireEvent.click(screen.getByRole('button', { name: /draft \(1\)/i }));
    expect(screen.getAllByTestId(/event-card-/)).toHaveLength(1);
    expect(screen.getByText('Draft Event')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /published \(1\)/i }));
    expect(screen.getByText('Published Event')).toBeInTheDocument();
  });

  it('shows empty state with create button when no events exist', async () => {
    mockGetOrganizerEvents.mockResolvedValueOnce({ success: true, events: [] });
    render(<MyEventsPage />);

    await screen.findByText('No Events Yet');
    expect(screen.getByText("You haven't created any events yet. Create your first event to get started!")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Create Your First Event'));
    expect(mockNavigate).toHaveBeenCalledWith('/create-event');
  });

  it('allows cancelling event when confirmed', async () => {
    render(<MyEventsPage />);
    const draftCard = await screen.findByTestId('event-card-evt-1');

    fireEvent.click(within(draftCard).getByText('cancel'));
    await waitFor(() => expect(mockCancelEvent).toHaveBeenCalledWith('evt-1', 'org-1'));
    expect(window.alert).toHaveBeenCalledWith('Event cancelled successfully');
    await waitFor(() => expect(mockGetOrganizerEvents).toHaveBeenCalledTimes(2));
  });

  it('does not cancel event when confirmation dismissed', async () => {
    window.confirm.mockReturnValueOnce(false);
    render(<MyEventsPage />);
    const draftCard = await screen.findByTestId('event-card-evt-1');

    fireEvent.click(within(draftCard).getByText('cancel'));
    expect(mockCancelEvent).not.toHaveBeenCalled();
  });

  it('duplicates event and reloads on success', async () => {
    render(<MyEventsPage />);
    const publishedCard = await screen.findByTestId('event-card-evt-3');

    fireEvent.click(within(publishedCard).getByText('duplicate'));
    await waitFor(() => expect(mockDuplicateEvent).toHaveBeenCalledWith('evt-3', 'org-1'));
    expect(window.alert).toHaveBeenCalledWith('Event duplicated successfully as a draft');
    await waitFor(() => expect(mockGetOrganizerEvents).toHaveBeenCalledTimes(2));
  });

  it('navigates to edit and attendees pages via card actions', async () => {
    render(<MyEventsPage />);
    const cards = await screen.findAllByTestId(/event-card-/);
    const firstCard = cards[0];

    fireEvent.click(within(firstCard).getByText('edit'));
    expect(mockNavigate).toHaveBeenCalledWith('/edit-event/evt-1');

    fireEvent.click(within(firstCard).getByText('attendees'));
    expect(mockNavigate).toHaveBeenCalledWith('/event-attendees/evt-1');
  });
});
