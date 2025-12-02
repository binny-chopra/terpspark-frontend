import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

global.fetch = vi.fn();

describe('authService', () => {
  let authService;

  beforeEach(async () => {
    global.fetch.mockClear();
    authService = await setupServiceBeforeEach('@services/authService');
    localStorage.clear();
  });

  afterEach(() => {
    setupServiceAfterEach();
  });

  it('logs in a valid user and stores session state', async () => {
    const mockUser = { id: 1, email: 'student@umd.edu', role: 'student' };
    const mockToken = 'mock-jwt-token';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser, token: mockToken })
    });

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
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Invalid credentials' })
    });

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
    let session = await authService.validateSession();
    expect(session.valid).toBe(false);

    const mockUser = { id: 1, email: 'student@umd.edu', role: 'student' };
    const mockToken = 'mock-jwt-token';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser, token: mockToken })
    });

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
    const mockUser = { id: 1, email: 'student@umd.edu', role: 'student' };
    const mockToken = 'mock-jwt-token';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser, token: mockToken })
    });

    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'student123');
    await flushTimers();
    await loginPromise;

    authService.logout();

    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.getAuthToken()).toBeNull();
  });

  it('registers a new user successfully', async () => {
    const mockUser = { id: 2, email: 'newuser@umd.edu', role: 'student' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser })
    });

    const result = await authService.register({
      email: 'newuser@umd.edu',
      password: 'password123',
      name: 'New User'
    });

    expect(result.success).toBe(true);
    expect(result.user).toMatchObject({ email: 'newuser@umd.edu' });
  });

  it('handles registration failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Email already exists' })
    });

    const result = await authService.register({
      email: 'existing@umd.edu',
      password: 'password123',
      name: 'Existing User'
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists|failed/i);
  });

  it('handles network error during registration', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await authService.register({
      email: 'user@umd.edu',
      password: 'password123',
      name: 'User'
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/error occurred/i);
  });

  it('returns true for isAuthenticated when user and token exist', async () => {
    const mockUser = { id: 1, email: 'student@umd.edu', role: 'student' };
    const mockToken = 'mock-jwt-token';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser, token: mockToken })
    });

    vi.useFakeTimers();
    const loginPromise = authService.login('student@umd.edu', 'student123');
    await flushTimers();
    await loginPromise;

    expect(authService.isAuthenticated()).toBe(true);
  });

  it('returns false for isAuthenticated when user or token is missing', () => {
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('rejects login for unapproved organizer', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: 1, email: 'organizer@umd.edu', role: 'organizer', isApproved: false },
        token: 'mock-token'
      })
    });

    const result = await authService.login('organizer@umd.edu', 'organizer123');

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/pending approval/i);
  });
});
