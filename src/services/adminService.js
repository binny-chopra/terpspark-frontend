import mockAdmin from '@data/mockAdmin.json';
import mockEvents from '@data/mockEvents.json';
import { getStorageItem, setStorageItem } from '@utils/storage';

const PENDING_ORGANIZERS_KEY = 'terpspark_pending_organizers';
const PENDING_EVENTS_KEY = 'terpspark_pending_events';
const AUDIT_LOGS_KEY = 'terpspark_audit_logs';
const CATEGORIES_KEY = 'terpspark_categories';
const VENUES_KEY = 'terpspark_venues';

// Initialize data from storage or mock
const getPendingOrganizers = () => {
    const stored = getStorageItem(PENDING_ORGANIZERS_KEY);
    return stored || [...mockAdmin.pendingOrganizers];
};

const getPendingEvents = () => {
    const stored = getStorageItem(PENDING_EVENTS_KEY);
    return stored || [...mockAdmin.pendingEvents];
};

const getAuditLogs = () => {
    const stored = getStorageItem(AUDIT_LOGS_KEY);
    return stored || [...mockAdmin.auditLogs];
};

const getCategories = () => {
    const stored = getStorageItem(CATEGORIES_KEY);
    return stored || [...mockEvents.categories];
};

const getVenues = () => {
    const stored = getStorageItem(VENUES_KEY);
    return stored || [...mockEvents.venues];
};

// Save functions
const savePendingOrganizers = (data) => setStorageItem(PENDING_ORGANIZERS_KEY, data);
const savePendingEvents = (data) => setStorageItem(PENDING_EVENTS_KEY, data);
const saveAuditLogs = (data) => setStorageItem(AUDIT_LOGS_KEY, data);
const saveCategories = (data) => setStorageItem(CATEGORIES_KEY, data);
const saveVenues = (data) => setStorageItem(VENUES_KEY, data);

// Log audit action
const logAuditAction = (action, actor, target, details) => {
    const logs = getAuditLogs();
    const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        actor: { id: actor.id, name: actor.name, role: actor.role },
        target,
        details,
        ipAddress: '192.168.1.100'
    };
    logs.unshift(newLog);
    saveAuditLogs(logs);
    return newLog;
};

// ORGANIZER APPROVALS
export const fetchPendingOrganizers = async () => {
    await new Promise(r => setTimeout(r, 300));
    const organizers = getPendingOrganizers().filter(o => o.status === 'pending');
    return { success: true, requests: organizers };
};

export const approveOrganizer = async (requestId, adminUser, notes = '') => {
    await new Promise(r => setTimeout(r, 400));
    const organizers = getPendingOrganizers();
    const idx = organizers.findIndex(o => o.id === requestId);
    if (idx === -1) return { success: false, error: 'Request not found' };

    organizers[idx].status = 'approved';
    organizers[idx].approvedAt = new Date().toISOString();
    organizers[idx].approvedBy = adminUser.id;
    organizers[idx].notes = notes;
    savePendingOrganizers(organizers);

    logAuditAction('ORGANIZER_APPROVED', adminUser,
        { type: 'user', id: organizers[idx].userId, name: organizers[idx].name },
        `Organizer approved. Notes: ${notes || 'None'}`
    );

    return { success: true, message: 'Organizer approved successfully' };
};

export const rejectOrganizer = async (requestId, adminUser, notes) => {
    await new Promise(r => setTimeout(r, 400));
    if (!notes?.trim()) return { success: false, error: 'Rejection notes required' };

    const organizers = getPendingOrganizers();
    const idx = organizers.findIndex(o => o.id === requestId);
    if (idx === -1) return { success: false, error: 'Request not found' };

    organizers[idx].status = 'rejected';
    organizers[idx].rejectedAt = new Date().toISOString();
    organizers[idx].rejectedBy = adminUser.id;
    organizers[idx].notes = notes;
    savePendingOrganizers(organizers);

    logAuditAction('ORGANIZER_REJECTED', adminUser,
        { type: 'user', id: organizers[idx].userId, name: organizers[idx].name },
        `Organizer rejected. Reason: ${notes}`
    );

    return { success: true, message: 'Organizer request rejected' };
};

// EVENT APPROVALS
export const fetchPendingEvents = async () => {
    await new Promise(r => setTimeout(r, 300));
    const events = getPendingEvents().filter(e => e.status === 'pending');
    return { success: true, events };
};

export const approveEvent = async (submissionId, adminUser, notes = '') => {
    await new Promise(r => setTimeout(r, 400));
    const events = getPendingEvents();
    const idx = events.findIndex(e => e.id === submissionId);
    if (idx === -1) return { success: false, error: 'Event not found' };

    events[idx].status = 'approved';
    events[idx].approvedAt = new Date().toISOString();
    events[idx].approvedBy = adminUser.id;
    events[idx].notes = notes;
    savePendingEvents(events);

    logAuditAction('EVENT_APPROVED', adminUser,
        { type: 'event', id: events[idx].eventId, name: events[idx].title },
        `Event approved and published. Notes: ${notes || 'None'}`
    );

    return { success: true, message: 'Event approved and published' };
};

export const rejectEvent = async (submissionId, adminUser, notes) => {
    await new Promise(r => setTimeout(r, 400));
    if (!notes?.trim()) return { success: false, error: 'Rejection notes required' };

    const events = getPendingEvents();
    const idx = events.findIndex(e => e.id === submissionId);
    if (idx === -1) return { success: false, error: 'Event not found' };

    events[idx].status = 'rejected';
    events[idx].rejectedAt = new Date().toISOString();
    events[idx].rejectedBy = adminUser.id;
    events[idx].notes = notes;
    savePendingEvents(events);

    logAuditAction('EVENT_REJECTED', adminUser,
        { type: 'event', id: events[idx].eventId, name: events[idx].title },
        `Event rejected. Reason: ${notes}`
    );

    return { success: true, message: 'Event rejected' };
};

// CATEGORY MANAGEMENT
export const fetchCategories = async () => {
    await new Promise(r => setTimeout(r, 200));
    return { success: true, categories: getCategories() };
};

export const createCategory = async (categoryData, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const categories = getCategories();

    if (categories.some(c => c.slug === categoryData.slug)) {
        return { success: false, error: 'Category slug already exists' };
    }

    const newCategory = {
        id: Date.now(),
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || '',
        color: categoryData.color || 'gray',
        isActive: true,
        createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    saveCategories(categories);

    logAuditAction('CATEGORY_CREATED', adminUser,
        { type: 'category', id: newCategory.id, name: newCategory.name },
        `New category created: ${newCategory.name}`
    );

    return { success: true, category: newCategory };
};

export const updateCategory = async (categoryId, updates, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const categories = getCategories();
    const idx = categories.findIndex(c => c.id === categoryId);
    if (idx === -1) return { success: false, error: 'Category not found' };

    categories[idx] = { ...categories[idx], ...updates, updatedAt: new Date().toISOString() };
    saveCategories(categories);

    logAuditAction('CATEGORY_UPDATED', adminUser,
        { type: 'category', id: categoryId, name: categories[idx].name },
        `Category updated: ${Object.keys(updates).join(', ')}`
    );

    return { success: true, category: categories[idx] };
};

export const retireCategory = async (categoryId, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const categories = getCategories();
    const idx = categories.findIndex(c => c.id === categoryId);
    if (idx === -1) return { success: false, error: 'Category not found' };

    categories[idx].isActive = !categories[idx].isActive;
    saveCategories(categories);

    const action = categories[idx].isActive ? 'CATEGORY_REACTIVATED' : 'CATEGORY_RETIRED';
    logAuditAction(action, adminUser,
        { type: 'category', id: categoryId, name: categories[idx].name },
        `Category ${categories[idx].isActive ? 'reactivated' : 'retired'}`
    );

    return { success: true, category: categories[idx] };
};

// VENUE MANAGEMENT
export const fetchVenues = async () => {
    await new Promise(r => setTimeout(r, 200));
    return { success: true, venues: getVenues() };
};

export const createVenue = async (venueData, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const venues = getVenues();

    const newVenue = {
        id: Date.now(),
        name: venueData.name,
        building: venueData.building || venueData.name,
        capacity: venueData.capacity || 100,
        facilities: venueData.facilities || [],
        isActive: true,
        createdAt: new Date().toISOString()
    };

    venues.push(newVenue);
    saveVenues(venues);

    logAuditAction('VENUE_CREATED', adminUser,
        { type: 'venue', id: newVenue.id, name: newVenue.name },
        `New venue created: ${newVenue.name}`
    );

    return { success: true, venue: newVenue };
};

export const updateVenue = async (venueId, updates, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const venues = getVenues();
    const idx = venues.findIndex(v => v.id === venueId);
    if (idx === -1) return { success: false, error: 'Venue not found' };

    venues[idx] = { ...venues[idx], ...updates, updatedAt: new Date().toISOString() };
    saveVenues(venues);

    logAuditAction('VENUE_UPDATED', adminUser,
        { type: 'venue', id: venueId, name: venues[idx].name },
        `Venue updated: ${Object.keys(updates).join(', ')}`
    );

    return { success: true, venue: venues[idx] };
};

export const retireVenue = async (venueId, adminUser) => {
    await new Promise(r => setTimeout(r, 300));
    const venues = getVenues();
    const idx = venues.findIndex(v => v.id === venueId);
    if (idx === -1) return { success: false, error: 'Venue not found' };

    venues[idx].isActive = !venues[idx].isActive;
    saveVenues(venues);

    const action = venues[idx].isActive ? 'VENUE_REACTIVATED' : 'VENUE_RETIRED';
    logAuditAction(action, adminUser,
        { type: 'venue', id: venueId, name: venues[idx].name },
        `Venue ${venues[idx].isActive ? 'reactivated' : 'retired'}`
    );

    return { success: true, venue: venues[idx] };
};

// AUDIT LOGS
export const fetchAuditLogs = async (filters = {}) => {
    await new Promise(r => setTimeout(r, 300));
    let logs = getAuditLogs();

    if (filters.action && filters.action !== 'all') {
        logs = logs.filter(l => l.action === filters.action);
    }
    if (filters.startDate) {
        logs = logs.filter(l => new Date(l.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
        logs = logs.filter(l => new Date(l.timestamp) <= new Date(filters.endDate));
    }
    if (filters.search) {
        const s = filters.search.toLowerCase();
        logs = logs.filter(l =>
            l.actor?.name?.toLowerCase().includes(s) ||
            l.target?.name?.toLowerCase().includes(s) ||
            l.details?.toLowerCase().includes(s)
        );
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return { success: true, logs, total: logs.length };
};

export const exportAuditLogs = (logs) => {
    const headers = ['Timestamp', 'Action', 'Actor', 'Target', 'Details'];
    const rows = logs.map(l => [
        new Date(l.timestamp).toLocaleString(),
        l.action,
        l.actor?.name || 'System',
        l.target?.name || 'N/A',
        l.details
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};

// ANALYTICS
export const fetchAnalytics = async () => {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, analytics: mockAdmin.analytics };
};

export const exportAnalytics = (analytics) => {
    const summary = analytics.summary;
    const rows = [
        ['Metric', 'Value'],
        ['Total Events', summary.totalEvents],
        ['Total Registrations', summary.totalRegistrations],
        ['Total Attendance', summary.totalAttendance],
        ['No Shows', summary.noShows],
        ['Attendance Rate', `${((summary.totalAttendance / summary.totalRegistrations) * 100).toFixed(1)}%`],
        ['Active Organizers', summary.activeOrganizers],
        ['', ''],
        ['Category', 'Events', 'Registrations', 'Attendance'],
        ...analytics.byCategory.map(c => [c.category, c.events, c.registrations, c.attendance])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};

// DASHBOARD STATS
export const fetchDashboardStats = async () => {
    await new Promise(r => setTimeout(r, 200));
    const pendingOrg = getPendingOrganizers().filter(o => o.status === 'pending').length;
    const pendingEvt = getPendingEvents().filter(e => e.status === 'pending').length;

    return {
        success: true,
        stats: {
            pendingOrganizers: pendingOrg,
            pendingEvents: pendingEvt,
            totalPending: pendingOrg + pendingEvt,
            ...mockAdmin.analytics.summary
        }
    };
};