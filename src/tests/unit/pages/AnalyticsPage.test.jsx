import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AnalyticsPage from '@pages/AnalyticsPage';

const mockNavigate = vi.fn();
const mockFetchAnalytics = vi.fn();
const mockExportAnalytics = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1', role: 'admin', name: 'Admin' } }),
}));

vi.mock('@components/layout/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('@components/layout/Navigation', () => ({
  default: () => <div data-testid="navigation" />,
}));

vi.mock('@components/admin/AnalyticsChart', () => ({
  default: ({ title }) => <div>{title}</div>,
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@services/adminService', () => ({
  fetchAnalytics: (...args) => mockFetchAnalytics(...args),
  exportAnalytics: (...args) => mockExportAnalytics(...args),
}));

const analyticsFixture = {
  summary: {
    totalEvents: 12,
    totalRegistrations: 240,
    totalAttendance: 200,
    noShows: 40,
    activeOrganizers: 5,
    pendingApprovals: 3,
  },
  byCategory: [
    { category: 'Career', events: 4, registrations: 100, attendance: 90 },
    { category: 'Social', events: 3, registrations: 80, attendance: 60 },
  ],
  byMonth: [
    { month: 'January 2024', events: 2, registrations: 40 },
    { month: 'February 2024', events: 3, registrations: 60 },
  ],
};

describe('AnalyticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading indicator while analytics are fetched', async () => {
    mockFetchAnalytics.mockResolvedValue({ success: true, analytics: analyticsFixture });

    render(<AnalyticsPage />);

    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
    await waitFor(() => expect(mockFetchAnalytics).toHaveBeenCalledTimes(1));
  });

  it('renders analytics overview when data loads successfully', async () => {
    mockFetchAnalytics.mockResolvedValue({ success: true, analytics: analyticsFixture });

    render(<AnalyticsPage />);

    await waitFor(() => expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument());

    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Total Registrations')).toBeInTheDocument();
    expect(screen.getByText('240')).toBeInTheDocument();
    expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();

    const hasTableCell = (label) =>
      screen.getAllByText(label).some((node) => node.closest('td'));

    expect(hasTableCell('Career')).toBe(true);
    expect(hasTableCell('Social')).toBe(true);
  });

  it('calls exportAnalytics with analytics data when Export CSV is clicked', async () => {
    mockFetchAnalytics.mockResolvedValue({ success: true, analytics: analyticsFixture });

    render(<AnalyticsPage />);

    const exportButton = await screen.findByRole('button', { name: /export csv/i });
    fireEvent.click(exportButton);

    expect(mockExportAnalytics).toHaveBeenCalledWith(analyticsFixture);
  });

  it('shows error message when analytics fail to load', async () => {
    mockFetchAnalytics.mockResolvedValue({ success: false });

    render(<AnalyticsPage />);

    await waitFor(() =>
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument(),
    );
  });
});

