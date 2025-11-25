import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AuditLogsPage from '@pages/AuditLogsPage';
import '../setup/layoutMocks';

const mockFetchAuditLogs = vi.fn();
const mockExportAuditLogs = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1', name: 'Admin', role: 'admin' } }),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin/audit-logs' }),
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@components/admin/AuditLogTable', () => ({
  default: ({ logs }) => (
    <div data-testid="audit-log-table">
      {logs.map((log) => (
        <div key={log.id}>{log.action}</div>
      ))}
    </div>
  ),
}));

vi.mock('@services/adminService', () => ({
  fetchAuditLogs: (...args) => mockFetchAuditLogs(...args),
  exportAuditLogs: (...args) => mockExportAuditLogs(...args),
}));

const mockLogs = [
  {
    id: 'log-1',
    action: 'USER_LOGIN',
    user: 'Alice',
    timestamp: '2024-01-01T10:00:00Z',
    details: 'User logged in',
  },
  {
    id: 'log-2',
    action: 'EVENT_APPROVED',
    user: 'Bob',
    timestamp: '2024-01-02T11:00:00Z',
    details: 'Approved event',
  },
];

const defaultFilters = {
  action: 'all',
  startDate: '',
  endDate: '',
  search: '',
};

describe('AuditLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAuditLogs.mockResolvedValue({ success: true, logs: mockLogs });
  });

  it('shows loading indicator and fetches audit logs with default filters', async () => {
    render(<AuditLogsPage />);

    expect(screen.getByText('Loading audit logs...')).toBeInTheDocument();
    await waitFor(() => expect(mockFetchAuditLogs).toHaveBeenCalledWith(defaultFilters));
  });

  it('renders logs table, count, and enables export button when logs exist', async () => {
    render(<AuditLogsPage />);

    await waitFor(() => expect(screen.getByTestId('audit-log-table')).toBeInTheDocument());

    // "Audit Logs" appears in both Navigation and page content, so use getAllByText
    expect(screen.getAllByText('Audit Logs').length).toBeGreaterThan(0);
    expect(screen.getByText((content) => content.includes('log entries'))).toBeInTheDocument();
    expect(screen.getAllByText(/log/i).length).toBeGreaterThan(0);

    const exportButton = screen.getByRole('button', { name: /export csv/i });
    expect(exportButton).not.toBeDisabled();

    fireEvent.click(exportButton);
    expect(mockExportAuditLogs).toHaveBeenCalledWith(mockLogs);
  });

  it('filters logs when search input changes and allows clearing filters', async () => {
    render(<AuditLogsPage />);
    await waitFor(() => expect(mockFetchAuditLogs).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByPlaceholderText('Search by user, event, or details...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    await waitFor(() =>
      expect(mockFetchAuditLogs).toHaveBeenLastCalledWith({ ...defaultFilters, search: 'Alice' }),
    );

    const filterToggle = screen.getByRole('button', { name: /filters/i });
    fireEvent.click(filterToggle);

    const actionSelect = screen.getByRole('combobox');
    fireEvent.change(actionSelect, { target: { value: 'USER_LOGIN' } });

    await waitFor(() =>
      expect(mockFetchAuditLogs).toHaveBeenLastCalledWith({
        ...defaultFilters,
        action: 'USER_LOGIN',
        search: 'Alice',
      }),
    );

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => expect(searchInput).toHaveValue(''));
    expect(mockFetchAuditLogs).toHaveBeenLastCalledWith(defaultFilters);
  });

  it('disables export button when there are no logs', async () => {
    mockFetchAuditLogs.mockResolvedValueOnce({ success: true, logs: [] });
    render(<AuditLogsPage />);

    await waitFor(() => expect(mockFetchAuditLogs).toHaveBeenCalled());
    const exportButton = screen.getByRole('button', { name: /export csv/i });
    expect(exportButton).toBeDisabled();
  });
});

