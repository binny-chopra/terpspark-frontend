import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

describe('authService', () => {
  let authService;

  beforeEach(async () => {
    vi.resetModules();
    authService = await import('@services/authService');
    localStorage.clear();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('logs in a valid user and stores session state', async () => {
    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'student123');
    await flushTimers();
    const result = await loginPromise;

    expect(result.success).toBe(true);
    expect(authService.getCurrentUser()).toMatchObject({
      email: 'student@umd.edu',
      role: 'student'
    });
    expect(authService.getAuthToken()).toBeTruthy();
  });

  it('rejects invalid credentials without touching storage', async () => {
    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'wrong-password');
    await flushTimers();
    const result = await loginPromise;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/invalid/i);
    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.getAuthToken()).toBeNull();
  });

  it('validates session only when token decodes correctly', async () => {
    localStorage.setItem('terpspark_auth_token', JSON.stringify('bad-token'));
    localStorage.setItem('terpspark_user', JSON.stringify({ email: 'user@umd.edu' }));

    let session = await authService.validateSession();
    expect(session.valid).toBe(false);

    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'student123');
    await flushTimers();
    await loginPromise;

    session = await authService.validateSession();
    expect(session).toMatchObject({
      valid: true,
      user: expect.objectContaining({ email: 'student@umd.edu' })
    });
  });

  it('logs out by clearing stored user and token', async () => {
    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'student123');
    await flushTimers();
    await loginPromise;

    authService.logout();

    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.getAuthToken()).toBeNull();
  });

  it('completes OTP flow when pending login exists', async () => {
    vi.useFakeTimers();
    const initiatePromise = authService.initiateLogin('student@umd.edu', 'student123');
    await flushTimers();
    const initiateResult = await initiatePromise;
    expect(initiateResult).toMatchObject({ success: true, requiresOTP: true });

    const verifyPromise = authService.verifyOTP('123456');
    await flushTimers();
    const verifyResult = await verifyPromise;

    expect(verifyResult.success).toBe(true);
    expect(authService.getCurrentUser()).toMatchObject({ email: 'student@umd.edu' });
  });
});

