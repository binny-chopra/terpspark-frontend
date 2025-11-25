import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

const ORGANIZER_EVENTS_KEY = 'terpspark_organizer_events';

describe('organizerService', () => {
  let organizerService;

  beforeEach(async () => {
    organizerService = await setupServiceBeforeEach('@services/organizerService');
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    setupServiceAfterEach();
  });

  it('returns organizer events combining mock and stored data', async () => {
    const storedEvent = {
      id: 500,
      title: 'Stored Event',
      organizer: { id: 2, name: 'Stored Organizer' },
      date: '2025-12-01'
    };
    localStorage.setItem(ORGANIZER_EVENTS_KEY, JSON.stringify([storedEvent]));

    vi.useFakeTimers();
    const promise = organizerService.getOrganizerEvents(2);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.some(event => event.id === storedEvent.id)).toBe(true);
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

    const storedEvents = JSON.parse(localStorage.getItem(ORGANIZER_EVENTS_KEY));
    const storedEvent = storedEvents.find(event => event.id === createdId);
    expect(storedEvent.status).toBe('cancelled');
  });

  it('fails to update unknown events', async () => {
    vi.useFakeTimers();
    const promise = organizerService.updateEvent(12345, { title: 'Missing' });
    await flushTimers();
    const result = await promise;
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('duplicates events for the same organizer', async () => {
    vi.useFakeTimers();
    const promise = organizerService.duplicateEvent(1, 2);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.event.title).toMatch(/\(Copy\)/);
    expect(result.event.status).toBe('draft');
  });

  it('returns attendees list for an event', async () => {
    vi.useFakeTimers();
    const promise = organizerService.getEventAttendees(1);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.attendees.length).toBeGreaterThan(0);
  });
});

