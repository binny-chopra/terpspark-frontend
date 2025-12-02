import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

global.fetch = vi.fn();

vi.mock('@services/authService', () => ({
  getAuthToken: () => 'mock-token'
}));

const ADMIN_USER = { id: 999, name: 'Test Admin', role: 'admin' };

describe('adminService', () => {
  let adminService;

  beforeEach(async () => {
    global.fetch.mockClear();
    adminService = await setupServiceBeforeEach('@services/adminService');
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    setupServiceAfterEach();
  });

  it('fetches pending organizers and events', async () => {
    const mockOrganizers = [
      { id: 1, name: 'Org 1', status: 'pending' },
      { id: 2, name: 'Org 2', status: 'pending' }
    ];
    const mockEvents = [
      { id: 1, title: 'Event 1', status: 'pending' },
      { id: 2, title: 'Event 2', status: 'pending' }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ requests: mockOrganizers })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ events: mockEvents })
      });

    vi.useFakeTimers();
    const orgPromise = adminService.fetchPendingOrganizers();
    const eventPromise = adminService.fetchPendingEvents();
    await flushTimers();
    const orgResult = await orgPromise;
    const eventResult = await eventPromise;

    expect(orgResult.success).toBe(true);
    expect(orgResult.requests.every(req => req.status === 'pending')).toBe(true);
    expect(eventResult.success).toBe(true);
    expect(eventResult.events.every(evt => evt.status === 'pending')).toBe(true);
  });

  it('approves and rejects organizer requests while logging actions', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Organizer approved successfully' })
    });

    vi.useFakeTimers();
    const approvePromise = adminService.approveOrganizer(1, ADMIN_USER, 'All good');
    await flushTimers();
    const approveResult = await approvePromise;
    expect(approveResult.success).toBe(true);

    const rejectPromise = adminService.rejectOrganizer(2, ADMIN_USER, '');
    await flushTimers();
    const rejectResult = await rejectPromise;
    expect(rejectResult.success).toBe(false);
    expect(rejectResult.error).toMatch(/notes required/i);
  });

  it('approves events and records audit entries', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Event approved successfully' })
    });

    vi.useFakeTimers();
    const approvePromise = adminService.approveEvent(1, ADMIN_USER, 'Ship it');
    await flushTimers();
    const approveResult = await approvePromise;
    expect(approveResult.success).toBe(true);
  });

  it('creates categories and prevents duplicate slugs', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Category created successfully', category: { id: 1, name: 'Unique Cat', slug: 'unique-cat' } })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: { get: () => 'application/json' },
        json: async () => ({ error: 'Category with this slug already exists' })
      });

    vi.useFakeTimers();
    const createPromise = adminService.createCategory({ name: 'Unique Cat', slug: 'unique-cat' }, ADMIN_USER);
    await flushTimers();
    const createResult = await createPromise;
    expect(createResult.success).toBe(true);

    const duplicatePromise = adminService.createCategory({ name: 'Duplicate', slug: 'unique-cat' }, ADMIN_USER);
    await flushTimers();
    const duplicateResult = await duplicatePromise;
    expect(duplicateResult.success).toBe(false);
    expect(duplicateResult.error).toMatch(/already exists/i);
  });

  it('toggles category activity and fetches filters for audit logs', async () => {
    const mockCategories = [
      { id: 1, name: 'Category 1', slug: 'cat-1', isActive: true }
    ];
    const mockAuditLogs = [
      { id: 1, action: 'USER_LOGIN', timestamp: new Date().toISOString() },
      { id: 2, action: 'USER_LOGIN', timestamp: new Date().toISOString() }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ categories: mockCategories })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Category updated successfully' })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ logs: mockAuditLogs })
      });

    vi.useFakeTimers();
    const categoriesPromise = adminService.fetchCategories();
    await flushTimers();
    const categoriesResult = await categoriesPromise;
    const categoryId = categoriesResult.categories[0].id;

    const retirePromise = adminService.retireCategory(categoryId, ADMIN_USER);
    await flushTimers();
    const retireResult = await retirePromise;
    expect(retireResult.success).toBe(true);

    const auditPromise = adminService.fetchAuditLogs({ action: 'USER_LOGIN' });
    await flushTimers();
    const auditResult = await auditPromise;
    expect(auditResult.success).toBe(true);
    expect(auditResult.logs.every(log => log.action === 'USER_LOGIN')).toBe(true);
  });

  it('provides analytics and dashboard stats', async () => {
    const mockAnalytics = {
      summary: { totalEvents: 100, totalUsers: 50 }
    };
    const mockStats = {
      pendingOrganizers: 5,
      pendingEvents: 3
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ analytics: mockAnalytics })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ stats: mockStats })
      });

    vi.useFakeTimers();
    const analyticsPromise = adminService.fetchAnalytics();
    const statsPromise = adminService.fetchDashboardStats();
    await flushTimers();

    const analyticsResult = await analyticsPromise;
    const statsResult = await statsPromise;
    expect(analyticsResult.success).toBe(true);
    expect(analyticsResult.analytics.summary).toHaveProperty('totalEvents');

    expect(statsResult.success).toBe(true);
    expect(statsResult.stats).toHaveProperty('pendingOrganizers');
  });

  it('fetches venues successfully', async () => {
    const mockVenues = [
      { id: 1, name: 'Venue 1', capacity: 100 },
      { id: 2, name: 'Venue 2', capacity: 200 }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ venues: mockVenues })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.venues).toEqual(mockVenues);
  });

  it('creates venue successfully', async () => {
    const venueData = { name: 'New Venue', capacity: 150 };
    const mockVenue = { id: 3, ...venueData };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ venue: mockVenue, message: 'Venue created successfully' })
    });

    vi.useFakeTimers();
    const promise = adminService.createVenue(venueData, ADMIN_USER);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.venue).toEqual(mockVenue);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/venues'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(venueData)
      })
    );
  });

  it('updates venue successfully', async () => {
    const updates = { capacity: 200 };
    const mockVenue = { id: 1, name: 'Updated Venue', capacity: 200 };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ venue: mockVenue, message: 'Venue updated successfully' })
    });

    vi.useFakeTimers();
    const promise = adminService.updateVenue(1, updates, ADMIN_USER);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.venue).toEqual(mockVenue);
  });

  it('retires venue successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Venue retired successfully' })
    });

    vi.useFakeTimers();
    const promise = adminService.retireVenue(1, ADMIN_USER);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/venues/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('rejects event with notes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Event rejected' })
    });

    vi.useFakeTimers();
    const promise = adminService.rejectEvent(1, ADMIN_USER, 'Rejection reason');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.message).toContain('rejected');
  });

  it('rejects event without notes returns error', async () => {
    vi.useFakeTimers();
    const promise = adminService.rejectEvent(1, ADMIN_USER, '');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/notes required/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('updates category successfully', async () => {
    const updates = { name: 'Updated Category' };
    const mockCategory = { id: 1, name: 'Updated Category', slug: 'updated-category' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ category: mockCategory, message: 'Category updated successfully' })
    });

    vi.useFakeTimers();
    const promise = adminService.updateCategory(1, updates, ADMIN_USER);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.category).toEqual(mockCategory);
  });

  it('fetches audit logs with filters', async () => {
    const mockLogs = [
      { id: 1, action: 'USER_LOGIN', timestamp: '2024-01-01T00:00:00Z' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ logs: mockLogs, pagination: { page: 1, limit: 10, total: 1 } })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchAuditLogs({
      action: 'USER_LOGIN',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      search: 'test',
      userId: '123',
      page: 1,
      limit: 10
    });
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.logs).toEqual(mockLogs);
    expect(result.pagination).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('action=USER_LOGIN'),
      expect.any(Object)
    );
  });

  it('exports audit logs as CSV', async () => {
    const mockCSV = 'id,action,timestamp\n1,USER_LOGIN,2024-01-01';
    const mockCreateObjectURL = vi.fn(() => 'blob:url');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();

    global.window.URL.createObjectURL = mockCreateObjectURL;
    global.window.URL.revokeObjectURL = mockRevokeObjectURL;

    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    };
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/csv' },
      text: async () => mockCSV
    });

    vi.useFakeTimers();
    const promise = adminService.exportAuditLogs({ action: 'USER_LOGIN' });
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
    expect(mockLink.download).toMatch(/audit_logs_.*\.csv/);

    createElementSpy.mockRestore();
  });

  it('exports analytics as CSV', async () => {
    const mockCSV = 'date,events,registrations\n2024-01-01,10,50';
    const mockCreateObjectURL = vi.fn(() => 'blob:url');
    const mockRevokeObjectURL = vi.fn();
    const mockClick = vi.fn();

    global.window.URL.createObjectURL = mockCreateObjectURL;
    global.window.URL.revokeObjectURL = mockRevokeObjectURL;

    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    };
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/csv' },
      text: async () => mockCSV
    });

    vi.useFakeTimers();
    const promise = adminService.exportAnalytics({ startDate: '2024-01-01', endDate: '2024-01-31' });
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(mockLink.download).toMatch(/analytics_.*\.csv/);

    createElementSpy.mockRestore();
  });

  it('handles fetchPendingOrganizers with different status', async () => {
    const mockOrganizers = [{ id: 1, name: 'Org 1', status: 'approved' }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ requests: mockOrganizers })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchPendingOrganizers('approved');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('status=approved'),
      expect.any(Object)
    );
  });

  it('handles parseResponse with text content', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => 'Success'
    });

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
  });

  it('handles network errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();

    try {
      await promise;
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).toBe('Network error');
    }
  });

  it('handles error responses with detail message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: 'Invalid request data' })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid request data');
  });

  it('handles error responses with error message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Server error occurred' })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toBe('Server error occurred');
  });

  it('handles error responses with message field', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Resource not found' })
    });

    vi.useFakeTimers();
    const promise = adminService.fetchVenues();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toBe('Resource not found');
  });

  it('handles export errors gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Export failed' })
    });

    vi.useFakeTimers();
    const promise = adminService.exportAuditLogs();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toBe('Export failed');
  });
});

