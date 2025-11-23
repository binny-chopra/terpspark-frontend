const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock notifications data (replace with API calls in production)
const mockNotifications = [
    {
        id: 1,
        userId: 1,
        type: 'registration_confirmed',
        title: 'Registration Confirmed',
        message: "You're registered for Mental Health Awareness Workshop",
        relatedEvent: {
            id: 3,
            title: 'Mental Health Awareness Workshop'
        },
        isRead: false,
        createdAt: '2025-10-28T15:30:00Z'
    },
    {
        id: 2,
        userId: 1,
        type: 'event_reminder',
        title: 'Event Reminder',
        message: 'Mental Health Awareness Workshop starts tomorrow at 2:00 PM',
        relatedEvent: {
            id: 3,
            title: 'Mental Health Awareness Workshop'
        },
        isRead: false,
        createdAt: '2025-11-07T10:00:00Z'
    },
    {
        id: 3,
        userId: 1,
        type: 'waitlist_promoted',
        title: 'Moved from Waitlist',
        message: "You've been promoted from the waitlist for Career Fair 2025",
        relatedEvent: {
            id: 1,
            title: 'Career Fair 2025'
        },
        isRead: true,
        createdAt: '2025-10-25T14:20:00Z'
    },
    {
        id: 4,
        userId: 1,
        type: 'event_update',
        title: 'Event Update',
        message: 'The venue for Tech Workshop Series has been changed',
        relatedEvent: {
            id: 5,
            title: 'Tech Workshop Series'
        },
        isRead: true,
        createdAt: '2025-10-20T09:15:00Z'
    },
    {
        id: 5,
        userId: 1,
        type: 'system',
        title: 'Welcome to TerpSpark!',
        message: 'Discover amazing campus events and connect with your community',
        relatedEvent: null,
        isRead: true,
        createdAt: '2025-10-15T08:00:00Z'
    }
];

/**
 * Get all notifications for a user
 * @param {number} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise} List of notifications
 */
export const getNotifications = async (userId, filters = {}) => {
    try {
        // Mock data - replace with actual API call
        // const response = await axios.get(`${API_URL}/notifications/user/${userId}`, {
        //   params: filters
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let notifications = mockNotifications.filter(n => n.userId === userId);

        // Apply filters
        if (filters.unreadOnly) {
            notifications = notifications.filter(n => !n.isRead);
        }

        if (filters.type && filters.type !== 'all') {
            notifications = notifications.filter(n => n.type === filters.type);
        }

        // Sort by date (newest first)
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return {
            success: true,
            data: notifications
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch notifications'
        };
    }
};

/**
 * Get unread notification count
 * @param {number} userId - User ID
 * @returns {Promise} Unread count
 */
export const getUnreadCount = async (userId) => {
    try {
        // Mock count - replace with actual API call
        // const response = await axios.get(`${API_URL}/notifications/user/${userId}/unread-count`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const unreadCount = mockNotifications.filter(n => n.userId === userId && !n.isRead).length;

        return {
            success: true,
            data: { count: unreadCount }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch unread count'
        };
    }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise} Success status
 */
export const markAsRead = async (notificationId) => {
    try {
        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }

        return {
            success: true,
            data: notification
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to mark as read'
        };
    }
};

/**
 * Mark all notifications as read
 * @param {number} userId - User ID
 * @returns {Promise} Success status
 */
export const markAllAsRead = async (userId) => {
    try {
        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        mockNotifications.forEach(n => {
            if (n.userId === userId) {
                n.isRead = true;
            }
        });

        return {
            success: true,
            message: 'All notifications marked as read'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to mark all as read'
        };
    }
};

/**
 * Delete a notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise} Success status
 */
export const deleteNotification = async (notificationId) => {
    try {
        // Mock delete - replace with actual API call
        // const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const index = mockNotifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            mockNotifications.splice(index, 1);
        }

        return {
            success: true,
            message: 'Notification deleted'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to delete notification'
        };
    }
};

/**
 * Create a new notification (typically called by backend)
 * @param {Object} notificationData - Notification data
 * @returns {Promise} Created notification
 */
export const createNotification = async (notificationData) => {
    try {
        // Mock creation - replace with actual API call
        // const response = await axios.post(`${API_URL}/notifications`, notificationData);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const newNotification = {
            id: mockNotifications.length + 1,
            ...notificationData,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        mockNotifications.unshift(newNotification);

        return {
            success: true,
            data: newNotification
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to create notification'
        };
    }
};

/**
 * Send a push notification (for real-time updates)
 * @param {number} userId - User ID
 * @param {Object} notificationData - Notification data
 * @returns {Promise} Success status
 */
export const sendPushNotification = async (userId, notificationData) => {
    try {
        // Mock push - replace with WebSocket or push API
        // await axios.post(`${API_URL}/notifications/push`, {
        //   userId,
        //   ...notificationData
        // });

        console.log('Push notification sent:', { userId, ...notificationData });

        return {
            success: true,
            message: 'Push notification sent'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to send push notification'
        };
    }
};

/**
 * Get notification preferences for a user
 * @param {number} userId - User ID
 * @returns {Promise} Notification preferences
 */
export const getNotificationPreferences = async (userId) => {
    try {
        // Mock preferences - replace with actual API call
        // const response = await axios.get(`${API_URL}/notifications/preferences/${userId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const mockPreferences = {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            eventReminders: true,
            eventUpdates: true,
            registrationConfirmations: true,
            waitlistNotifications: true,
            announcementNotifications: true
        };

        return {
            success: true,
            data: mockPreferences
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch preferences'
        };
    }
};

/**
 * Update notification preferences
 * @param {number} userId - User ID
 * @param {Object} preferences - Updated preferences
 * @returns {Promise} Updated preferences
 */
export const updateNotificationPreferences = async (userId, preferences) => {
    try {
        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/notifications/preferences/${userId}`, preferences);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            success: true,
            data: preferences,
            message: 'Preferences updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to update preferences'
        };
    }
};

/**
 * Subscribe to WebSocket for real-time notifications
 * @param {number} userId - User ID
 * @param {Function} callback - Callback function for new notifications
 * @returns {Function} Unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
    // Mock WebSocket subscription - replace with actual WebSocket connection
    // const ws = new WebSocket(`${WS_URL}/notifications?userId=${userId}`);

    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   callback(notification);
    // };

    // Simulate polling (for development)
    const interval = setInterval(async () => {
        const result = await getUnreadCount(userId);
        if (result.success) {
            callback({ type: 'count_update', count: result.data.count });
        }
    }, 30000); // Poll every 30 seconds

    // Return unsubscribe function
    return () => {
        clearInterval(interval);
        // ws.close();
    };
};

export default {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    sendPushNotification,
    getNotificationPreferences,
    updateNotificationPreferences,
    subscribeToNotifications
};