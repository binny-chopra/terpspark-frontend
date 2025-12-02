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
  useParams: () => ({ eventId: '1' }),
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
  venueId: '1',
  location: 'Grand Ballroom',
  capacity: 150,
  imageUrl: '',
  tags: ['tech', 'lecture'],
  status: 'draft',
};

const categories = [
  { id: 'cat-1', name: 'Career' },
  { id: 'cat-2', name: 'Social' },
];

const loadDraftSuccess = () => {
  mockGetCategories.mockResolvedValue({ success: true, categories });
  mockGetOrganizerEvents.mockResolvedValue({ success: true, events: [draftEvent] });
};

const venuesFixture = [
  { id: '1', name: 'Stamp Student Union', building: 'Grand Ballroom', capacity: 500, isActive: true }
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

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByDisplayValue('Tech Talk')).toBeInTheDocument());
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
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/my-events'));
  });

  it('displays venue details when venue is selected', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const venueLabel = await screen.findByText('Venue *');
    const venueSelect = venueLabel.parentElement.querySelector('select');
    fireEvent.change(venueSelect, { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue:/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Max Capacity:/i)).toBeInTheDocument();
  });

  it('shows validation error for empty description', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const descriptionTextarea = screen.getByPlaceholderText(/detailed description/i);
    fireEvent.change(descriptionTextarea, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(screen.getByText('Event description is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for description too short', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const descriptionTextarea = screen.getByPlaceholderText(/detailed description/i);
    fireEvent.change(descriptionTextarea, { target: { value: 'Short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 50 characters')).toBeInTheDocument();
    });
  });

  it('displays character count for description', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const descriptionTextarea = screen.getByPlaceholderText(/detailed description/i);
    fireEvent.change(descriptionTextarea, { target: { value: 'New description text' } });

    await waitFor(() => {
      expect(screen.getByText(/20 characters/)).toBeInTheDocument();
    });
  });

  it('shows validation error when end time is before start time', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const startTimeLabel = screen.getByText('Start Time *');
    const startTimeInput = startTimeLabel.parentElement.querySelector('input[type="time"]');
    const endTimeLabel = screen.getByText('End Time *');
    const endTimeInput = endTimeLabel.parentElement.querySelector('input[type="time"]');

    fireEvent.change(startTimeInput, { target: { value: '14:00' } });
    fireEvent.change(endTimeInput, { target: { value: '13:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(screen.getByText('End time must be after start time')).toBeInTheDocument();
    });
  });

  it('shows validation error when capacity exceeds venue capacity', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());
    await waitFor(() => {
      const venueLabel = screen.getByText('Venue *');
      const venueSelect = venueLabel.parentElement.querySelector('select');
      expect(venueSelect).toBeInTheDocument();
    });

    const venueLabel = screen.getByText('Venue *');
    const venueSelect = venueLabel.parentElement.querySelector('select');
    fireEvent.change(venueSelect, { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue:/i)).toBeInTheDocument();
    });

    const capacityLabel = screen.getByText('Capacity *');
    const capacityInput = capacityLabel.parentElement.querySelector('input[type="number"]');
    fireEvent.change(capacityInput, { target: { value: '600' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(screen.getByText(/Capacity cannot exceed venue capacity of 500/)).toBeInTheDocument();
    });
  });

  it('allows entering tags', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const tagsInput = screen.getByPlaceholderText(/comma-separated/i);
    fireEvent.change(tagsInput, { target: { value: 'networking, career, tech' } });

    expect(tagsInput).toHaveValue('networking, career, tech');
  });

  it('allows entering image URL', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const imageInput = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } });

    expect(imageInput).toHaveValue('https://example.com/image.jpg');
  });

  it('shows error toast and navigates when event is not found', async () => {
    mockGetCategories.mockResolvedValue({ success: true, categories });
    mockGetOrganizerEvents.mockResolvedValue({ success: true, events: [] });

    render(<EditEventPage />);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Event not found', 'error');
      expect(mockNavigate).toHaveBeenCalledWith('/my-events');
    });
  });

  it('shows error toast when update fails', async () => {
    loadDraftSuccess();
    mockUpdateEvent.mockResolvedValue({ success: false, error: 'Update failed' });

    render(<EditEventPage />);
    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    const titleInput = screen.getByPlaceholderText(/fall career fair/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Event' }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Update failed', 'error');
    });
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
