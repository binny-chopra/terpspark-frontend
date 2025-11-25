import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ApprovalsPage from '@pages/ApprovalsPage';
import '../setup/layoutMocks';

const mockFetchPendingOrganizers = vi.fn();
const mockFetchPendingEvents = vi.fn();
const mockApproveOrganizer = vi.fn();
const mockRejectOrganizer = vi.fn();
const mockApproveEvent = vi.fn();
const mockRejectEvent = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-42', name: 'Admin', role: 'admin' } }),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin/approvals' }),
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@components/admin/ApprovalCard', () => ({
  default: ({ item, type, onApprove, onReject }) => (
    <div data-testid={`${type}-card-${item.id}`}>
      <p>{`${type}-${item.name}`}</p>
      <button onClick={() => onApprove(item.id, 'notes')} data-testid={`approve-${type}-${item.id}`}>
        Approve
      </button>
      <button onClick={() => onReject(item.id, 'notes')} data-testid={`reject-${type}-${item.id}`}>
        Reject
      </button>
    </div>
  ),
}));

vi.mock('@services/adminService', () => ({
  fetchPendingOrganizers: (...args) => mockFetchPendingOrganizers(...args),
  fetchPendingEvents: (...args) => mockFetchPendingEvents(...args),
  approveOrganizer: (...args) => mockApproveOrganizer(...args),
  rejectOrganizer: (...args) => mockRejectOrganizer(...args),
  approveEvent: (...args) => mockApproveEvent(...args),
  rejectEvent: (...args) => mockRejectEvent(...args),
}));

const organizers = [
  { id: 'org-1', name: 'Alice', email: 'alice@uni.edu' },
  { id: 'org-2', name: 'Bob', email: 'bob@uni.edu' },
];

const events = [
  { id: 'evt-1', name: 'Welcome Week', date: '2024-09-01' },
];

describe('ApprovalsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it('displays loading spinner while data is fetched', async () => {
    mockFetchPendingOrganizers.mockResolvedValue({ success: true, requests: organizers });
    mockFetchPendingEvents.mockResolvedValue({ success: true, events });

    render(<ApprovalsPage />);

    expect(screen.getByText('Loading approvals...')).toBeInTheDocument();
    await waitFor(() => expect(mockFetchPendingOrganizers).toHaveBeenCalledTimes(1));
  });

  it('renders organizer requests by default with counts', async () => {
    mockFetchPendingOrganizers.mockResolvedValue({ success: true, requests: organizers });
    mockFetchPendingEvents.mockResolvedValue({ success: true, events });

    render(<ApprovalsPage />);

    // "Approvals" appears in both Navigation and page content, so use getAllByText
    await waitFor(() => expect(screen.getAllByText('Approvals').length).toBeGreaterThan(0));

    expect(screen.getByText('Pending Organizers')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Pending Events')).toBeInTheDocument();
    expect(screen.getAllByText('Organizer Requests (2)')[0]).toBeInTheDocument();
    expect(screen.getByTestId('organizer-card-org-1')).toBeInTheDocument();
  });

  it('switches to event submissions tab and renders event cards', async () => {
    mockFetchPendingOrganizers.mockResolvedValue({ success: true, requests: organizers });
    mockFetchPendingEvents.mockResolvedValue({ success: true, events });

    render(<ApprovalsPage />);

    const eventTab = await screen.findByRole('button', { name: /event submissions/i });
    fireEvent.click(eventTab);

    await waitFor(() => expect(screen.getByTestId('event-card-evt-1')).toBeInTheDocument());
    expect(screen.getByText('event-Welcome Week')).toBeInTheDocument();
  });

  it('handles approving organizer and refreshes data', async () => {
    mockFetchPendingOrganizers.mockResolvedValue({ success: true, requests: organizers });
    mockFetchPendingEvents.mockResolvedValue({ success: true, events });
    mockApproveOrganizer.mockResolvedValue({ success: true });

    render(<ApprovalsPage />);

    const approveButton = await screen.findByTestId('approve-organizer-org-1');
    fireEvent.click(approveButton);

    await waitFor(() => expect(mockApproveOrganizer).toHaveBeenCalledWith('org-1', { id: 'admin-42', name: 'Admin', role: 'admin' }, 'notes'));
    expect(window.alert).toHaveBeenCalledWith('Organizer approved successfully!');
    await waitFor(() => expect(mockFetchPendingOrganizers).toHaveBeenCalledTimes(2));
    expect(mockFetchPendingEvents).toHaveBeenCalledTimes(2);
  });

  it('shows empty states when there are no pending requests', async () => {
    mockFetchPendingOrganizers.mockResolvedValue({ success: true, requests: [] });
    mockFetchPendingEvents.mockResolvedValue({ success: true, events: [] });

    render(<ApprovalsPage />);

    await waitFor(() => expect(screen.getByText('No Pending Requests')).toBeInTheDocument());

    const eventTab = screen.getByRole('button', { name: /event submissions/i });
    fireEvent.click(eventTab);

    await waitFor(() => expect(screen.getByText('No Pending Events')).toBeInTheDocument());
  });
});

