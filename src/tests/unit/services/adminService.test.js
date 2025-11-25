import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

const ADMIN_USER = { id: 999, name: 'Test Admin', role: 'admin' };

describe('adminService', () => {
  let adminService;

  beforeEach(async () => {
    vi.resetModules();
    adminService = await import('@services/adminService');
    localStorage.clear();
    vi.useRealTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('fetches pending organizers and events', async () => {
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
    vi.useFakeTimers();
    const approvePromise = adminService.approveOrganizer(1, ADMIN_USER, 'All good');
    await flushTimers();
    const approveResult = await approvePromise;
    expect(approveResult.success).toBe(true);

    const storedOrganizers = JSON.parse(localStorage.getItem('terpspark_pending_organizers'));
    expect(storedOrganizers.find(o => o.id === 1).status).toBe('approved');

    const logs = JSON.parse(localStorage.getItem('terpspark_audit_logs'));
    expect(logs[0].action).toBe('ORGANIZER_APPROVED');

    const rejectPromise = adminService.rejectOrganizer(2, ADMIN_USER, '');
    await flushTimers();
    const rejectResult = await rejectPromise;
    expect(rejectResult.success).toBe(false);
    expect(rejectResult.error).toMatch(/notes required/i);
  });

  it('approves events and records audit entries', async () => {
    vi.useFakeTimers();
    const approvePromise = adminService.approveEvent(1, ADMIN_USER, 'Ship it');
    await flushTimers();
    const approveResult = await approvePromise;
    expect(approveResult.success).toBe(true);

    const storedEvents = JSON.parse(localStorage.getItem('terpspark_pending_events'));
    expect(storedEvents.find(e => e.id === 1).status).toBe('approved');

    const logs = JSON.parse(localStorage.getItem('terpspark_audit_logs'));
    expect(logs[0].action).toBe('EVENT_APPROVED');
  });

  it('creates categories and prevents duplicate slugs', async () => {
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
    vi.useFakeTimers();
    const categoriesPromise = adminService.fetchCategories();
    await flushTimers();
    const categoriesResult = await categoriesPromise;
    const categoryId = categoriesResult.categories[0].id;

    const retirePromise = adminService.retireCategory(categoryId, ADMIN_USER);
    await flushTimers();
    const retireResult = await retirePromise;
    expect(retireResult.success).toBe(true);

    const updatedCategories = JSON.parse(localStorage.getItem('terpspark_categories'));
    const updatedCategory = updatedCategories.find(c => c.id === categoryId);
    expect(typeof updatedCategory.isActive).toBe('boolean');

    const auditPromise = adminService.fetchAuditLogs({ action: 'USER_LOGIN' });
    await flushTimers();
    const auditResult = await auditPromise;
    expect(auditResult.success).toBe(true);
    expect(auditResult.logs.every(log => log.action === 'USER_LOGIN')).toBe(true);
  });

  it('provides analytics and dashboard stats', async () => {
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

