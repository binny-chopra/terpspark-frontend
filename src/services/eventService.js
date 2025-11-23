import mockData from '@data/mockEvents.json';

/**
 * Simulates fetching all published events
 * In production, this would call GET /api/events
 */
export const getAllEvents = async (filters = {}) => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let filteredEvents = [...mockData.events];

        // Filter by status (only published for students)
        filteredEvents = filteredEvents.filter(event => event.status === 'published');

        // Filter by search query
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Filter by category
        if (filters.category && filters.category !== 'all') {
            filteredEvents = filteredEvents.filter(event =>
                event.category === filters.category
            );
        }

        // Filter by organizer
        if (filters.organizer) {
            filteredEvents = filteredEvents.filter(event =>
                event.organizer.name.toLowerCase().includes(filters.organizer.toLowerCase())
            );
        }

        // Filter by date range
        if (filters.startDate) {
            filteredEvents = filteredEvents.filter(event =>
                new Date(event.date) >= new Date(filters.startDate)
            );
        }

        if (filters.endDate) {
            filteredEvents = filteredEvents.filter(event =>
                new Date(event.date) <= new Date(filters.endDate)
            );
        }

        // Filter by availability
        if (filters.availableOnly) {
            filteredEvents = filteredEvents.filter(event =>
                event.registeredCount < event.capacity
            );
        }

        // Sort events
        const sortBy = filters.sortBy || 'date';
        filteredEvents.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'popular') {
                return b.registeredCount - a.registeredCount;
            }
            return 0;
        });

        return {
            success: true,
            events: filteredEvents,
            total: filteredEvents.length
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch events. Please try again.'
        };
    }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const event = mockData.events.find(e => e.id === parseInt(eventId));

        if (!event) {
            return {
                success: false,
                error: 'Event not found'
            };
        }

        return {
            success: true,
            event
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch event details'
        };
    }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            success: true,
            categories: mockData.categories
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch categories'
        };
    }
};

/**
 * Get featured events
 */
export const getFeaturedEvents = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const featuredEvents = mockData.events
            .filter(event => event.isFeatured && event.status === 'published')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        return {
            success: true,
            events: featuredEvents
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch featured events'
        };
    }
};

/**
 * Get upcoming events (next 7 days)
 */
export const getUpcomingEvents = async (limit = 5) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 200));

        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingEvents = mockData.events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= nextWeek && event.status === 'published';
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, limit);

        return {
            success: true,
            events: upcomingEvents
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch upcoming events'
        };
    }
};

/**
 * Search events by query
 */
export const searchEvents = async (query) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!query || query.trim() === '') {
            return {
                success: true,
                events: mockData.events.filter(e => e.status === 'published')
            };
        }

        const searchLower = query.toLowerCase();
        const results = mockData.events.filter(event => {
            return (
                event.status === 'published' &&
                (
                    event.title.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower) ||
                    event.organizer.name.toLowerCase().includes(searchLower) ||
                    event.venue.toLowerCase().includes(searchLower) ||
                    event.tags.some(tag => tag.toLowerCase().includes(searchLower))
                )
            );
        });

        return {
            success: true,
            events: results,
            query
        };
    } catch (error) {
        return {
            success: false,
            error: 'Search failed. Please try again.'
        };
    }
};

export async function getAllCategories() {
    try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        return {
            success: response.ok,
            data: data.categories || [],
            error: data.error
        };
    } catch (error) {
        console.error('Failed to load categories:', error);
        return { success: false, error: 'Failed to load categories' };
    }
}