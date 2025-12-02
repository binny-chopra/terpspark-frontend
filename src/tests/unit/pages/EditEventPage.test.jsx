import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditEventPage from '@pages/EditEventPage';
import '../setup/layoutMocks';

global.fetch = vi.fn();

const mockNavigate = vi.fn();
const mockGetCategories = vi.fn();
const mockGetOrganizerEvents = vi.fn();
const mockUpdateEvent = vi.fn();
const mockAddToast = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'org-1', name: 'Organizer One' } }),
}));

vi.mock('@context/ToastContext', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ eventId: '1' }), // Match the numeric ID
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/edit-event/1' }),
}));

vi.mock('@services/organizerService', () => ({
  getOrganizerEvents: (...args) => mockGetOrganizerEvents(...args),
  updateEvent: (...args) => mockUpdateEvent(...args),
}));

vi.mock('@services/eventService', () => ({
  getCategories: (...args) => mockGetCategories(...args),
}));

const draftEvent = {
  id: 1,
  title: 'Tech Talk',
  description: 'A'.repeat(60),
  categoryId: 'cat-1',
  date: '2099-05-01',
  startTime: '10:00',
  endTime: '11:00',
  venue: 'Stamp Student Union',
  venueId: 1,
  location: 'Grand Ballroom',
  capacity: 150,
  imageUrl: '',
  tags: ['tech', 'lecture'],
  status: 'draft',
};

const pendingEvent = { ...draftEvent, status: 'pending' };

const categories = [
  { id: 'cat-1', name: 'Career' },
  { id: 'cat-2', name: 'Social' },
];

const loadDraftSuccess = () => {
  mockGetCategories.mockResolvedValue({ success: true, categories });
  mockGetOrganizerEvents.mockResolvedValue({ success: true, events: [draftEvent] });
};

const venuesFixture = [
  { id: 1, name: 'Stamp Student Union', building: 'Grand Ballroom', capacity: 500, isActive: true }
];

describe('EditEventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
    window.confirm = vi.fn().mockReturnValue(true);
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, venues: venuesFixture })
    });
  });

  it('shows loading spinner while fetching event data', () => {
    mockGetCategories.mockReturnValue(new Promise(() => {}));
    mockGetOrganizerEvents.mockReturnValue(new Promise(() => {}));
    render(<EditEventPage />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('renders edit form when event loads successfully', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument(), { timeout: 3000 });
    await waitFor(() => expect(screen.getByDisplayValue('Tech Talk')).toBeInTheDocument(), { timeout: 3000 });
    expect(screen.getByRole('button', { name: 'Update Event' })).toBeInTheDocument();
  });

  it('prevents submission if validation fails and shows toast message', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const titleInput = screen.getByPlaceholderText(/fall career fair/i);
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Please fix the highlighted errors', 'warning');
    });
    expect(mockUpdateEvent).not.toHaveBeenCalled();
  });

  it('submits updates for draft events and navigates back on success', async () => {
    loadDraftSuccess();
    mockUpdateEvent.mockResolvedValue({ success: true });

    render(<EditEventPage />);
    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const titleInput = screen.getByPlaceholderText(/fall career fair/i);
    fireEvent.change(titleInput, {
      target: { value: 'Updated Tech Talk' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() =>
      expect(mockUpdateEvent).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Tech Talk',
      })),
    );

    expect(mockAddToast).toHaveBeenCalledWith('Event updated successfully', 'success');
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/my-events'), {
      timeout: 2000,
    });
  });

  it.skip('requires change note when editing pending events', async () => {
    const pendingEventWithVenue = { ...pendingEvent, venueId: 1 };
    mockGetCategories.mockResolvedValue({ success: true, categories });
    mockGetOrganizerEvents.mockResolvedValue({ success: true, events: [pendingEventWithVenue] });

    render(<EditEventPage />);
    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const titleInput = screen.getByPlaceholderText(/fall career fair/i);
    fireEvent.change(titleInput, {
      target: { value: 'Pending Update' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(screen.getByText('Change note is required when editing pending events')).toBeInTheDocument();
    });

    const changeNoteInput = screen.getByPlaceholderText(/briefly explain what changes/i);
    fireEvent.change(changeNoteInput, {
      target: { value: 'Adjusted schedule' },
    });

    mockUpdateEvent.mockResolvedValue({ success: true });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => expect(mockUpdateEvent).toHaveBeenCalled());
    expect(mockAddToast).toHaveBeenCalledWith('Event resubmitted for approval', 'success');
  });

  it.skip('shows cannot edit screen when event is published', async () => {
    const publishedEvent = { ...draftEvent, status: 'published', venueId: 1 };
    mockGetCategories.mockResolvedValue({ success: true, categories });
    mockGetOrganizerEvents.mockResolvedValue({ success: true, events: [publishedEvent] });

    render(<EditEventPage />);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /cannot edit event/i });
      expect(heading).toBeInTheDocument();
    });
    expect(screen.getByText(/Events with status "published" cannot be edited/i)).toBeInTheDocument();
  });

  it('navigates back when cancel is confirmed', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });
});
