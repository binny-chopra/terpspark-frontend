const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock user profiles (replace with API calls in production)
const mockProfiles = {
    1: {
        id: 1,
        email: 'student@umd.edu',
        name: 'John Doe',
        role: 'student',
        profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&background=DC143C&color=fff',
        phone: '301-555-0101',
        department: 'Computer Science',
        graduationYear: 2026,
        bio: 'Passionate about tech events and networking',
        interests: ['Technology', 'Career Development', 'Sports'],
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            eventReminders: true,
            weeklyDigest: true
        },
        stats: {
            eventsAttended: 12,
            upcomingEvents: 3,
            eventsCreated: 0
        },
        joinedAt: '2024-09-01T00:00:00Z',
        lastLogin: '2025-11-23T10:30:00Z'
    },
    2: {
        id: 2,
        email: 'organizer@umd.edu',
        name: 'Jane Smith',
        role: 'organizer',
        profilePicture: 'https://ui-avatars.com/api/?name=Jane+Smith&background=0088cc&color=fff',
        phone: '301-555-0102',
        department: 'Student Affairs',
        bio: 'Event organizer passionate about student engagement',
        interests: ['Event Planning', 'Community Building'],
        preferences: {
            emailNotifications: true,
            smsNotifications: true,
            eventReminders: true,
            weeklyDigest: false
        },
        stats: {
            eventsAttended: 5,
            upcomingEvents: 1,
            eventsCreated: 8
        },
        joinedAt: '2024-08-15T00:00:00Z',
        lastLogin: '2025-11-23T09:15:00Z'
    },
    3: {
        id: 3,
        email: 'admin@umd.edu',
        name: 'Admin User',
        role: 'admin',
        profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=666&color=fff',
        phone: '301-555-0100',
        department: 'IT Administration',
        bio: 'System administrator',
        interests: ['System Management', 'Analytics'],
        preferences: {
            emailNotifications: true,
            smsNotifications: true,
            eventReminders: false,
            weeklyDigest: true
        },
        stats: {
            eventsAttended: 2,
            upcomingEvents: 0,
            eventsCreated: 0
        },
        joinedAt: '2024-07-01T00:00:00Z',
        lastLogin: '2025-11-23T11:00:00Z'
    }
};

/**
 * Get user profile
 * @param {number} userId - User ID
 * @returns {Promise} User profile data
 */
export const getProfile = async (userId) => {
    try {
        // Mock data - replace with actual API call
        // const response = await axios.get(`${API_URL}/profile/${userId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const profile = mockProfiles[userId];

        if (!profile) {
            throw new Error('Profile not found');
        }

        return {
            success: true,
            data: profile
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch profile'
        };
    }
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated profile
 */
export const updateProfile = async (userId, profileData) => {
    try {
        // Validate data
        if (profileData.name && profileData.name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }

        if (profileData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(profileData.phone)) {
            throw new Error('Phone must be in format: XXX-XXX-XXXX');
        }

        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/profile/${userId}`, profileData);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));

        // Update mock data
        if (mockProfiles[userId]) {
            mockProfiles[userId] = {
                ...mockProfiles[userId],
                ...profileData,
                updatedAt: new Date().toISOString()
            };
        }

        return {
            success: true,
            data: mockProfiles[userId],
            message: 'Profile updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to update profile'
        };
    }
};

/**
 * Update profile picture
 * @param {number} userId - User ID
 * @param {string} imageUrl - Profile picture URL
 * @returns {Promise} Updated profile
 */
export const updateProfilePicture = async (userId, imageUrl) => {
    try {
        // Validate URL
        if (!imageUrl || !imageUrl.startsWith('http')) {
            throw new Error('Invalid image URL');
        }

        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/profile/${userId}/picture`, { imageUrl });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        if (mockProfiles[userId]) {
            mockProfiles[userId].profilePicture = imageUrl;
        }

        return {
            success: true,
            data: { profilePicture: imageUrl },
            message: 'Profile picture updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to update profile picture'
        };
    }
};

/**
 * Upload profile picture file (for future use)
 * @param {number} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise} Uploaded image URL
 */
export const uploadProfilePicture = async (userId, file) => {
    try {
        // Validate file
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Invalid file type. Please upload an image');
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
        }

        // Mock upload - replace with actual API call
        // const formData = new FormData();
        // formData.append('file', file);
        // const response = await axios.post(`${API_URL}/profile/${userId}/upload`, formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock uploaded URL
        const mockUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(mockProfiles[userId]?.name || 'User')}&background=random`;

        if (mockProfiles[userId]) {
            mockProfiles[userId].profilePicture = mockUrl;
        }

        return {
            success: true,
            data: { url: mockUrl },
            message: 'Profile picture uploaded successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to upload profile picture'
        };
    }
};

/**
 * Update notification preferences
 * @param {number} userId - User ID
 * @param {Object} preferences - Updated preferences
 * @returns {Promise} Updated preferences
 */
export const updatePreferences = async (userId, preferences) => {
    try {
        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/profile/${userId}/preferences`, preferences);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        if (mockProfiles[userId]) {
            mockProfiles[userId].preferences = {
                ...mockProfiles[userId].preferences,
                ...preferences
            };
        }

        return {
            success: true,
            data: mockProfiles[userId].preferences,
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
 * Get user statistics
 * @param {number} userId - User ID
 * @returns {Promise} User stats
 */
export const getUserStats = async (userId) => {
    try {
        // Mock stats - replace with actual API call
        // const response = await axios.get(`${API_URL}/profile/${userId}/stats`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const profile = mockProfiles[userId];

        if (!profile) {
            throw new Error('Profile not found');
        }

        return {
            success: true,
            data: profile.stats
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch stats'
        };
    }
};

/**
 * Get user activity history
 * @param {number} userId - User ID
 * @param {Object} options - Filter options
 * @returns {Promise} Activity history
 */
export const getActivityHistory = async (userId, options = {}) => {
    try {
        // Mock activity - replace with actual API call
        // const response = await axios.get(`${API_URL}/profile/${userId}/activity`, {
        //   params: options
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const mockActivity = [
            {
                id: 1,
                type: 'registration',
                action: 'Registered for event',
                eventTitle: 'Mental Health Awareness Workshop',
                eventId: 3,
                timestamp: '2025-10-28T15:30:00Z'
            },
            {
                id: 2,
                type: 'check_in',
                action: 'Checked in to event',
                eventTitle: 'Career Fair 2025',
                eventId: 1,
                timestamp: '2025-10-15T09:00:00Z'
            },
            {
                id: 3,
                type: 'waitlist',
                action: 'Joined waitlist',
                eventTitle: 'Spring Concert',
                eventId: 4,
                timestamp: '2025-10-10T14:20:00Z'
            }
        ];

        return {
            success: true,
            data: mockActivity
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to fetch activity history'
        };
    }
};

/**
 * Change user password
 * @param {number} userId - User ID
 * @param {Object} passwordData - Password change data
 * @returns {Promise} Success status
 */
export const changePassword = async (userId, passwordData) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        // Validate passwords
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error('All password fields are required');
        }

        if (newPassword !== confirmPassword) {
            throw new Error('New passwords do not match');
        }

        if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        // Mock update - replace with actual API call
        // const response = await axios.put(`${API_URL}/profile/${userId}/change-password`, {
        //   currentPassword,
        //   newPassword
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));

        return {
            success: true,
            message: 'Password changed successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to change password'
        };
    }
};

/**
 * Delete user account
 * @param {number} userId - User ID
 * @param {string} password - Current password for confirmation
 * @returns {Promise} Success status
 */
export const deleteAccount = async (userId, password) => {
    try {
        if (!password) {
            throw new Error('Password is required to delete account');
        }

        // Mock delete - replace with actual API call
        // const response = await axios.delete(`${API_URL}/profile/${userId}`, {
        //   data: { password }
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            message: 'Account deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to delete account'
        };
    }
};

/**
 * Export user data (GDPR compliance)
 * @param {number} userId - User ID
 * @returns {Promise} User data export
 */
export const exportUserData = async (userId) => {
    try {
        // Mock export - replace with actual API call
        // const response = await axios.get(`${API_URL}/profile/${userId}/export`, {
        //   responseType: 'blob'
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const profile = mockProfiles[userId];
        const dataToExport = {
            profile,
            exportDate: new Date().toISOString(),
            dataFormat: 'JSON'
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        return {
            success: true,
            data: blob,
            filename: `user-${userId}-data-${Date.now()}.json`
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message || 'Failed to export user data'
        };
    }
};

export default {
    getProfile,
    updateProfile,
    updateProfilePicture,
    uploadProfilePicture,
    updatePreferences,
    getUserStats,
    getActivityHistory,
    changePassword,
    deleteAccount,
    exportUserData
};