import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditEventPage from '@pages/EditEventPage';

const mockNavigate = vi.fn();
const mockGetEventById = vi.fn();
const mockGetAllCategories = vi.fn();
const mockUpdateEvent = vi.fn();

vi.mock('react-router-dom', () => ({
  useParams: () => ({ eventId: 'evt-1' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@services/organizerService', () => ({
  getEventById: (...args) => mockGetEventById(...args),
  updateEvent: (...args) => mockUpdateEvent(...args),
}));

vi.mock('@services/eventService', () => ({
  getAllCategories: (...args) => mockGetAllCategories(...args),
}));

const draftEvent = {
  id: 'evt-1',
  title: 'Tech Talk',
  description: 'A'.repeat(60),
  categoryId: 'cat-1',
  date: '2099-05-01',
  startTime: '10:00',
  endTime: '11:00',
  venue: 'Stamp',
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
  mockGetEventById.mockResolvedValue({ success: true, data: draftEvent });
  mockGetAllCategories.mockResolvedValue({ success: true, data: categories });
};

describe('EditEventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true);
  });

  it('shows loading spinner while fetching event data', () => {
    loadDraftSuccess();
    mockGetEventById.mockReturnValue(new Promise(() => {})); // keep pending
    render(<EditEventPage />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('renders edit form when event loads successfully', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Tech Talk')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Grand Ballroom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('prevents submission if validation fails and shows toast message', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Enter event title'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByText('Please fix the errors in the form')).toBeInTheDocument();
    expect(mockUpdateEvent).not.toHaveBeenCalled();
  });

  it('submits updates for draft events and navigates back on success', async () => {
    loadDraftSuccess();
    mockUpdateEvent.mockResolvedValue({ success: true });

    render(<EditEventPage />);
    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Enter event title'), {
      target: { value: 'Updated Tech Talk' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() =>
      expect(mockUpdateEvent).toHaveBeenCalledWith('evt-1', expect.objectContaining({
        title: 'Updated Tech Talk',
        tags: draftEvent.tags,
      })),
    );

    expect(await screen.findByText('Event updated successfully!')).toBeInTheDocument();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/organizer/events'), {
      timeout: 2000,
    });
  });

  it('requires change note when editing pending events', async () => {
    mockGetEventById.mockResolvedValue({ success: true, data: pendingEvent });
    mockGetAllCategories.mockResolvedValue({ success: true, data: categories });

    render(<EditEventPage />);
    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Enter event title'), {
      target: { value: 'Pending Update' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByText('Change note is required when editing pending events')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Briefly explain what changes you made...'), {
      target: { value: 'Adjusted schedule' },
    });

    mockUpdateEvent.mockResolvedValue({ success: true });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(mockUpdateEvent).toHaveBeenCalled());
    expect(await screen.findByText('Event resubmitted for approval')).toBeInTheDocument();
  });

  it('shows cannot edit screen when event is published', async () => {
    mockGetEventById.mockResolvedValue({
      success: true,
      data: { ...draftEvent, status: 'published' },
    });
    mockGetAllCategories.mockResolvedValue({ success: true, data: categories });

    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Cannot Edit Event')).toBeInTheDocument());
    expect(screen.getByText(/Events with status "published" cannot be edited/)).toBeInTheDocument();
  });

  it('navigates back when cancel is confirmed', async () => {
    loadDraftSuccess();
    render(<EditEventPage />);

    await waitFor(() => expect(screen.getByText('Edit Event')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/organizer/events');
  });
});
