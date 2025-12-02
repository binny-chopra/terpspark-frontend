import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

// Venue IDs must be strings to match HTML select values (which are always strings)
// Component does: venues.find(v => v.id === venueId) with strict equality
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
    // Mock venues fetch - API returns { success: true, venues: [...] }
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, venues: venuesFixture })
    });
  });

  it('loads and displays categories correctly', async () => {
    render(<CreateEventPage />);

    await waitFor(() => expect(mockGetCategories).toHaveBeenCalledTimes(1));
    
    // Verify categories are rendered in the dropdown
    const categorySelect = getFieldByLabel('Category *');
    expect(categorySelect).toBeInTheDocument();
    
    // Check that category options are available (component uses category.id as value)
    fireEvent.change(categorySelect, { target: { value: categoriesFixture[0].id } });
    expect(categorySelect.value).toBe(categoriesFixture[0].id);
    
    fireEvent.change(categorySelect, { target: { value: categoriesFixture[1].id } });
    expect(categorySelect.value).toBe(categoriesFixture[1].id);
    
    // Verify category names are displayed
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
  });

  it('allows entering date and times', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    const dateInput = getFieldByLabel('Event Date *');
    const startTimeInput = getFieldByLabel('Start Time *');
    const endTimeInput = getFieldByLabel('End Time *');

    // Test date input
    fireEvent.change(dateInput, { target: { value: '2025-12-15' } });
    expect(dateInput.value).toBe('2025-12-15');

    // Test start time input
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    expect(startTimeInput.value).toBe('10:00');

    // Test end time input
    fireEvent.change(endTimeInput, { target: { value: '14:30' } });
    expect(endTimeInput.value).toBe('14:30');
  });

  it('allows entering tags in the tags section', async () => {
    render(<CreateEventPage />);
    await waitFor(() => expect(mockGetCategories).toHaveBeenCalled());

    const tagsInput = screen.getByPlaceholderText(/comma-separated/i);
    
    // Enter tags
    fireEvent.change(tagsInput, { target: { value: 'tech, networking, career' } });
    expect(tagsInput.value).toBe('tech, networking, career');
    
    // Change tags
    fireEvent.change(tagsInput, { target: { value: 'workshop, AI' } });
    expect(tagsInput.value).toBe('workshop, AI');
  });

  it('shows venue details when a venue is selected', async () => {
    render(<CreateEventPage />);
    
    // Wait for venues to load
    await waitFor(() => {
      expect(screen.getByText('Select a venue')).toBeInTheDocument();
      expect(screen.getByText(/Stamp Student Union/)).toBeInTheDocument();
    });

    // Select a venue - HTML select values are strings, venue IDs are strings
    const venueSelect = getFieldByLabel('Venue *');
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[0].id },
    });

    // Wait for venue details to appear - component shows "Selected Venue" when venue is found
    await waitFor(() => {
      expect(screen.getByText(/Selected Venue/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify venue details are displayed in the selected venue section (not just in the dropdown)
    const selectedVenueSection = screen.getByText(/Selected Venue/i).closest('.bg-blue-50');
    expect(within(selectedVenueSection).getByText(/Stamp Student Union/i)).toBeInTheDocument();
    expect(within(selectedVenueSection).getByText(/Max Capacity/i)).toBeInTheDocument();
    expect(within(selectedVenueSection).getByText(/500.*attendees/i)).toBeInTheDocument();

    // Check that facilities are shown if available
    const facilitiesText = screen.queryByText(/Facilities/i);
    if (facilitiesText) {
      expect(screen.getByText(/Projector/i)).toBeInTheDocument();
      expect(screen.getByText(/WiFi/i)).toBeInTheDocument();
    }
  });

  it('updates venue details when a different venue is selected', async () => {
    render(<CreateEventPage />);
    
    // Wait for venues to load
    await waitFor(() => {
      expect(screen.getByText('Select a venue')).toBeInTheDocument();
    });

    // Select first venue
    const venueSelect = getFieldByLabel('Venue *');
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[0].id },
    });

    await waitFor(() => {
      expect(screen.getByText(/Selected Venue/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify first venue details are in the selected venue section
    const firstVenueSection = screen.getByText(/Selected Venue/i).closest('.bg-blue-50');
    expect(within(firstVenueSection).getByText(/Stamp Student Union/i)).toBeInTheDocument();

    // Select second venue
    fireEvent.change(venueSelect, {
      target: { value: venuesFixture[1].id },
    });

    await waitFor(() => {
      // Wait for the selected venue section to update
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
});
