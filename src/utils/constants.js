/**
 * Application-wide constants
 */
export const BACKEND_URL = "https://puny-cases-slide.loca.lt"

export const USER_ROLES = {
  STUDENT: 'student',
  ORGANIZER: 'organizer',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [USER_ROLES.STUDENT]: 'Student',
  [USER_ROLES.ORGANIZER]: 'Organizer',
  [USER_ROLES.ADMIN]: 'Administrator'
};

export const ROLE_COLORS = {
  [USER_ROLES.STUDENT]: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300'
  },
  [USER_ROLES.ORGANIZER]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300'
  },
  [USER_ROLES.ADMIN]: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300'
  }
};

export const APP_NAME = 'TerpSpark';
export const APP_DESCRIPTION = 'Campus Event Management Platform';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  MY_REGISTRATIONS: '/my-registrations',
  MY_EVENTS: '/my-events',
  CREATE_EVENT: '/create-event',
  EVENT_ATTENDEES: '/event-attendees',
  // Admin routes (Phase 5)
  APPROVALS: '/approvals',
  MANAGEMENT: '/management',
  AUDIT_LOGS: '/audit-logs',
  ANALYTICS: '/analytics',
  // Phase 6 routes
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  EDIT_EVENT: '/edit-event',
  CHECKIN: '/checkin'
};

// Audit action types
export const AUDIT_ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  ORGANIZER_REQUEST: 'ORGANIZER_REQUEST',
  ORGANIZER_APPROVED: 'ORGANIZER_APPROVED',
  ORGANIZER_REJECTED: 'ORGANIZER_REJECTED',
  EVENT_CREATED: 'EVENT_CREATED',
  EVENT_SUBMITTED: 'EVENT_SUBMITTED',
  EVENT_APPROVED: 'EVENT_APPROVED',
  EVENT_REJECTED: 'EVENT_REJECTED',
  EVENT_EDITED: 'EVENT_EDITED',
  EVENT_CANCELLED: 'EVENT_CANCELLED',
  REGISTRATION: 'REGISTRATION',
  REGISTRATION_CANCELLED: 'REGISTRATION_CANCELLED',
  CHECK_IN: 'CHECK_IN',
  ROLE_CHANGE: 'ROLE_CHANGE',
  CATEGORY_CREATED: 'CATEGORY_CREATED',
  CATEGORY_UPDATED: 'CATEGORY_UPDATED',
  CATEGORY_RETIRED: 'CATEGORY_RETIRED',
  CATEGORY_REACTIVATED: 'CATEGORY_REACTIVATED',
  VENUE_CREATED: 'VENUE_CREATED',
  VENUE_UPDATED: 'VENUE_UPDATED',
  VENUE_RETIRED: 'VENUE_RETIRED',
  VENUE_REACTIVATED: 'VENUE_REACTIVATED',
  // Phase 6 audit actions
  CHECKIN_PERFORMED: 'CHECKIN_PERFORMED',
  CHECKIN_UNDONE: 'CHECKIN_UNDONE',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT'
};

// Phase 6: Notification Types
export const NOTIFICATION_TYPES = {
  REGISTRATION_CONFIRMED: 'registration_confirmed',
  EVENT_REMINDER: 'event_reminder',
  EVENT_UPDATE: 'event_update',
  EVENT_CANCELLED: 'event_cancelled',
  WAITLIST_PROMOTED: 'waitlist_promoted',
  WAITLIST_JOINED: 'waitlist_joined',
  ANNOUNCEMENT: 'announcement',
  ORGANIZER_APPROVED: 'organizer_approved',
  ORGANIZER_REJECTED: 'organizer_rejected',
  EVENT_APPROVED: 'event_approved',
  EVENT_REJECTED: 'event_rejected',
  SYSTEM: 'system'
};

// Phase 6: Check-in Methods
export const CHECKIN_METHODS = {
  QR_SCAN: 'qr_scan',
  MANUAL: 'manual',
  SEARCH: 'search'
};

// Phase 6: Event Status
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled'
};

// Phase 6: Registration Status
export const REGISTRATION_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  WAITLISTED: 'waitlisted'
};