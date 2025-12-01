import { getAuthToken } from './authService';
import { BACKEND_URL } from '../utils/constants';

// Backend API base URL
const API_BASE_URL = BACKEND_URL;

/**
 * Helper function to get authorization headers
 */
const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Fetches all published events with optional filters
 * Calls GET /api/events with query parameters
 */
export const getAllEvents = async (filters = {}) => {
    try {
        // Build query parameters
        const params = new URLSearchParams();

        if (filters.search) {
            params.append('search', filters.search);
        }

        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }

        if (filters.organizer) {
            params.append('organizer', filters.organizer);
        }

        if (filters.startDate) {
            params.append('startDate', filters.startDate);
        }

        if (filters.endDate) {
            params.append('endDate', filters.endDate);
        }

        if (filters.availableOnly) {
            params.append('availability', 'true');
        }

        if (filters.sortBy) {
            params.append('sortBy', filters.sortBy);
        }

        if (filters.page) {
            params.append('page', filters.page);
        }

        if (filters.limit) {
            params.append('limit', filters.limit);
        }

        const queryString = params.toString();
        const url = `${API_BASE_URL}/api/events${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to fetch events. Please try again.'
            };
        }

        return {
            success: true,
            events: data.events || [],
            total: data.pagination?.totalItems || data.events?.length || 0,
            pagination: data.pagination
        };
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            success: false,
            error: 'Failed to fetch events. Please try again.'
        };
    }
};

/**
 * Get a single event by ID
 * Calls GET /api/events/{event_id}
 */
export const getEventById = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
            headers: getAuthHeaders()
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
            event: data.event
        };
    } catch (error) {
        console.error('Error fetching event:', error);
        return {
            success: false,
            error: 'Failed to fetch event details'
        };
    }
};

/**
 * Get all categories
 * Calls GET /api/categories
 */
export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to fetch categories'
            };
        }

        return {
            success: true,
            categories: data.categories || []
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            success: false,
            error: 'Failed to fetch categories'
        };
    }
};

/**
 * Get featured events
 * Calls GET /api/events and filters for featured events on client side
 */
export const getFeaturedEvents = async () => {
    try {
        // Fetch recent events and filter for featured ones
        const response = await fetch(`${API_BASE_URL}/api/events?sortBy=date&limit=20`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to fetch featured events'
            };
        }

        // Filter for featured events and take top 3
        const featuredEvents = (data.events || [])
            .filter(event => event.isFeatured)
            .slice(0, 3);

        return {
            success: true,
            events: featuredEvents
        };
    } catch (error) {
        console.error('Error fetching featured events:', error);
        return {
            success: false,
            error: 'Failed to fetch featured events'
        };
    }
};

/**
 * Get upcoming events (next 7 days)
 * Calls GET /api/events with date range filter
 */
export const getUpcomingEvents = async (limit = 5) => {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const startDate = today.toISOString().split('T')[0];
        const endDate = nextWeek.toISOString().split('T')[0];

        const response = await fetch(
            `${API_BASE_URL}/api/events?startDate=${startDate}&endDate=${endDate}&sortBy=date&limit=${limit}`,
            { headers: getAuthHeaders() }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Failed to fetch upcoming events'
            };
        }

        return {
            success: true,
            events: data.events || []
        };
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        return {
            success: false,
            error: 'Failed to fetch upcoming events'
        };
    }
};

/**
 * Search events by query
 * Calls GET /api/events with search parameter
 */
export const searchEvents = async (query) => {
    try {
        const url = query && query.trim() !== ''
            ? `${API_BASE_URL}/api/events?search=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/api/events`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || data.error || 'Search failed. Please try again.'
            };
        }

        return {
            success: true,
            events: data.events || [],
            query
        };
    } catch (error) {
        console.error('Error searching events:', error);
        return {
            success: false,
            error: 'Search failed. Please try again.'
        };
    }
};

/**
 * Alternative function to get all categories
 * Calls GET /api/categories
 */
export async function getAllCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        return {
            success: response.ok,
            data: data.categories || [],
            error: data.detail || data.error
        };
    } catch (error) {
        console.error('Failed to load categories:', error);
        return { success: false, error: 'Failed to load categories' };
    }
}