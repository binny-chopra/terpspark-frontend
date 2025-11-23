const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock check-ins data (replace with API calls in production)
const mockCheckIns = [
    {
        id: 1,
        eventId: 3,
        userId: 1,
        registrationId: 1,
        checkedInAt: '2025-11-08T14:05:00Z',
        checkedInBy: {
            id: 2,
            name: 'Jane Smith',
            role: 'organizer'
        },
        method: 'qr_scan',
        attendeeName: 'John Doe',
        attendeeEmail: 'student@umd.edu',
        guestCount: 0
    },
    {
        id: 2,
        eventId: 3,
        userId: 5,
        registrationId: 8,
        checkedInAt: '2025-11-08T14:10:00Z',
        checkedInBy: {
            id: 2,
            name: 'Jane Smith',
            role: 'organizer'
        },
        method: 'manual',
        attendeeName: 'Emily Davis',
        attendeeEmail: 'emily.davis@umd.edu',
        guestCount: 2
    }
];

/**
 * Validate QR code and get registration details
 * @param {string} qrCode - QR code to validate
 * @param {number} eventId - Event ID
 * @returns {Promise} Registration details
 */
export const validateQRCode = async (qrCode, eventId) => {
    try {
        // Mock validation - replace with actual API call
        // const response = await axios.post(`${API_URL}/checkin/validate-qr`, {
        //   qrCode,
        //   eventId
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock validation logic
        const mockRegistrations = [
            {
                id: 1,
                userId: 1,
                eventId: eventId,
                ticketCode: 'TKT-1699558899-3',
                qrCode: qrCode,
                status: 'confirmed',
                attendeeName: 'John Doe',
                attendeeEmail: 'student@umd.edu',
                guestCount: 0,
                guests: [],
                checkedIn: false,
                checkedInAt: null
            }
        ];

        const registration = mockRegistrations.find(r => r.qrCode === qrCode && r.eventId === eventId);

        if (!registration) {
            throw new Error('Invalid QR code or registration not found');
        }

        if (registration.status !== 'confirmed') {
            throw new Error('Registration is not confirmed');
        }

        if (registration.checkedIn) {
            throw new Error('Already checked in');
        }

        return {
            success: true,
            data: registration
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to validate QR code'
        };
    }
};

/**
 * Check in an attendee
 * @param {number} eventId - Event ID
 * @param {number} registrationId - Registration ID
 * @param {string} method - Check-in method (qr_scan, manual, search)
 * @param {number} organizerId - Organizer performing check-in
 * @returns {Promise} Check-in record
 */
export const checkInAttendee = async (eventId, registrationId, method = 'manual', organizerId) => {
    try {
        // Mock check-in - replace with actual API call
        // const response = await axios.post(`${API_URL}/checkin`, {
        //   eventId,
        //   registrationId,
        //   method,
        //   organizerId
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock check-in record
        const newCheckIn = {
            id: mockCheckIns.length + 1,
            eventId,
            registrationId,
            checkedInAt: new Date().toISOString(),
            checkedInBy: {
                id: organizerId,
                name: 'Current Organizer',
                role: 'organizer'
            },
            method,
            attendeeName: 'Mock Attendee',
            attendeeEmail: 'attendee@umd.edu',
            guestCount: 0
        };

        mockCheckIns.push(newCheckIn);

        return {
            success: true,
            data: newCheckIn
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to check in attendee'
        };
    }
};

/**
 * Get check-in history for an event
 * @param {number} eventId - Event ID
 * @returns {Promise} List of check-ins
 */
export const getEventCheckIns = async (eventId) => {
    try {
        // Mock data - replace with actual API call
        // const response = await axios.get(`${API_URL}/checkin/event/${eventId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const eventCheckIns = mockCheckIns.filter(c => c.eventId === eventId);

        return {
            success: true,
            data: eventCheckIns
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch check-ins'
        };
    }
};

/**
 * Get check-in statistics for an event
 * @param {number} eventId - Event ID
 * @returns {Promise} Check-in stats
 */
export const getCheckInStats = async (eventId) => {
    try {
        // Mock stats - replace with actual API call
        // const response = await axios.get(`${API_URL}/checkin/event/${eventId}/stats`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const eventCheckIns = mockCheckIns.filter(c => c.eventId === eventId);

        // Mock total registrations (should come from backend)
        const totalRegistrations = 50;
        const checkedInCount = eventCheckIns.length;
        const notCheckedInCount = totalRegistrations - checkedInCount;
        const checkInRate = totalRegistrations > 0 ? (checkedInCount / totalRegistrations) * 100 : 0;

        return {
            success: true,
            data: {
                totalRegistrations,
                checkedIn: checkedInCount,
                notCheckedIn: notCheckedInCount,
                checkInRate: checkInRate.toFixed(1)
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch stats'
        };
    }
};

/**
 * Search for attendees in an event
 * @param {number} eventId - Event ID
 * @param {string} query - Search query (name or email)
 * @returns {Promise} List of matching attendees
 */
export const searchAttendees = async (eventId, query) => {
    try {
        // Mock search - replace with actual API call
        // const response = await axios.get(`${API_URL}/events/${eventId}/attendees`, {
        //   params: { search: query }
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock attendees data
        const mockAttendees = [
            {
                id: 1,
                registrationId: 1,
                userId: 1,
                name: 'John Doe',
                email: 'student@umd.edu',
                ticketCode: 'TKT-1699558899-3',
                qrCode: 'QR-TKT-1699558899-3',
                guestCount: 0,
                guests: [],
                checkedIn: false,
                checkedInAt: null,
                registeredAt: '2025-10-28T10:30:00Z'
            },
            {
                id: 2,
                registrationId: 2,
                userId: 2,
                name: 'Jane Smith',
                email: 'jane.smith@umd.edu',
                ticketCode: 'TKT-1699559000-3',
                qrCode: 'QR-TKT-1699559000-3',
                guestCount: 1,
                guests: [{ name: 'Guest One', email: 'guest1@umd.edu' }],
                checkedIn: false,
                checkedInAt: null,
                registeredAt: '2025-10-28T11:00:00Z'
            },
            {
                id: 3,
                registrationId: 8,
                userId: 5,
                name: 'Emily Davis',
                email: 'emily.davis@umd.edu',
                ticketCode: 'TKT-1699560000-3',
                qrCode: 'QR-TKT-1699560000-3',
                guestCount: 2,
                guests: [
                    { name: 'Guest Two', email: 'guest2@umd.edu' },
                    { name: 'Guest Three', email: 'guest3@umd.edu' }
                ],
                checkedIn: true,
                checkedInAt: '2025-11-08T14:10:00Z',
                registeredAt: '2025-10-28T12:00:00Z'
            }
        ];

        // Filter based on query
        const filtered = mockAttendees.filter(a =>
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.email.toLowerCase().includes(query.toLowerCase()) ||
            a.ticketCode.toLowerCase().includes(query.toLowerCase())
        );

        return {
            success: true,
            data: filtered
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to search attendees'
        };
    }
};

/**
 * Undo check-in (for mistakes)
 * @param {number} checkInId - Check-in ID to undo
 * @returns {Promise} Success status
 */
export const undoCheckIn = async (checkInId) => {
    try {
        // Mock undo - replace with actual API call
        // const response = await axios.delete(`${API_URL}/checkin/${checkInId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = mockCheckIns.findIndex(c => c.id === checkInId);
        if (index !== -1) {
            mockCheckIns.splice(index, 1);
        }

        return {
            success: true,
            message: 'Check-in undone successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to undo check-in'
        };
    }
};

/**
 * Export check-in data as CSV
 * @param {number} eventId - Event ID
 * @returns {Promise} CSV file data
 */
export const exportCheckIns = async (eventId) => {
    try {
        // Mock export - replace with actual API call
        // const response = await axios.get(`${API_URL}/checkin/event/${eventId}/export`, {
        //   responseType: 'blob'
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const eventCheckIns = mockCheckIns.filter(c => c.eventId === eventId);

        // Generate CSV content
        const headers = ['ID', 'Attendee Name', 'Email', 'Guest Count', 'Checked In At', 'Method', 'Checked In By'];
        const rows = eventCheckIns.map(c => [
            c.id,
            c.attendeeName,
            c.attendeeEmail,
            c.guestCount,
            new Date(c.checkedInAt).toLocaleString(),
            c.method,
            c.checkedInBy.name
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });

        return {
            success: true,
            data: blob,
            filename: `event-${eventId}-checkins-${Date.now()}.csv`
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to export check-ins'
        };
    }
};

export default {
    validateQRCode,
    checkInAttendee,
    getEventCheckIns,
    getCheckInStats,
    searchAttendees,
    undoCheckIn,
    exportCheckIns
};