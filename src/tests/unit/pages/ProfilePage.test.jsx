import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@pages/ProfilePage';

const mockNavigate = vi.fn();
const mockGetProfile = vi.fn();
const mockUpdateProfile = vi.fn();
const mockUpdateProfilePicture = vi.fn();
const mockUpdatePreferences = vi.fn();
const mockGetUserStats = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@services/profileService', () => ({
  getProfile: (...args) => mockGetProfile(...args),
  updateProfile: (...args) => mockUpdateProfile(...args),
  updateProfilePicture: (...args) => mockUpdateProfilePicture(...args),
  updatePreferences: (...args) => mockUpdatePreferences(...args),
  getUserStats: (...args) => mockGetUserStats(...args),
}));

const profileFixture = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '123-456-7890',
  department: 'Computer Science',
  graduationYear: 2026,
  bio: 'Aspiring software engineer.',
  interests: ['AI', 'Design'],
  profilePicture: 'https://example.com/jane.jpg',
  role: 'student',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    weeklyDigest: true,
  },
  joinedAt: '2022-01-10T00:00:00.000Z',
};

const statsFixture = {
  eventsAttended: 5,
  upcomingEvents: 2,
  eventsCreated: 0,
};

const resolveProfile = () => {
  mockGetProfile.mockResolvedValue({ success: true, data: profileFixture });
  mockGetUserStats.mockResolvedValue({ success: true, data: statsFixture });
  mockUpdateProfile.mockResolvedValue({ success: true, data: profileFixture });
  mockUpdatePreferences.mockResolvedValue({ success: true });
};

const getInputByLabel = (labelText) => {
  const label = screen.getByText(labelText);
  return label.parentElement.querySelector('input, textarea');
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveProfile();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading spinner while fetching profile', () => {
    mockGetProfile.mockReturnValue(new Promise(() => {}));
    mockGetUserStats.mockReturnValue(new Promise(() => {}));
    render(<ProfilePage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders profile details after load', async () => {
    render(<ProfilePage />);

    await screen.findByText('My Profile');
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Computer Science')).toBeInTheDocument();
  });

  it('enters edit mode and validates form before saving', async () => {
    render(<ProfilePage />);
    await screen.findByText('My Profile');

    fireEvent.click(screen.getByText('Edit Profile'));
    const nameInput = getInputByLabel('Full Name *');
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(screen.getByText('Save Changes'));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'J' } });
    fireEvent.click(screen.getByText('Save Changes'));
    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Jane Updated' } });
    fireEvent.change(screen.getByPlaceholderText('XXX-XXX-XXXX'), {
      target: { value: '999-999-9999' },
    });

    fireEvent.click(screen.getByText('Save Changes'));
    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: 'Jane Updated',
          phone: '999-999-9999',
          interests: ['AI', 'Design'],
        }),
      ),
    );
    await screen.findByText('Profile updated successfully!');
  });

  it('cancels edit and restores previous values', async () => {
    render(<ProfilePage />);
    await screen.findByText('My Profile');

    fireEvent.click(screen.getByText('Edit Profile'));
    const nameInput = getInputByLabel('Full Name *');
    fireEvent.change(nameInput, { target: { value: 'Another Name' } });

    fireEvent.click(screen.getByText('Cancel'));
    expect(nameInput).toHaveValue('Jane Doe');
  });

  it('updates notification preferences and shows toast', async () => {
    render(<ProfilePage />);
    await screen.findByText('Preferences');

    fireEvent.click(screen.getByText('Preferences'));
    const smsToggle = screen
      .getByText('SMS Notifications')
      .closest('label')
      .querySelector('input');
    fireEvent.click(smsToggle);

    fireEvent.click(screen.getByText('Save Preferences'));
    await waitFor(() =>
      expect(mockUpdatePreferences).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ smsNotifications: true }),
      ),
    );
    await screen.findByText('Preferences updated successfully!');
  });

  it('switches to stats tab and renders metrics', async () => {
    render(<ProfilePage />);
    await screen.findByText('My Profile');

    fireEvent.click(screen.getByText('Activity'));
    expect(await screen.findByText('Events Attended')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });
});
