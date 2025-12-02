import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateEventPage from '@pages/CreateEventPage';
import { getFieldByLabel } from '../helpers/testUtils';
import '../setup/layoutMocks';

const mockNavigate = vi.fn();
const mockGetCategories = vi.fn();
const mockCreateEvent = vi.fn();
const mockAddToast = vi.fn();

// Mock fetch for venues
global.fetch = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'org-1', name: 'Organizer One' } }),
}));

vi.mock('@context/ToastContext', () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/organizer/events/create' }),
}));

vi.mock('@services/eventService', () => ({
  getCategories: (...args) => mockGetCategories(...args),
}));

vi.mock('@services/organizerService', () => ({
  createEvent: (...args) => mockCreateEvent(...args),
}));

const categoriesFixture = [
  { id: 'cat-1', name: 'Career', slug: 'career' },
  { id: 'cat-2', name: 'Social', slug: 'social' },
];

const venuesFixture = [
  { id: 1, name: 'Stamp Student Union', building: 'Stamp Student Union', capacity: 500, isActive: true },
  { id: 2, name: 'Iribe Center', building: 'Iribe Center for Computer Science', capacity: 300, isActive: true },
];

const fillValidForm = async () => {
  fireEvent.change(screen.getByPlaceholderText(/fall career fair/i), {
    target: { value: 'Tech Meetup' },
  });
  fireEvent.change(screen.getByPlaceholderText(/detailed description/i), {
    target: { value: 'A'.repeat(60) },
  });
  fireEvent.change(getFieldByLabel('Category *'), { target: { value: 'career' } });
  fireEvent.change(getFieldByLabel('Event Date *'), { target: { value: '2099-01-01' } });
  fireEvent.change(getFieldByLabel('Start Time *'), { target: { value: '10:00' } });
  fireEvent.change(getFieldByLabel('End Time *'), { target: { value: '11:00' } });
  
  // Wait for venue dropdown to be populated
  await waitFor(() => {
    const venueSelect = getFieldByLabel('Venue *');
    expect(venueSelect).toBeInTheDocument();
  });
  
  fireEvent.change(getFieldByLabel('Venue *'), {
    target: { value: '1' },
  });
  fireEvent.change(getFieldByLabel('Capacity *'), {
    target: { value: '100' },
  });
  fireEvent.change(screen.getByPlaceholderText(/comma-separated/i), {
    target: { value: 'tech, networking' },
  });
  fireEvent.change(screen.getByPlaceholderText(/https:\/\/example\.com\/image\.jpg/i), {
    target: { value: 'https://example.com/image.jpg' },
  });
};

describe('CreateEventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
    window.confirm = vi.fn().mockReturnValue(true);
    mockGetCategories.mockResolvedValue({ success: true, categories: categoriesFixture });
    mockCreateEvent.mockResolvedValue({ success: true });
    // Mock venues fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ venues: venuesFixture })
    });
  });

  it('loads categories on mount and renders the form', async () => {
    render(<CreateEventPage />);

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/fall career fair/i)).toBeInTheDocument();
  });

  it('validates required fields and shows error messages', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Create Event'));

    expect(screen.getByText('Event title is required')).toBeInTheDocument();
    expect(screen.getByText('Event description is required')).toBeInTheDocument();
    expect(mockCreateEvent).not.toHaveBeenCalled();
  });

  it('submits form successfully and navigates to My Events', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    await fillValidForm();
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() =>
      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tech Meetup',
          tags: ['tech', 'networking'],
          organizerId: 'org-1',
          capacity: 100,
        }),
      ),
    );

    expect(mockAddToast).toHaveBeenCalledWith('Event created successfully! Awaiting admin approval.', 'success');
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });

  it('handles failed submission and shows alert', async () => {
    mockCreateEvent.mockResolvedValueOnce({ success: false, error: 'Failed' });

    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    await fillValidForm();
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => expect(mockCreateEvent).toHaveBeenCalled());
    expect(mockAddToast).toHaveBeenCalledWith('Failed', 'error');
  });

  it('cancels and navigates away when user confirms', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Cancel'));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });
});
