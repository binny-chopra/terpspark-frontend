import { describe, it, expect } from 'vitest';
import {
  formatEventDate,
  formatEventTime,
  formatTimeRange,
  getRemainingCapacity,
  isEventFull,
  getCapacityPercentage,
  getCapacityColor,
  isEventPast,
  isEventToday,
  getDaysUntilEvent,
  getEventStatusBadge,
  getCategoryColor,
  truncateText
} from '@utils/eventUtils';
import { withSystemTime } from '../helpers/testUtils';

describe('eventUtils', () => {
  describe('formatting helpers', () => {
    it('should format event dates in readable form', () => {
      expect(formatEventDate('2025-11-15T12:00:00')).toBe('Nov 15, 2025');
    });

    it('should format event time and time ranges', () => {
      expect(formatEventTime('14:30')).toBe('2:30 PM');
      expect(formatEventTime('00:05')).toBe('12:05 AM');
      expect(formatTimeRange('09:00', '11:00')).toBe('9:00 AM - 11:00 AM');
    });
  });

  describe('capacity helpers', () => {
    it('should calculate remaining capacity and event fullness', () => {
      expect(getRemainingCapacity(100, 45)).toBe(55);
      expect(getRemainingCapacity(50, 75)).toBe(0);
      expect(isEventFull(50, 50)).toBe(true);
      expect(isEventFull(50, 49)).toBe(false);
    });

    it('should report capacity percentage with safeguards', () => {
      expect(getCapacityPercentage(100, 50)).toBe(50);
      expect(getCapacityPercentage(0, 10)).toBe(0);
      expect(getCapacityPercentage(30, 40)).toBe(100);
    });

    it('should derive capacity color buckets', () => {
      expect(getCapacityColor(95)).toEqual({ bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' });
      expect(getCapacityColor(75)).toEqual({ bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' });
      expect(getCapacityColor(55)).toEqual({ bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' });
      expect(getCapacityColor(20)).toEqual({ bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' });
    });
  });

  describe('date helpers', () => {
    it('should detect past events and today events accurately', () => {
      withSystemTime('2025-05-01T12:00:00', () => {
        expect(isEventPast('2025-04-30T12:00:00', '18:00')).toBe(true);
        expect(isEventPast('2025-05-02T12:00:00', '18:00')).toBe(false);
        expect(isEventToday('2025-05-01T08:00:00')).toBe(true);
        expect(isEventToday('2025-05-02T08:00:00')).toBe(false);
      });
    });

    it('should compute days until event relative to today', () => {
      withSystemTime('2025-05-01T12:00:00', () => {
        expect(getDaysUntilEvent('2025-05-01T23:59:59')).toBe(1);
        expect(getDaysUntilEvent('2025-05-10T00:00:00')).toBe(9);
      });
    });
  });

  describe('event status badge', () => {
    const baseEvent = {
      capacity: 100,
      registeredCount: 50,
      date: '2025-05-05T12:00:00',
      endTime: '18:00'
    };

    it('should mark past events and today events correctly', () => {
      withSystemTime('2025-05-06T12:00:00', () => {
        expect(getEventStatusBadge(baseEvent)).toEqual({
          label: 'Past Event',
          color: 'bg-gray-100 text-gray-700'
        });
      });

      withSystemTime('2025-05-05T08:00:00', () => {
        expect(getEventStatusBadge(baseEvent)).toEqual({
          label: 'Today',
          color: 'bg-blue-100 text-blue-700'
        });
      });
    });

    it('should mark full, low remaining, and available events', () => {
      withSystemTime('2025-05-01T12:00:00', () => {
        expect(getEventStatusBadge({ ...baseEvent, registeredCount: 100 })).toEqual({
          label: 'Full',
          color: 'bg-red-100 text-red-700'
        });

        expect(getEventStatusBadge({ ...baseEvent, registeredCount: 91 })).toEqual({
          label: '9 spots left',
          color: 'bg-orange-100 text-orange-700'
        });

        expect(getEventStatusBadge({ ...baseEvent, registeredCount: 10 })).toEqual({
          label: 'Available',
          color: 'bg-green-100 text-green-700'
        });
      });
    });
  });

  describe('categories and text helpers', () => {
    it('should map known categories to colors and fallback otherwise', () => {
      expect(getCategoryColor('academic')).toEqual({
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300'
      });
      expect(getCategoryColor('unknown')).toEqual({
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300'
      });
    });

    it('should truncate text beyond max length', () => {
      const text = 'A'.repeat(200);
      expect(truncateText('short text', 50)).toBe('short text');
      expect(truncateText(text, 50)).toBe(`${'A'.repeat(50)}...`);
    });
  });
});

