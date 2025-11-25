import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateEventPage from '@pages/CreateEventPage';

const mockNavigate = vi.fn();
const mockGetCategories = vi.fn();
const mockCreateEvent = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'org-1', name: 'Organizer One' } }),
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

const getFieldByLabel = (labelText) => {
  const label = screen.getByText(labelText);
  return label.parentElement.querySelector('input, textarea, select');
};

const fillValidForm = () => {
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
  fireEvent.change(getFieldByLabel('Venue Name *'), {
    target: { value: 'Grand Ballroom' },
  });
  fireEvent.change(getFieldByLabel('Building/Location *'), {
    target: { value: 'Stamp' },
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
    window.alert = vi.fn();
    window.confirm = vi.fn().mockReturnValue(true);
    mockGetCategories.mockResolvedValue({ success: true, categories: categoriesFixture });
    mockCreateEvent.mockResolvedValue({ success: true });
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

    fillValidForm();
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

    expect(window.alert).toHaveBeenCalledWith(
      'Event created successfully! It will be visible after admin approval.',
    );
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });

  it('handles failed submission and shows alert', async () => {
    mockCreateEvent.mockResolvedValueOnce({ success: false, error: 'Failed' });

    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    fillValidForm();
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => expect(mockCreateEvent).toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith('Failed');
  });

  it('cancels and navigates away when user confirms', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Cancel'));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });
});
