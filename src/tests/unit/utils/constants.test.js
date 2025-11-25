import { describe, it, expect } from 'vitest';
import {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_COLORS,
  ROUTES,
  AUDIT_ACTIONS,
  NOTIFICATION_TYPES,
  CHECKIN_METHODS,
  EVENT_STATUS,
  REGISTRATION_STATUS,
  APP_NAME,
  APP_DESCRIPTION
} from '@utils/constants';

describe('constants', () => {
  it('should expose user role mappings and matching labels/colors', () => {
    expect(USER_ROLES).toEqual({
      STUDENT: 'student',
      ORGANIZER: 'organizer',
      ADMIN: 'admin'
    });

    Object.values(USER_ROLES).forEach(role => {
      expect(ROLE_LABELS[role]).toBeDefined();
      expect(ROLE_COLORS[role]).toBeDefined();
      const color = ROLE_COLORS[role];
      expect(color).toHaveProperty('bg');
      expect(color).toHaveProperty('text');
      expect(color).toHaveProperty('border');
    });
  });

  it('should define core app metadata', () => {
    expect(APP_NAME).toBe('TerpSpark');
    expect(APP_DESCRIPTION).toBe('Campus Event Management Platform');
  });

  it('should define navigation routes', () => {
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
    expect(ROUTES).toMatchObject({
      EVENTS: '/events',
      CREATE_EVENT: '/create-event'
    });
  });

  it('should define audit action constants', () => {
    expect(AUDIT_ACTIONS.USER_LOGIN).toBe('USER_LOGIN');
    expect(AUDIT_ACTIONS.EVENT_APPROVED).toBe('EVENT_APPROVED');
    expect(AUDIT_ACTIONS).toHaveProperty('ORGANIZER_APPROVED');
    expect(AUDIT_ACTIONS).toHaveProperty('EVENT_REJECTED');
  });

  it('should define notification type constants', () => {
    expect(NOTIFICATION_TYPES.EVENT_REMINDER).toBe('event_reminder');
    expect(NOTIFICATION_TYPES.SYSTEM).toBe('system');
    expect(NOTIFICATION_TYPES).toHaveProperty('REGISTRATION_CONFIRMED');
    expect(NOTIFICATION_TYPES).toHaveProperty('EVENT_CANCELLED');
  });

  it('should expose check-in methods and event/registration status values', () => {
    expect(CHECKIN_METHODS).toEqual({
      QR_SCAN: 'qr_scan',
      MANUAL: 'manual',
      SEARCH: 'search'
    });

    expect(EVENT_STATUS).toEqual({
      DRAFT: 'draft',
      PENDING: 'pending',
      PUBLISHED: 'published',
      CANCELLED: 'cancelled'
    });

    expect(REGISTRATION_STATUS).toEqual({
      CONFIRMED: 'confirmed',
      CANCELLED: 'cancelled',
      WAITLISTED: 'waitlisted'
    });
  });
});

