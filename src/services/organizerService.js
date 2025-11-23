import mockEvents from '@data/mockEvents.json';
import { getStorageItem, setStorageItem } from '@utils/storage';

const ORGANIZER_EVENTS_KEY = 'terpspark_organizer_events';

/**
 * Get organizer events from storage
 */
const getOrganizerEventsFromStorage = () => {
    const stored = getStorageItem(ORGANIZER_EVENTS_KEY);
    return stored || [];
};

/**
 * Save organizer events to storage
 */
const saveOrganizerEventsToStorage = (events) => {
    setStorageItem(ORGANIZER_EVENTS_KEY, events);
};

/**
 * Get organizer's events
 */
export const getOrganizerEvents = async (organizerId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Get events from storage
        const storedEvents = getOrganizerEventsFromStorage();

        // Get events from mock data
        const mockOrganizerEvents = mockEvents.events.filter(
            e => e.organizer.id === organizerId
        );

        // Combine both sources
        const allEvents = [...mockOrganizerEvents, ...storedEvents]
            .filter(e => e.organizer.id === organizerId);

        return {
            success: true,
            events: allEvents
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch organizer events'
        };
    }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedEvents = getOrganizerEventsFromStorage();

        const newEvent = {
            id: Date.now(),
            title: eventData.title,
            description: eventData.description,
            category: eventData.category,
            organizer: {
                id: eventData.organizerId,
                name: eventData.organizerName || 'Organizer',
                email: eventData.organizerEmail || 'organizer@umd.edu'
            },
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            venue: eventData.venue,
            location: eventData.location,
            capacity: eventData.capacity,
            registeredCount: 0,
            waitlistCount: 0,
            status: 'pending', // pending, approved, rejected
            imageUrl: eventData.imageUrl || null,
            tags: eventData.tags || [],
            createdAt: new Date().toISOString(),
            publishedAt: null,
            isFeatured: false
        };

        storedEvents.push(newEvent);
        saveOrganizerEventsToStorage(storedEvents);

        return {
            success: true,
            message: 'Event created successfully',
            event: newEvent
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to create event'
        };
    }
};

/**
 * Update an event
 */
export const updateEvent = async (eventId, eventData) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedEvents = getOrganizerEventsFromStorage();
        const eventIndex = storedEvents.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            return {
                success: false,
                error: 'Event not found'
            };
        }

        const existingEvent = storedEvents[eventIndex];

        // Update event
        storedEvents[eventIndex] = {
            ...existingEvent,
            ...eventData,
            updatedAt: new Date().toISOString()
        };

        saveOrganizerEventsToStorage(storedEvents);

        return {
            success: true,
            message: 'Event updated successfully',
            event: storedEvents[eventIndex]
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to update event'
        };
    }
};

/**
 * Cancel an event
 */
export const cancelEvent = async (eventId, organizerId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 400));

        const storedEvents = getOrganizerEventsFromStorage();
        const event = storedEvents.find(e => e.id === eventId && e.organizer.id === organizerId);

        if (!event) {
            return {
                success: false,
                error: 'Event not found or you do not have permission to cancel it'
            };
        }

        event.status = 'cancelled';
        event.cancelledAt = new Date().toISOString();

        saveOrganizerEventsToStorage(storedEvents);

        return {
            success: true,
            message: 'Event cancelled successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to cancel event'
        };
    }
};

/**
 * Duplicate an event
 */
export const duplicateEvent = async (eventId, organizerId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 400));

        // Find event in storage or mock data
        const storedEvents = getOrganizerEventsFromStorage();
        let sourceEvent = storedEvents.find(e => e.id === eventId);

        if (!sourceEvent) {
            sourceEvent = mockEvents.events.find(e => e.id === eventId);
        }

        if (!sourceEvent) {
            return {
                success: false,
                error: 'Event not found'
            };
        }

        if (sourceEvent.organizer.id !== organizerId) {
            return {
                success: false,
                error: 'You do not have permission to duplicate this event'
            };
        }

        // Create duplicate without date/time
        const duplicateEvent = {
            ...sourceEvent,
            id: Date.now(),
            title: `${sourceEvent.title} (Copy)`,
            date: '',
            startTime: '',
            endTime: '',
            registeredCount: 0,
            waitlistCount: 0,
            status: 'draft',
            createdAt: new Date().toISOString(),
            publishedAt: null,
            isFeatured: false
        };

        storedEvents.push(duplicateEvent);
        saveOrganizerEventsToStorage(storedEvents);

        return {
            success: true,
            message: 'Event duplicated successfully',
            event: duplicateEvent
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to duplicate event'
        };
    }
};

/**
 * Get event attendees
 */
export const getEventAttendees = async (eventId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock attendees data
        const attendees = [
            {
                id: 1,
                name: 'John Doe',
                email: 'student@umd.edu',
                registeredAt: '2025-10-25T14:30:00Z',
                checkInStatus: 'not_checked_in',
                guests: []
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                email: 'student2@umd.edu',
                registeredAt: '2025-10-26T10:15:00Z',
                checkInStatus: 'not_checked_in',
                guests: [
                    { name: 'Guest One', email: 'guest1@umd.edu' }
                ]
            }
        ];

        return {
            success: true,
            attendees
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch attendees'
        };
    }
};

/**
 * Export attendees as CSV
 */
export const exportAttendeesCSV = (attendees, eventTitle) => {
    const headers = ['Name', 'Email', 'Registered At', 'Check-in Status', 'Guests'];
    const rows = attendees.map(a => [
        a.name,
        a.email,
        new Date(a.registeredAt).toLocaleString(),
        a.checkInStatus,
        a.guests.map(g => g.name).join('; ') || 'None'
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};

/**
 * Send announcement to attendees
 */
export const sendAnnouncement = async (eventId, message) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // In production, this would send emails/SMS to all attendees
        console.log('Sending announcement for event:', eventId);
        console.log('Message:', message);

        return {
            success: true,
            message: 'Announcement sent successfully to all registered attendees'
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to send announcement'
        };
    }
};

/**
 * Get event by ID (from storage or mock data)
 */
export const getEventById = async (eventId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        const storedEvents = getOrganizerEventsFromStorage();
        let event = storedEvents.find(e => e.id == eventId);

        if (!event) {
            event = mockEvents.events.find(e => e.id == eventId);
        }

        if (!event) {
            return {
                success: false,
                error: 'Event not found'
            };
        }

        return {
            success: true,
            data: event
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to load event'
        };
    }
};
