import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationsPage from '@pages/NotificationsPage';

const mockNavigate = vi.fn();
const mockGetNotifications = vi.fn();
const mockMarkAsRead = vi.fn();
const mockMarkAllAsRead = vi.fn();
const mockDeleteNotification = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@services/notificationService', () => ({
  getNotifications: (...args) => mockGetNotifications(...args),
  markAsRead: (...args) => mockMarkAsRead(...args),
  markAllAsRead: (...args) => mockMarkAllAsRead(...args),
  deleteNotification: (...args) => mockDeleteNotification(...args),
}));

const baseNotifications = [
  {
    id: 1,
    title: 'Registration Confirmed',
    message: 'You are registered for AI Summit.',
    type: 'registration_confirmed',
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedEvent: { id: 'evt-1', title: 'AI Summit' },
  },
  {
    id: 2,
    title: 'Event Reminder',
    message: 'Career Fair starts tomorrow.',
    type: 'event_reminder',
    isRead: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'System Update',
    message: 'Platform maintenance tonight.',
    type: 'system',
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

const resolveNotifications = () => {
  mockGetNotifications.mockResolvedValue({
    success: true,
    data: baseNotifications,
  });
  mockMarkAsRead.mockResolvedValue({ success: true });
  mockMarkAllAsRead.mockResolvedValue({ success: true });
  mockDeleteNotification.mockResolvedValue({ success: true });
};

describe('NotificationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveNotifications();
    window.confirm = vi.fn().mockReturnValue(true);
  });

  it('shows loading spinner while fetching notifications', () => {
    mockGetNotifications.mockReturnValue(new Promise(() => {}));
    render(<NotificationsPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders notifications, marks as read, and navigates to event', async () => {
    render(<NotificationsPage />);

    await waitFor(() => expect(screen.getByText('Notifications')).toBeInTheDocument());
    expect(screen.getByText('Registration Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Event Reminder')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Registration Confirmed'));

    await waitFor(() => expect(mockMarkAsRead).toHaveBeenCalledWith(1));
    expect(mockNavigate).toHaveBeenCalledWith('/events/evt-1');
  });

  it('marks all notifications as read when clicking bulk action', async () => {
    render(<NotificationsPage />);
    await screen.findByText('Notifications');

    fireEvent.click(screen.getByText('Mark All as Read'));
    await waitFor(() => expect(mockMarkAllAsRead).toHaveBeenCalledWith(1));
  });

  it('filters by type and unread only', async () => {
    render(<NotificationsPage />);
    await screen.findByText('Notifications');

    fireEvent.click(screen.getByText('Reminders'));
    await waitFor(() => expect(screen.getByText('Event Reminder')).toBeInTheDocument());
    expect(screen.queryByText('Registration Confirmed')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /Unread only/ }));
    await screen.findByRole('heading', { name: 'No notifications' });
    expect(screen.getByText('No notifications match your filters')).toBeInTheDocument();
  });

  it('shows empty state when filters remove all notifications', async () => {
    render(<NotificationsPage />);
    await screen.findByText('Notifications');

    fireEvent.click(screen.getByText('System'));
    fireEvent.click(screen.getByRole('checkbox', { name: /Unread only/ }));

    await screen.findByRole('heading', { name: 'No notifications' });
    expect(screen.getByText('No notifications match your filters')).toBeInTheDocument();
  });

  it('deletes a notification after confirmation', async () => {
    render(<NotificationsPage />);
    await screen.findByText('Notifications');

    const deleteButtons = await screen.findAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
    await waitFor(() => expect(mockDeleteNotification).toHaveBeenCalledWith(1));
  });
});
