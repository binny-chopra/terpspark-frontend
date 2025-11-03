import mockRegistrations from '@data/mockRegistrations.json';
import mockEvents from '@data/mockEvents.json';
import { getStorageItem, setStorageItem } from '@utils/storage';

const REGISTRATIONS_KEY = 'terpspark_registrations';
const WAITLIST_KEY = 'terpspark_waitlist';

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
        await new Promise(resolve => setTimeout(resolve, 300));

        const registrations = getRegistrationsFromStorage();
        const userRegistrations = registrations.filter(r => r.userId === userId);

        // Enrich with event details
        const enrichedRegistrations = userRegistrations.map(reg => {
            const event = mockEvents.events.find(e => e.id === reg.eventId);
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
 */
export const getUserWaitlist = async (userId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const waitlist = getWaitlistFromStorage();
        const userWaitlist = waitlist.filter(w => w.userId === userId);

        // Enrich with event details
        const enrichedWaitlist = userWaitlist.map(wait => {
            const event = mockEvents.events.find(e => e.id === wait.eventId);
            return {
                ...wait,
                event
            };
        });

        return {
            success: true,
            waitlist: enrichedWaitlist
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch waitlist'
        };
    }
};

/**
 * Check if user is registered for an event
 */
export const checkRegistrationStatus = async (userId, eventId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const registrations = getRegistrationsFromStorage();
        const registration = registrations.find(
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
 */
export const registerForEvent = async (userId, eventId, registrationData = {}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const event = mockEvents.events.find(e => e.id === eventId);
        if (!event) {
            return {
                success: false,
                error: 'Event not found'
            };
        }

        // Check if already registered
        const statusCheck = await checkRegistrationStatus(userId, eventId);
        if (statusCheck.isRegistered) {
            return {
                success: false,
                error: 'You are already registered for this event'
            };
        }

        const registrations = getRegistrationsFromStorage();

        // Check capacity
        const currentRegistrations = registrations.filter(r => r.eventId === eventId && r.status === 'confirmed').length;
        const isEventFull = currentRegistrations >= event.capacity;

        if (isEventFull) {
            // Add to waitlist instead
            return await addToWaitlist(userId, eventId, registrationData);
        }

        // Create new registration
        const newRegistration = {
            id: Date.now(),
            userId,
            eventId,
            status: 'confirmed',
            registeredAt: new Date().toISOString(),
            checkInStatus: 'not_checked_in',
            ticketCode: `TKT-${Date.now()}-${eventId}`,
            guests: registrationData.guests || [],
            sessions: registrationData.sessions || [],
            qrCode: generateQRCode(`TKT-${Date.now()}-${eventId}`),
            reminderSent: false,
            cancelledAt: null
        };

        registrations.push(newRegistration);
        saveRegistrationsToStorage(registrations);

        // Update event capacity (in real app, backend would handle this)
        event.registeredCount++;

        return {
            success: true,
            message: 'Successfully registered for event',
            registration: newRegistration
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to register for event'
        };
    }
};

/**
 * Add user to waitlist
 */
export const addToWaitlist = async (userId, eventId, data = {}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 400));

        const waitlist = getWaitlistFromStorage();

        // Check if already on waitlist
        const existingEntry = waitlist.find(w => w.userId === userId && w.eventId === eventId);
        if (existingEntry) {
            return {
                success: false,
                error: 'You are already on the waitlist for this event'
            };
        }

        // Find position in waitlist
        const eventWaitlist = waitlist.filter(w => w.eventId === eventId);
        const position = eventWaitlist.length + 1;

        const newWaitlistEntry = {
            id: Date.now(),
            userId,
            eventId,
            position,
            joinedAt: new Date().toISOString(),
            notificationPreference: data.notificationPreference || 'email'
        };

        waitlist.push(newWaitlistEntry);
        saveWaitlistToStorage(waitlist);

        // Update event waitlist count
        const event = mockEvents.events.find(e => e.id === eventId);
        if (event) {
            event.waitlistCount++;
        }

        return {
            success: true,
            message: `Added to waitlist at position ${position}`,
            waitlistEntry: newWaitlistEntry
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to add to waitlist'
        };
    }
};

/**
 * Cancel registration
 */
export const cancelRegistration = async (userId, registrationId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 400));

        const registrations = getRegistrationsFromStorage();
        const registration = registrations.find(r => r.id === registrationId && r.userId === userId);

        if (!registration) {
            return {
                success: false,
                error: 'Registration not found'
            };
        }

        if (registration.status === 'cancelled') {
            return {
                success: false,
                error: 'Registration is already cancelled'
            };
        }

        // Mark as cancelled
        registration.status = 'cancelled';
        registration.cancelledAt = new Date().toISOString();

        saveRegistrationsToStorage(registrations);

        // Update event capacity
        const event = mockEvents.events.find(e => e.id === registration.eventId);
        if (event && event.registeredCount > 0) {
            event.registeredCount--;
        }

        // Promote from waitlist if available
        await promoteFromWaitlist(registration.eventId);

        return {
            success: true,
            message: 'Registration cancelled successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to cancel registration'
        };
    }
};

/**
 * Leave waitlist
 */
export const leaveWaitlist = async (userId, waitlistId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const waitlist = getWaitlistFromStorage();
        const entryIndex = waitlist.findIndex(w => w.id === waitlistId && w.userId === userId);

        if (entryIndex === -1) {
            return {
                success: false,
                error: 'Waitlist entry not found'
            };
        }

        const entry = waitlist[entryIndex];
        waitlist.splice(entryIndex, 1);

        // Update positions for remaining waitlist entries
        waitlist
            .filter(w => w.eventId === entry.eventId && w.position > entry.position)
            .forEach(w => w.position--);

        saveWaitlistToStorage(waitlist);

        // Update event waitlist count
        const event = mockEvents.events.find(e => e.id === entry.eventId);
        if (event && event.waitlistCount > 0) {
            event.waitlistCount--;
        }

        return {
            success: true,
            message: 'Removed from waitlist successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to leave waitlist'
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