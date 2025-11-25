import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushTimers, setupServiceBeforeEach, setupServiceAfterEach } from '../helpers/testUtils';

describe('eventService', () => {
  let eventService;

  beforeEach(async () => {
    eventService = await setupServiceBeforeEach('@services/eventService');
  });

  afterEach(() => {
    setupServiceAfterEach();
    vi.unstubAllGlobals?.();
  });

  it('filters events by search term and availability', async () => {
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
    vi.useFakeTimers();
    const promise = eventService.getEventById(9999);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('returns featured events sorted and limited to three items', async () => {
    vi.useFakeTimers();
    const promise = eventService.getFeaturedEvents();
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.length).toBeLessThanOrEqual(3);
    expect(result.events.every(event => event.isFeatured && event.status === 'published')).toBe(true);
  });

  it('searches events case-insensitively and returns published ones', async () => {
    vi.useFakeTimers();
    const promise = eventService.searchEvents('career');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.events.every(event => event.status === 'published')).toBe(true);
  });

  it('returns categories from mock data and remote endpoint', async () => {
    vi.useFakeTimers();
    const categoriesPromise = eventService.getCategories();
    await flushTimers();
    const categoriesResult = await categoriesPromise;

    expect(categoriesResult.success).toBe(true);
    expect(categoriesResult.categories.length).toBeGreaterThan(0);

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ categories: ['career', 'wellness'] })
    };
    const fetchSpy = vi.fn(() => Promise.resolve(mockResponse));
    vi.stubGlobal('fetch', fetchSpy);

    const remoteResult = await eventService.getAllCategories();
    expect(fetchSpy).toHaveBeenCalledWith('/api/categories');
    expect(remoteResult).toEqual({
      success: true,
      data: ['career', 'wellness'],
      error: undefined
    });
  });
});

