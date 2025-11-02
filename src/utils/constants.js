/**
 * Application-wide constants
 */

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
  APPROVALS: '/approvals',
  MANAGEMENT: '/management',
  AUDIT_LOGS: '/audit-logs'
};