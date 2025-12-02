import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

global.fetch = vi.fn();

describe('eventService', () => {
  let eventService;

  beforeEach(async () => {
    global.fetch.mockClear();
    eventService = await setupServiceBeforeEach('@services/eventService');
  });

  afterEach(() => {
    setupServiceAfterEach();
  });

  it('filters events by search term and availability', async () => {
    const mockEvents = [
      { id: 1, title: 'Mental Health Workshop', description: 'Mental wellness', tags: ['mental'], registeredCount: 5, capacity: 100, status: 'published' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ events: mockEvents })
    });

    vi.useFakeTimers();
    const promise = eventService.getAllEvents({ search: 'mental', availableOnly: true });
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events.every(event => event.registeredCount < event.capacity)).toBe(true);
    expect(
      result.events.every(
        event =>
          event.title.toLowerCase().includes('mental') ||
          event.description.toLowerCase().includes('mental') ||
          event.tags.some(tag => tag.toLowerCase().includes('mental'))
      )
    ).toBe(true);
  });

  it('returns error when event is not found', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Event not found' })
    });

    vi.useFakeTimers();
    const promise = eventService.getEventById(9999);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('returns featured events sorted and limited to three items', async () => {
    const mockEvents = [
      { id: 1, title: 'Featured 1', isFeatured: true, status: 'published' },
      { id: 2, title: 'Featured 2', isFeatured: true, status: 'published' },
      { id: 3, title: 'Featured 3', isFeatured: true, status: 'published' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ events: mockEvents })
    });

    vi.useFakeTimers();
    const promise = eventService.getFeaturedEvents();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.length).toBeLessThanOrEqual(3);
    expect(result.events.every(event => event.isFeatured && event.status === 'published')).toBe(true);
  });

  it('searches events case-insensitively and returns published ones', async () => {
    const mockEvents = [
      { id: 1, title: 'Career Fair', status: 'published' },
      { id: 2, title: 'Career Workshop', status: 'published' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ events: mockEvents })
    });

    vi.useFakeTimers();
    const promise = eventService.searchEvents('career');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events.every(event => event.status === 'published')).toBe(true);
  });

  it('returns categories from mock data and remote endpoint', async () => {
    const mockCategories = [
      { id: 1, name: 'Career', slug: 'career' },
      { id: 2, name: 'Wellness', slug: 'wellness' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ categories: mockCategories })
    });

    vi.useFakeTimers();
    const categoriesPromise = eventService.getCategories();
    await flushTimers();
    const categoriesResult = await categoriesPromise;

    expect(categoriesResult.success).toBe(true);
    expect(categoriesResult.categories.length).toBeGreaterThan(0);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ categories: ['career', 'wellness'] })
    });

    const remoteResult = await eventService.getAllCategories();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/categories'),
      expect.any(Object)
    );
    expect(remoteResult.success).toBe(true);
  });
});

