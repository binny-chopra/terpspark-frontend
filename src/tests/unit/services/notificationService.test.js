import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

describe('notificationService', () => {
  let notificationService;

  beforeEach(async () => {
    vi.resetModules();
    notificationService = await import('@services/notificationService');
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches notifications with filters and unread counts', async () => {
    vi.useFakeTimers();
    const listPromise = notificationService.getNotifications(1, { unreadOnly: true });
    await flushTimers();
    const listResult = await listPromise;

    expect(listResult.success).toBe(true);
    expect(listResult.data.length).toBeGreaterThan(0);
    expect(listResult.data.every(n => !n.isRead)).toBe(true);

    const countPromise = notificationService.getUnreadCount(1);
    await flushTimers();
    const countResult = await countPromise;

    expect(countResult.success).toBe(true);
    expect(countResult.data.count).toBeGreaterThan(0);
  });

  it('marks single and all notifications as read', async () => {
    vi.useFakeTimers();
    const markPromise = notificationService.markAsRead(1);
    await flushTimers();
    const markResult = await markPromise;

    expect(markResult.success).toBe(true);
    expect(markResult.data.isRead).toBe(true);

    const markAllPromise = notificationService.markAllAsRead(1);
    await flushTimers();
    const markAllResult = await markAllPromise;

    expect(markAllResult.success).toBe(true);
    expect(markAllResult.message).toMatch(/marked as read/i);
  });

  it('creates and deletes notifications', async () => {
    vi.useFakeTimers();
    const createPromise = notificationService.createNotification({
      userId: 1,
      type: 'system',
      title: 'Test',
      message: 'Hello'
    });
    await flushTimers();
    const createResult = await createPromise;

    expect(createResult.success).toBe(true);
    expect(createResult.data).toMatchObject({ title: 'Test', isRead: false });

    const deletePromise = notificationService.deleteNotification(createResult.data.id);
    await flushTimers();
    const deleteResult = await deletePromise;
    expect(deleteResult.success).toBe(true);
  });

  it('returns and updates notification preferences', async () => {
    vi.useFakeTimers();
    const prefsPromise = notificationService.getNotificationPreferences(1);
    await flushTimers();
    const prefsResult = await prefsPromise;

    expect(prefsResult.success).toBe(true);
    expect(prefsResult.data.emailNotifications).toBe(true);

    const updatePromise = notificationService.updateNotificationPreferences(1, {
      emailNotifications: false
    });
    await flushTimers();
    const updateResult = await updatePromise;

    expect(updateResult.success).toBe(true);
    expect(updateResult.data.emailNotifications).toBe(false);
  });

  it('sends push notification and returns message', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const result = await notificationService.sendPushNotification(1, { title: 'Ping' });
    expect(result.success).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith('Push notification sent:', { userId: 1, title: 'Ping' });
    consoleSpy.mockRestore();
  });
});

