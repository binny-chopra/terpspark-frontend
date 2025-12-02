import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuditLogTable from '@components/admin/AuditLogTable';

describe('AuditLogTable', () => {
  const mockLogs = [
    {
      id: 1,
      timestamp: '2025-12-01T10:00:00Z',
      action: 'USER_LOGIN',
      actor: { name: 'John Doe', role: 'student' },
      target: { name: 'John Doe', type: 'user' },
      details: 'User logged in successfully'
    },
    {
      id: 2,
      timestamp: '2025-12-01T11:00:00Z',
      action: 'EVENT_CREATED',
      actor: { name: 'Jane Organizer', role: 'organizer' },
      target: { name: 'Tech Talk', type: 'event' },
      details: 'Created new event'
    },
    {
      id: 3,
      timestamp: '2025-12-01T12:00:00Z',
      action: 'ORGANIZER_APPROVED',
      actor: { name: 'Admin User', role: 'admin' },
      target: { name: 'New Organizer', type: 'organizer' },
      details: 'Organizer account approved'
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no logs provided', () => {
    render(<AuditLogTable logs={[]} />);

    expect(screen.getByText('No Audit Logs Found')).toBeInTheDocument();
    expect(screen.getByText('No logs match your current filters.')).toBeInTheDocument();
  });

  it('renders table with logs', () => {
    render(<AuditLogTable logs={mockLogs} />);

    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Actor')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('displays log entries with correct data', () => {
    render(<AuditLogTable logs={mockLogs} />);

    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    expect(screen.getByText('User logged in successfully')).toBeInTheDocument();
    expect(screen.getByText('Tech Talk')).toBeInTheDocument();
    expect(screen.getByText('Created new event')).toBeInTheDocument();
  });

  it('displays correct action labels for different action types', () => {
    render(<AuditLogTable logs={mockLogs} />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Event Created')).toBeInTheDocument();
    expect(screen.getByText('Org Approved')).toBeInTheDocument();
  });


  it('displays System when actor is not provided', () => {
    const logsWithoutActor = [{
      id: 1,
      timestamp: '2025-12-01T10:00:00Z',
      action: 'EVENT_CREATED',
      actor: null,
      target: { name: 'Event', type: 'event' },
      details: 'System created event'
    }];

    render(<AuditLogTable logs={logsWithoutActor} />);

    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('displays dash when target is not provided', () => {
    const logsWithoutTarget = [{
      id: 1,
      timestamp: '2025-12-01T10:00:00Z',
      action: 'USER_LOGIN',
      actor: { name: 'User', role: 'student' },
      target: null,
      details: 'User logged in'
    }];

    render(<AuditLogTable logs={logsWithoutTarget} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<AuditLogTable logs={mockLogs} />);

    const timestamps = screen.getAllByText(/Dec 1, 2025/);
    expect(timestamps.length).toBeGreaterThan(0);
  });

  it('handles unknown action types with default config', () => {
    const logsWithUnknownAction = [{
      id: 1,
      timestamp: '2025-12-01T10:00:00Z',
      action: 'UNKNOWN_ACTION',
      actor: { name: 'User', role: 'student' },
      target: { name: 'Target', type: 'target' },
      details: 'Unknown action occurred'
    }];

    render(<AuditLogTable logs={logsWithUnknownAction} />);

    expect(screen.getByText('UNKNOWN_ACTION')).toBeInTheDocument();
  });

  it('displays all action types correctly', () => {
    const allActionLogs = [
      { id: 1, timestamp: '2025-12-01T10:00:00Z', action: 'ORGANIZER_REJECTED', actor: { name: 'Admin', role: 'admin' }, target: null, details: 'Rejected' },
      { id: 2, timestamp: '2025-12-01T10:00:00Z', action: 'EVENT_APPROVED', actor: { name: 'Admin', role: 'admin' }, target: null, details: 'Approved' },
      { id: 3, timestamp: '2025-12-01T10:00:00Z', action: 'EVENT_REJECTED', actor: { name: 'Admin', role: 'admin' }, target: null, details: 'Rejected' },
      { id: 4, timestamp: '2025-12-01T10:00:00Z', action: 'CHECK_IN', actor: { name: 'User', role: 'student' }, target: null, details: 'Checked in' },
    ];

    render(<AuditLogTable logs={allActionLogs} />);

    expect(screen.getByText('Org Rejected')).toBeInTheDocument();
    expect(screen.getByText('Event Approved')).toBeInTheDocument();
    expect(screen.getByText('Event Rejected')).toBeInTheDocument();
    expect(screen.getByText('Check-in')).toBeInTheDocument();
  });
});
