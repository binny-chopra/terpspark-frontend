import { getAuthToken } from './authService';
import { BACKEND_URL } from '../utils/constants';

const authHeaders = (includeJson = false) => {
    const token = getAuthToken();
    return {
        ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        Role: 'admin'
    };
};

const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        return {
            ok: false,
            error: payload?.detail || payload?.error || payload?.message || response.statusText
        };
    }

    return { ok: true, data: payload };
};

// ORGANIZER APPROVALS
export const fetchPendingOrganizers = async (status = 'pending') => {
    const params = new URLSearchParams();
    if (status && status !== 'pending') params.append('status', status);

    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/organizers${params.toString() ? `?${params}` : ''}`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, requests: result.data.requests || [] };
};

export const approveOrganizer = async (requestId, _adminUser, notes = '') => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/organizers/${requestId}/approve`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify({ notes })
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Organizer approved successfully' };
};

export const rejectOrganizer = async (requestId, _adminUser, notes) => {
    if (!notes?.trim()) return { success: false, error: 'Rejection notes required' };

    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/organizers/${requestId}/reject`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify({ notes })
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Organizer request rejected' };
};

// EVENT APPROVALS
export const fetchPendingEvents = async () => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/events`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, events: result.data.events || [] };
};

export const approveEvent = async (submissionId, _adminUser, notes = '') => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/events/${submissionId}/approve`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify({ notes })
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Event approved and published' };
};

export const rejectEvent = async (submissionId, _adminUser, notes) => {
    if (!notes?.trim()) return { success: false, error: 'Rejection notes required' };

    const response = await fetch(
        `${BACKEND_URL}/api/admin/approvals/events/${submissionId}/reject`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify({ notes })
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Event rejected' };
};

// CATEGORY MANAGEMENT
export const fetchCategories = async () => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/categories`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, categories: result.data.categories || [] };
};

export const createCategory = async (categoryData, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/categories`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(categoryData)
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return {
        success: true,
        category: result.data.category,
        message: result.data.message || 'Category created successfully'
    };
};

export const updateCategory = async (categoryId, updates, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/categories/${categoryId}`,
        {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(updates)
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return {
        success: true,
        category: result.data.category,
        message: result.data.message || 'Category updated successfully'
    };
};

export const retireCategory = async (categoryId, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/categories/${categoryId}`,
        { method: 'DELETE', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Category retired successfully' };
};

// VENUE MANAGEMENT
export const fetchVenues = async () => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/venues`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, venues: result.data.venues || [] };
};

export const createVenue = async (venueData, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/venues`,
        {
            method: 'POST',
            headers: authHeaders(true),
            body: JSON.stringify(venueData)
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return {
        success: true,
        venue: result.data.venue,
        message: result.data.message || 'Venue created successfully'
    };
};

export const updateVenue = async (venueId, updates, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/venues/${venueId}`,
        {
            method: 'PUT',
            headers: authHeaders(true),
            body: JSON.stringify(updates)
        }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return {
        success: true,
        venue: result.data.venue,
        message: result.data.message || 'Venue updated successfully'
    };
};

export const retireVenue = async (venueId, _adminUser) => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/venues/${venueId}`,
        { method: 'DELETE', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, message: result.data.message || 'Venue retired successfully' };
};

// AUDIT LOGS
export const fetchAuditLogs = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action && filters.action !== 'all') params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(
        `${BACKEND_URL}/api/admin/audit-logs${params.toString() ? `?${params}` : ''}`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return {
        success: true,
        logs: result.data.logs || [],
        pagination: result.data.pagination
    };
};

export const exportAuditLogs = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action && filters.action !== 'all') params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(
        `${BACKEND_URL}/api/admin/audit-logs/export${params.toString() ? `?${params}` : ''}`,
        { method: 'GET', headers: authHeaders() }
    );

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('text/csv') ? await response.text() : await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, error: data?.detail || data?.error || data?.message || 'Failed to export logs' };
    }

    const blob = new Blob([contentType.includes('text/csv') ? data : JSON.stringify(data)], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    return { success: true };
};

// ANALYTICS
export const fetchAnalytics = async () => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/analytics`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, analytics: result.data.analytics || result.data };
};

export const exportAnalytics = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.category) params.append('category', filters.category);

    const response = await fetch(
        `${BACKEND_URL}/api/admin/analytics/export${params.toString() ? `?${params}` : ''}`,
        { method: 'GET', headers: authHeaders() }
    );

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('text/csv') ? await response.text() : await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, error: data?.detail || data?.error || data?.message || 'Failed to export analytics' };
    }

    const blob = new Blob([contentType.includes('text/csv') ? data : JSON.stringify(data)], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    return { success: true };
};

// DASHBOARD STATS
export const fetchDashboardStats = async () => {
    const response = await fetch(
        `${BACKEND_URL}/api/admin/dashboard`,
        { method: 'GET', headers: authHeaders() }
    );

    const result = await parseResponse(response);
    if (!result.ok) return { success: false, error: result.error };

    return { success: true, stats: result.data.stats || result.data };
};
