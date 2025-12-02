import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

// Mock fetch globally
global.fetch = vi.fn();

// Mock authService.getAuthToken
vi.mock('@services/authService', () => ({
  getAuthToken: () => 'mock-token'
}));

const ORGANIZER_EVENTS_KEY = 'terpspark_organizer_events';

describe('organizerService', () => {
  let organizerService;

  beforeEach(async () => {
    global.fetch.mockClear();
    organizerService = await setupServiceBeforeEach('@services/organizerService');
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    setupServiceAfterEach();
  });

  it('returns organizer events combining mock and stored data', async () => {
    const mockEvents = [
      {
        id: 500,
        title: 'Stored Event',
        organizer: { id: 2, name: 'Stored Organizer' },
        date: '2025-12-01'
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ events: mockEvents })
    });

    vi.useFakeTimers();
    const promise = organizerService.getOrganizerEvents(2);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.some(event => event.id === 500)).toBe(true);
  });

  it('creates, updates, and cancels organizer events', async () => {
    const createData = {
      title: 'New Event',
      description: 'desc',
      category: 'career',
      organizerId: 2,
      organizerName: 'Org',
      date: '2025-12-05',
      startTime: '10:00',
      endTime: '12:00',
      venue: 'Hall',
      location: 'Campus',
      capacity: 100
    };

    const mockCreatedEvent = { id: 123, ...createData, status: 'pending' };
    const mockUpdatedEvent = { ...mockCreatedEvent, title: 'Updated Event' };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ event: mockCreatedEvent })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ event: mockUpdatedEvent })
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ message: 'Event cancelled successfully' })
      });

    vi.useFakeTimers();
    const createPromise = organizerService.createEvent(createData);
    await flushTimers();
    const createResult = await createPromise;

    expect(createResult.success).toBe(true);
    const createdId = createResult.event.id;

    const updatePromise = organizerService.updateEvent(createdId, { title: 'Updated Event' });
    await flushTimers();
    const updateResult = await updatePromise;
    expect(updateResult.success).toBe(true);
    expect(updateResult.event.title).toBe('Updated Event');

    const cancelPromise = organizerService.cancelEvent(createdId, 2);
    await flushTimers();
    const cancelResult = await cancelPromise;
    expect(cancelResult.success).toBe(true);
  });

  it('fails to update unknown events', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Event not found' })
    });

    vi.useFakeTimers();
    const promise = organizerService.updateEvent(12345, { title: 'Missing' });
    await flushTimers();
    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('duplicates events for the same organizer', async () => {
    const mockDuplicatedEvent = { id: 2, title: 'Original Event (Copy)', status: 'draft' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ event: mockDuplicatedEvent, message: 'Event duplicated successfully' })
    });

    vi.useFakeTimers();
    const promise = organizerService.duplicateEvent(1, 2);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.event.title).toMatch(/\(Copy\)/);
    expect(result.event.status).toBe('draft');
  });

  it('returns attendees list for an event', async () => {
    const mockAttendees = [
      { id: 1, name: 'Attendee 1', email: 'attendee1@umd.edu' },
      { id: 2, name: 'Attendee 2', email: 'attendee2@umd.edu' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ attendees: mockAttendees })
    });

    vi.useFakeTimers();
    const promise = organizerService.getEventAttendees(1);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.attendees.length).toBeGreaterThan(0);
  });
});

