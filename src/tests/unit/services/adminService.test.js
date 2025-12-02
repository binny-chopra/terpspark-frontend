import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

// Mock fetch globally
global.fetch = vi.fn();

// Mock authService.getAuthToken
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
});

