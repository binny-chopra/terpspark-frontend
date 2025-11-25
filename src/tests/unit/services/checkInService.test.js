import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

describe('checkInService', () => {
  let checkInService;

  beforeEach(async () => {
    vi.resetModules();
    checkInService = await import('@services/checkInService');
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates QR codes successfully', async () => {
    vi.useFakeTimers();
    const promise = checkInService.validateQRCode('QR-TKT-1699558899-3', 3);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      status: 'confirmed',
      checkedIn: false
    });
  });

  it('creates and undoes check-ins for attendees', async () => {
    vi.useFakeTimers();
    const promise = checkInService.checkInAttendee(3, 25, 'manual', 2);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      eventId: 3,
      registrationId: 25,
      method: 'manual'
    });

    const undoPromise = checkInService.undoCheckIn(result.data.id);
    await flushTimers();
    const undoResult = await undoPromise;
    expect(undoResult.success).toBe(true);
  });

  it('returns check-in lists and stats for events', async () => {
    vi.useFakeTimers();
    const listPromise = checkInService.getEventCheckIns(3);
    await flushTimers();
    const listResult = await listPromise;

    expect(listResult.success).toBe(true);
    expect(Array.isArray(listResult.data)).toBe(true);
    expect(listResult.data.length).toBeGreaterThan(0);

    const statsPromise = checkInService.getCheckInStats(3);
    await flushTimers();
    const statsResult = await statsPromise;

    expect(statsResult.success).toBe(true);
    expect(statsResult.data).toHaveProperty('totalRegistrations');
    expect(Number(statsResult.data.checkInRate)).toBeLessThanOrEqual(100);
  });

  it('searches attendees by query', async () => {
    vi.useFakeTimers();
    const promise = checkInService.searchAttendees(3, 'john');
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.data.some(attendee => attendee.name.toLowerCase().includes('john'))).toBe(true);
  });

  it('exports check-ins as CSV blob', async () => {
    vi.useFakeTimers();
    const promise = checkInService.exportCheckIns(3);
    await flushTimers();
    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Blob);
    expect(result.filename).toMatch(/event-3-checkins/);
  });
});

