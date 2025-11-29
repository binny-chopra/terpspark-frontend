import mockRegistrations from '@data/mockRegistrations.json';
import mockEvents from '@data/mockEvents.json';
import { getStorageItem, setStorageItem } from '@utils/storage';
import { getAuthToken } from './authService';

const REGISTRATIONS_KEY = 'terpspark_registrations';
const WAITLIST_KEY = 'terpspark_waitlist';
const BACKEND_URL = 'http://127.0.0.1:8000';
/**
 * Get all registrations from storage or mock data
 */
const getRegistrationsFromStorage = () => {
    const stored = getStorageItem(REGISTRATIONS_KEY);
    return stored || [...mockRegistrations.registrations];
};

/**
 * Get waitlist from storage or mock data
 */
const getWaitlistFromStorage = () => {
    const stored = getStorageItem(WAITLIST_KEY);
    return stored || [...mockRegistrations.waitlist];
};

/**
 * Save registrations to storage
 */
const saveRegistrationsToStorage = (registrations) => {
    setStorageItem(REGISTRATIONS_KEY, registrations);
};

/**
 * Save waitlist to storage
 */
const saveWaitlistToStorage = (waitlist) => {
    setStorageItem(WAITLIST_KEY, waitlist);
};

/**
 * Get user's registrations
 */
export const getUserRegistrations = async (userId) => {
    try {
        // await new Promise(resolve => setTimeout(resolve, 300));
        const res = await fetch(BACKEND_URL + '/api/registrations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        // console.log(data);
        // const registrations = getRegistrationsFromStorage();
        const userRegistrations = data.registrations;

        // Enrich with event details
        const enrichedRegistrations = userRegistrations.map(reg => {
            const event = reg.event
            return {
                ...reg,
                event
            };
        });

        return {
            success: true,
            registrations: enrichedRegistrations
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch registrations'
        };
    }
};

/**
 * Get user's waitlist entries
 * GET /api/waitlist
 * Returns the current user's waitlist entries (filtered by JWT token)
 * Backend includes event details for each entry
 */
export const getUserWaitlist = async (userId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to fetch waitlist'
            };
        }

        return {
            success: true,
            waitlist: data.waitlist || []
        };

    } catch (error) {
        console.error('Get waitlist error:', error);
        return {
            success: false,
            error: 'Failed to fetch waitlist. Please try again.'
        };
    }
};

/**
 * Check if user is registered for an event
 */
export const checkRegistrationStatus = async (userId, eventId) => {
    try {
        // await new Promise(resolve => setTimeout(resolve, 100));
        const res = await fetch(BACKEND_URL + '/api/registrations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();

        // const registrations = getRegistrationsFromStorage();
        const registration = data.registrations.find(
            r => r.userId === userId && r.eventId === eventId && r.status === 'confirmed'
        );

        const waitlist = getWaitlistFromStorage();
        const waitlistEntry = waitlist.find(
            w => w.userId === userId && w.eventId === eventId
        );

        return {
            success: true,
            isRegistered: !!registration,
            isWaitlisted: !!waitlistEntry,
            registration,
            waitlistEntry
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to check registration status'
        };
    }
};

/**
 * Register for an event
 * POST /api/registrations
 * The backend handles all business logic including:
 * - Capacity checks and waitlist management
 * - Duplicate registration prevention
 * - Guest count validation
 * - Registration creation and ticket generation
 */
export const registerForEvent = async (userId, eventId, registrationData = {}) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                eventId,
                guests: registrationData.guests || [],
                sessions: registrationData.sessions || []
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to register for event'
            };
        }

        return {
            success: true,
            message: data.message || 'Successfully registered for event',
            registration: data.registration,
            addedToWaitlist: data.addedToWaitlist || false
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: 'Failed to register for event. Please try again.'
        };
    }
};

/**
 * Add user to waitlist
 * POST /api/waitlist
 * The backend handles:
 * - Checking for duplicate waitlist entries
 * - Calculating waitlist position
 * - Updating event waitlist count
 * - Creating waitlist entry
 */
export const addToWaitlist = async (userId, eventId, preferences = {}) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                eventId: eventId,
                notificationPreference: preferences.notificationPreference || 'email'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to add to waitlist'
            };
        }

        return {
            success: true,
            message: data.message || 'Added to waitlist successfully',
            waitlistEntry: data.waitlistEntry,
            position: data.position
        };

    } catch (error) {
        console.error('Waitlist error:', error);
        return {
            success: false,
            error: 'Failed to add to waitlist. Please try again.'
        };
    }
};

/**
 * Cancel registration
 * DELETE /api/registrations/{registrationId}
 * The backend handles:
 * - Validating registration ownership
 * - Preventing duplicate cancellations
 * - Updating event capacity
 * - Promoting users from waitlist automatically
 */
export const cancelRegistration = async (userId, registrationId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/registrations/${registrationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to cancel registration'
            };
        }

        return {
            success: true,
            message: data.message || 'Registration cancelled successfully'
        };

    } catch (error) {
        console.error('Cancel registration error:', error);
        return {
            success: false,
            error: 'Failed to cancel registration. Please try again.'
        };
    }
};

/**
 * Leave waitlist
 */
/**
 * Leave/remove from waitlist
 * DELETE /api/waitlist/{waitlistId}
 * The backend handles:
 * - Validating waitlist entry ownership
 * - Removing from waitlist
 * - Updating positions for remaining users
 * - Updating event waitlist count
 */
export const leaveWaitlist = async (userId, waitlistId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/waitlist/${waitlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to leave waitlist'
            };
        }

        return {
            success: true,
            message: data.message || 'Removed from waitlist successfully'
        };

    } catch (error) {
        console.error('Leave waitlist error:', error);
        return {
            success: false,
            error: 'Failed to leave waitlist. Please try again.'
        };
    }
};

/**
 * Promote first person from waitlist (internal function)
 */
const promoteFromWaitlist = async (eventId) => {
    try {
        const waitlist = getWaitlistFromStorage();
        const eventWaitlist = waitlist
            .filter(w => w.eventId === eventId)
            .sort((a, b) => a.position - b.position);

        if (eventWaitlist.length === 0) {
            return { success: true, promoted: false };
        }

        const firstInLine = eventWaitlist[0];

        // Remove from waitlist
        const updatedWaitlist = waitlist.filter(w => w.id !== firstInLine.id);

        // Update positions
        updatedWaitlist
            .filter(w => w.eventId === eventId)
            .forEach(w => w.position--);

        saveWaitlistToStorage(updatedWaitlist);

        // Auto-register
        await registerForEvent(firstInLine.userId, eventId);

        return { success: true, promoted: true };
    } catch (error) {
        return { success: false, promoted: false };
    }
};

/**
 * Generate simple QR code (placeholder)
 */
const generateQRCode = (code) => {
    // In production, this would generate an actual QR code
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='white'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='10' fill='black'%3E${code}%3C/text%3E%3C/svg%3E`;
};

/**
 * Download ticket as image
 */
export const downloadTicket = (registration) => {
    // In production, this would generate a proper ticket
    const ticketData = {
        ticketCode: registration.ticketCode,
        eventId: registration.eventId,
        registeredAt: registration.registeredAt
    };

    console.log('Downloading ticket:', ticketData);
    alert('Ticket download will be implemented with backend integration');
};