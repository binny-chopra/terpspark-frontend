import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

describe('profileService', () => {
  let profileService;

  beforeEach(async () => {
    profileService = await setupServiceBeforeEach('@services/profileService');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setupServiceAfterEach();
  });

  it('fetches existing profiles and handles missing ones', async () => {
    vi.useFakeTimers();
    const promise = profileService.getProfile(1);
    await flushTimers();
    const result = await promise;
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('email', 'student@umd.edu');

    const missingPromise = profileService.getProfile(999);
    await flushTimers();
    const missingResult = await missingPromise;
    expect(missingResult.success).toBe(false);
    expect(missingResult.error).toMatch(/not found/i);
  });

  it('validates profile updates and applies valid changes', async () => {
    vi.useFakeTimers();
    const invalidPromise = profileService.updateProfile(1, { name: 'A' });
    await flushTimers();
    const invalidResult = await invalidPromise;
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toMatch(/least 2 characters/i);

    const validPromise = profileService.updateProfile(1, { name: 'Updated User', phone: '301-555-0199' });
    await flushTimers();
    const validResult = await validPromise;
    expect(validResult.success).toBe(true);
    expect(validResult.data.name).toBe('Updated User');
  });

  it('validates profile picture inputs and uploads files', async () => {
    vi.useFakeTimers();
    const invalidPromise = profileService.updateProfilePicture(1, 'ftp://invalid');
    await flushTimers();
    const invalidResult = await invalidPromise;
    expect(invalidResult.success).toBe(false);

    const uploadPromise = profileService.uploadProfilePicture(1, { type: 'image/png', size: 1024 });
    await flushTimers();
    const uploadResult = await uploadPromise;
    expect(uploadResult.success).toBe(true);
    expect(uploadResult.data.url).toContain('ui-avatars');
  });

  it('updates preferences and returns stats/activity', async () => {
    vi.useFakeTimers();
    const prefsPromise = profileService.updatePreferences(1, { emailNotifications: false });
    await flushTimers();
    const prefsResult = await prefsPromise;
    expect(prefsResult.success).toBe(true);
    expect(prefsResult.data.emailNotifications).toBe(false);

    const statsPromise = profileService.getUserStats(1);
    await flushTimers();
    const statsResult = await statsPromise;
    expect(statsResult.success).toBe(true);
    expect(statsResult.data).toHaveProperty('eventsAttended');

    const activityPromise = profileService.getActivityHistory(1);
    await flushTimers();
    const activityResult = await activityPromise;
    expect(activityResult.success).toBe(true);
    expect(activityResult.data.length).toBeGreaterThan(0);
  });

  it('validates password changes and account deletion', async () => {
    vi.useFakeTimers();
    const invalidPasswordPromise = profileService.changePassword(1, {
      currentPassword: 'old',
      newPassword: 'short',
      confirmPassword: 'short'
    });
    await flushTimers();
    const invalidPasswordResult = await invalidPasswordPromise;
    expect(invalidPasswordResult.success).toBe(false);
    expect(invalidPasswordResult.error).toMatch(/least 8 characters/i);

    const mismatchPromise = profileService.changePassword(1, {
      currentPassword: 'oldpassword',
      newPassword: 'newpassword',
      confirmPassword: 'different'
    });
    await flushTimers();
    const mismatchResult = await mismatchPromise;
    expect(mismatchResult.success).toBe(false);
    expect(mismatchResult.error).toMatch(/do not match/i);

    const deletePromise = profileService.deleteAccount(1, '');
    await flushTimers();
    const deleteResult = await deletePromise;
    expect(deleteResult.success).toBe(false);
    expect(deleteResult.error).toMatch(/required/i);
  });
});

