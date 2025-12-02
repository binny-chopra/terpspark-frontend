import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import CreateEventPage from '@pages/CreateEventPage';
import { getFieldByLabel } from '../helpers/testUtils';
import '../setup/layoutMocks';

const mockNavigate = vi.fn();
const mockGetCategories = vi.fn();

global.fetch = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'org-1', name: 'Organizer One' } }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/organizer/events/create' }),
}));

vi.mock('@services/eventService', () => ({
  getCategories: (...args) => mockGetCategories(...args),
}));

const categoriesFixture = [
  { id: 'cat-1', name: 'Career', slug: 'career' },
  { id: 'cat-2', name: 'Social', slug: 'social' },
];

const venuesFixture = [
  { 
    id: '1', 
    name: 'Stamp Student Union', 
    building: 'Stamp Student Union', 
    capacity: 500, 
    isActive: true,
    facilities: ['Projector', 'WiFi', 'Sound System']
  },
  { 
    id: '2', 
    name: 'Iribe Center', 
    building: 'Iribe Center for Computer Science', 
    capacity: 300, 
    isActive: true,
    facilities: ['Projector', 'WiFi']
  },
];

describe('CreateEventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
    window.confirm = vi.fn().mockReturnValue(true);
    mockGetCategories.mockResolvedValue({ success: true, categories: categoriesFixture });
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, venues: venuesFixture })
    });
  });

  it('loads and displays categories correctly', async () => {
    render(<CreateEventPage />);

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalledTimes(1));
    
    const categorySelect = getFieldByLabel('Category *');
    expect(categorySelect).toBeInTheDocument();
    
    fireEvent.change(categorySelect, { target: { value: categoriesFixture[0].id } });
    expect(categorySelect.value).toBe(categoriesFixture[0].id);
    
    fireEvent.change(categorySelect, { target: { value: categoriesFixture[1].id } });
    expect(categorySelect.value).toBe(categoriesFixture[1].id);
    
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
  });

  it('allows entering date and times', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    const dateInput = getFieldByLabel('Event Date *');
    const startTimeInput = getFieldByLabel('Start Time *');
    const endTimeInput = getFieldByLabel('End Time *');

    fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
    expect(dateInput.value).toBe('2025-12-15');

    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    expect(startTimeInput.value).toBe('10:00');

    fireEvent.change(endTimeInput, { target: { value: '14:30' } });
    expect(endTimeInput.value).toBe('14:30');
  });

  it('allows entering tags in the tags section', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    const tagsInput = screen.getByPlaceholderText(/comma-separated/i);
    
    fireEvent.change(tagsInput, { target: { value: 'tech, networking, career' } });
    expect(tagsInput.value).toBe('tech, networking, career');
    
    fireEvent.change(tagsInput, { target: { value: 'workshop, AI' } });
    expect(tagsInput.value).toBe('workshop, AI');
  });

  it('shows venue details when a venue is selected', async () => {
    render(<CreateEventPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Select a venue')).toBeInTheDocument();
      expect(screen.getByText(/Stamp Student Union/)).toBeInTheDocument();
    });

    const venueSelect = getFieldByLabel('Venue *');
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[0].id },
    });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    const selectedVenueSection = screen.getByText(/Selected Venue/i).closest('.bg-blue-50');
    expect(within(selectedVenueSection).getByText(/Stamp Student Union/i)).toBeInTheDocument();
    expect(within(selectedVenueSection).getByText(/Max Capacity/i)).toBeInTheDocument();
    expect(within(selectedVenueSection).getByText(/500.*attendees/i)).toBeInTheDocument();

    const facilitiesText = screen.queryByText(/Facilities/i);
    if (facilitiesText) {
      expect(screen.getByText(/Projector/i)).toBeInTheDocument();
      expect(screen.getByText(/WiFi/i)).toBeInTheDocument();
    }
  });

  it('updates venue details when a different venue is selected', async () => {
    render(<CreateEventPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Select a venue')).toBeInTheDocument();
    });

    const venueSelect = getFieldByLabel('Venue *');
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[0].id },
    });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    const firstVenueSection = screen.getByText(/Selected Venue/i).closest('.bg-blue-50');
    expect(within(firstVenueSection).getByText(/Stamp Student Union/i)).toBeInTheDocument();

    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[1].id },
    });

    await waitFor(() => {
      const secondVenueSection = screen.getByText(/Selected Venue/i).closest('.bg-blue-50');
      expect(within(secondVenueSection).getByText(/Iribe Center/i)).toBeInTheDocument();
      expect(within(secondVenueSection).getByText(/300.*attendees/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('cancels and navigates away when user confirms', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Cancel'));
    expect(window.confirm).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/my-events');
  });

  it('handles venue loading error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<CreateEventPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load venues:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles venue response without success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false })
    });

    render(<CreateEventPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('handles venue response with empty venues array', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, venues: [] })
    });

    render(<CreateEventPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('clears venue selection when invalid venue ID is selected', async () => {
    render(<CreateEventPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Select a venue')).toBeInTheDocument();
    });

    const venueSelect = getFieldByLabel('Venue *');
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[0].id },
    });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue/i)).toBeInTheDocument();
    });

    fireEvent.change(venueSelect, {
      target: { value: 'invalid-venue-id' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Selected Venue/i)).not.toBeInTheDocument();
    });
  });
});
