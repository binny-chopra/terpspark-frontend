import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const REGISTRATIONS_KEY = 'terpspark_registrations';
const WAITLIST_KEY = 'terpspark_waitlist';

const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

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

    const stored = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY));
    expect(stored.some(r => r.id === result.registration.id)).toBe(true);
    expect(targetEvent.registeredCount).toBeGreaterThan(0);
  });

  it('adds user to waitlist when event is full', async () => {
    const targetEvent = mockEvents.events.find(e => e.status === 'published');
    targetEvent.registeredCount = targetEvent.capacity;

    vi.useFakeTimers();
    const promise = registrationService.registerForEvent(55, targetEvent.id);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/waitlist/i);
    expect(result.waitlistEntry).toMatchObject({ userId: 55, eventId: targetEvent.id });

    const waitlist = JSON.parse(localStorage.getItem(WAITLIST_KEY));
    expect(waitlist.some(entry => entry.id === result.waitlistEntry.id)).toBe(true);
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

    vi.useFakeTimers();
    const promise = registrationService.cancelRegistration(77, 999);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    const stored = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY));
    const storedRegistration = stored.find(r => r.id === 999);
    expect(storedRegistration.status).toBe('cancelled');
    expect(targetEvent.registeredCount).toBe(4);
  });
});

