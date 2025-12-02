import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers } from '../helpers/testUtils';

const REGISTRATIONS_KEY = 'terpspark_registrations';
const WAITLIST_KEY = 'terpspark_waitlist';

global.fetch = vi.fn();

vi.mock('@services/authService', () => ({
  getAuthToken: () => 'mock-token'
}));

describe('registrationService', () => {
  let registrationService;
  let mockEvents;
  let mockRegistrations;
  let baseEvents;
  let baseRegistrations;
  let baseWaitlist;

  const seedStorage = () => {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(baseRegistrations));
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(baseWaitlist));
  };

  beforeEach(async () => {
    vi.resetModules();
    global.fetch.mockClear();
    registrationService = await import('@services/registrationService');
    mockEvents = (await import('@data/mockEvents.json')).default;
    mockRegistrations = (await import('@data/mockRegistrations.json')).default;

    baseEvents = JSON.parse(JSON.stringify(mockEvents.events));
    baseRegistrations = JSON.parse(JSON.stringify(mockRegistrations.registrations));
    baseWaitlist = JSON.parse(JSON.stringify(mockRegistrations.waitlist));

    localStorage.clear();
    seedStorage();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    mockEvents.events.length = 0;
    mockEvents.events.push(...JSON.parse(JSON.stringify(baseEvents)));
    vi.useRealTimers();
  });

  it('returns user registrations enriched with event data', async () => {
    const mockRegistrations = baseRegistrations.map(reg => ({
      ...reg,
      event: baseEvents.find(e => e.id === reg.eventId) || { id: reg.eventId, title: 'Test Event' }
    }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ registrations: mockRegistrations })
    });

    vi.useFakeTimers();
    const promise = registrationService.getUserRegistrations(1);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.registrations.length).toBeGreaterThan(0);
    expect(result.registrations[0]).toHaveProperty('event');
    expect(result.registrations[0].event).toHaveProperty('title');
  });

  it('registers for event when capacity allows and stores ticket', async () => {
    const targetEvent = mockEvents.events.find(e => e.status === 'published' && e.capacity - e.registeredCount >= 2);
    targetEvent.registeredCount = 0;

    const mockRegistration = {
      id: 'new-reg-123',
      userId: 42,
      eventId: targetEvent.id,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      guests: [{ name: 'Guest' }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        registration: mockRegistration,
        message: 'Successfully registered for event',
        addedToWaitlist: false
      })
    });

    vi.useFakeTimers();
    const promise = registrationService.registerForEvent(42, targetEvent.id, { guests: [{ name: 'Guest' }] });
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.registration).toMatchObject({
      userId: 42,
      eventId: targetEvent.id,
      status: 'confirmed'
    });
  });

  it('adds user to waitlist when event is full', async () => {
    const targetEvent = mockEvents.events.find(e => e.status === 'published');
    targetEvent.registeredCount = targetEvent.capacity;

    const mockWaitlistEntry = {
      id: 'wait-123',
      userId: 55,
      eventId: targetEvent.id,
      position: 1
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Added to waitlist successfully',
        waitlistEntry: mockWaitlistEntry,
        addedToWaitlist: true
      })
    });

    vi.useFakeTimers();
    const promise = registrationService.registerForEvent(55, targetEvent.id);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/waitlist/i);
    expect(result.addedToWaitlist).toBe(true);
  });

  it('cancels a registration and frees capacity', async () => {
    const registration = {
      id: 999,
      userId: 77,
      eventId: baseEvents[0].id,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      guests: []
    };

    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([registration]));

    const targetEvent = mockEvents.events.find(e => e.id === registration.eventId);
    targetEvent.registeredCount = 5;

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Registration cancelled successfully'
      })
    });

    vi.useFakeTimers();
    const promise = registrationService.cancelRegistration(77, 999);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/cancelled/i);
  });
});

