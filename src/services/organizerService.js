import { getAuthToken } from './authService';

const BACKEND_URL = 'http://127.0.0.1:8000';

/**
 * Get organizer's events
 * GET /api/organizer/events
 * Returns all events created by the authenticated organizer (via JWT)
 * Backend filters events by the organizer from the token
 * 
 * @param {string} organizerId - Not used, kept for backward compatibility
 * @param {string} statusFilter - Optional: 'draft' | 'pending' | 'published' | 'cancelled'
 */
export const getOrganizerEvents = async (organizerId, statusFilter = null) => {
    try {
        // Build URL with optional status filter
        let url = `${BACKEND_URL}/api/organizer/events`;
        if (statusFilter && statusFilter !== 'all') {
            url += `?status=${statusFilter}`;
        }

        const response = await fetch(url, {
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
                error: data.detail || data.error || 'Failed to fetch organizer events'
            };
        }

        return {
            success: true,
            events: data.events || [],
            statistics: data.statistics // Include statistics if backend provides them
        };

    } catch (error) {
        console.error('Get organizer events error:', error);
        return {
            success: false,
            error: 'Failed to fetch organizer events. Please try again.'
        };
    }
};

/**
 * Create a new event
 * POST /api/organizer/events
 * The backend handles:
 * - Setting status to "pending" (awaiting admin approval)
 * - Validating all fields
 * - Setting organizerId from JWT token
 * - Initializing counts to 0
 */
export const createEvent = async (eventData) => {
    try {
        console.log('Creating event:', eventData);
        const response = await fetch(`${BACKEND_URL}/api/organizer/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                title: eventData.title,
                description: eventData.description,
                categoryId: eventData.categoryId,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                venue: eventData.venue,
                location: eventData.location,
                capacity: eventData.capacity,
                imageUrl: eventData.imageUrl || null,
                tags: eventData.tags || []
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to create event'
            };
        }

        return {
            success: true,
            message: data.message || 'Event created successfully. Awaiting admin approval.',
            event: data.event
        };

    } catch (error) {
        console.error('Create event error:', error);
        return {
            success: false,
            error: 'Failed to create event. Please try again.'
        };
    }
};

/**
 * Update an event
 * PUT /api/organizer/events/:id
 * The backend handles:
 * - Validation of ownership
 * - Edit restrictions based on status (draft/pending/published)
 * - May require re-approval if published event is edited
 */
export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to update event'
            };
        }

        return {
            success: true,
            message: data.message || 'Event updated successfully',
            event: data.event
        };

    } catch (error) {
        console.error('Update event error:', error);
        return {
            success: false,
            error: 'Failed to update event. Please try again.'
        };
    }
};

/**
 * Cancel an event
 * POST /api/organizer/events/:id/cancel
 * The backend handles:
 * - Validation of ownership
 * - Preventing cancellation of past events
 * - Notifying all registered attendees
 * - Setting status to "cancelled"
 */
export const cancelEvent = async (eventId, organizerId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/events/${eventId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to cancel event'
            };
        }

        return {
            success: true,
            message: data.message || 'Event cancelled successfully. All attendees have been notified.'
        };

    } catch (error) {
        console.error('Cancel event error:', error);
        return {
            success: false,
            error: 'Failed to cancel event. Please try again.'
        };
    }
};

/**
 * Duplicate an event
 * POST /api/organizer/events/:id/duplicate
 * The backend handles:
 * - Validation of ownership
 * - Creating new event with "(Copy)" appended to title
 * - Setting status to "draft"
 * - Resetting date/time fields
 * - Resetting registration counts to 0
 */
export const duplicateEvent = async (eventId, organizerId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/events/${eventId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to duplicate event'
            };
        }

        return {
            success: true,
            message: data.message || 'Event duplicated successfully',
            event: data.event
        };

    } catch (error) {
        console.error('Duplicate event error:', error);
        return {
            success: false,
            error: 'Failed to duplicate event. Please try again.'
        };
    }
};

/**
 * Get event attendees
 * GET /api/organizer/events/:id/attendees
 * The backend handles:
 * - Validation of ownership
 * - Including guests in the list
 * - Optional search and check-in status filters
 * - Calculating statistics
 */
export const getEventAttendees = async (eventId, filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        if (filters.checkInStatus) {
            params.append('checkInStatus', filters.checkInStatus);
        }
        
        const queryString = params.toString();
        const url = `${BACKEND_URL}/api/organizer/events/${eventId}/attendees${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
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
                error: data.detail || data.error || 'Failed to fetch attendees'
            };
        }

        return {
            success: true,
            attendees: data.attendees || [],
            statistics: data.statistics
        };

    } catch (error) {
        console.error('Get attendees error:', error);
        return {
            success: false,
            error: 'Failed to fetch attendees. Please try again.'
        };
    }
};

/**
 * Export attendees as CSV
 * GET /api/organizer/events/:id/attendees/export
 * The backend returns a CSV file directly
 */
export const exportAttendeesCSV = async (eventId, eventTitle) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/events/${eventId}/attendees/export`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            return {
                success: false,
                error: data.detail || data.error || 'Failed to export attendees'
            };
        }

        // Get the CSV content
        const csvContent = await response.text();
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        return {
            success: true,
            message: 'Attendees exported successfully'
        };

    } catch (error) {
        console.error('Export attendees error:', error);
        return {
            success: false,
            error: 'Failed to export attendees. Please try again.'
        };
    }
};

/**
 * Send announcement to attendees
 * POST /api/organizer/events/:id/announcements
 * The backend handles:
 * - Validation of ownership
 * - Sending to all confirmed registrations
 * - Rate limiting (max 10 per day)
 * - Tracking delivery status
 * - Audit logging
 */
export const sendAnnouncement = async (eventId, announcementData) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/events/${eventId}/announcements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                subject: announcementData.subject,
                message: announcementData.message,
                sendVia: announcementData.sendVia || 'email'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to send announcement'
            };
        }

        return {
            success: true,
            message: data.message || `Announcement sent successfully to ${data.recipientCount || 0} attendees`,
            recipientCount: data.recipientCount
        };

    } catch (error) {
        console.error('Send announcement error:', error);
        return {
            success: false,
            error: 'Failed to send announcement. Please try again.'
        };
    }
};

/**
 * Get event by ID
 * GET /api/events/:id
 * Note: This uses the public event endpoint
 * Organizers can see their own events regardless of status
 */
export const getEventById = async (eventId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/events/${eventId}`, {
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
                error: data.detail || data.error || 'Event not found'
            };
        }

        return {
            success: true,
            data: data.event
        };

    } catch (error) {
        console.error('Get event error:', error);
        return {
            success: false,
            error: 'Failed to load event. Please try again.'
        };
    }
};

/**
 * Get organizer statistics
 * GET /api/organizer/statistics
 * Returns dashboard statistics for the organizer:
 * - Total events, upcoming events
 * - Total registrations and attendance
 * - Average attendance rate
 * - Events by status breakdown
 */
export const getOrganizerStatistics = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/organizer/statistics`, {
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
                error: data.detail || data.error || 'Failed to fetch statistics'
            };
        }

        return {
            success: true,
            statistics: data.statistics
        };

    } catch (error) {
        console.error('Get statistics error:', error);
        return {
            success: false,
            error: 'Failed to fetch statistics. Please try again.'
        };
    }
};
