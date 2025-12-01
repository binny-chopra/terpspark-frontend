/**
 * Utility functions for event-related operations
 */

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (e.g., "Nov 15, 2025")
 */
export const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Format time to readable string
 * @param {string} timeString - Time string (e.g., "14:00")
 * @returns {string} - Formatted time (e.g., "2:00 PM")
 */
export const formatEventTime = (timeString) => {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get time range string
 * @param {string} startTime 
 * @param {string} endTime 
 * @returns {string} - Time range (e.g., "2:00 PM - 4:00 PM")
 */
export const formatTimeRange = (startTime, endTime) => {
    if (!endTime) {
        return formatEventTime(startTime);
    }
    return `${formatEventTime(startTime)} - ${formatEventTime(endTime)}`;
};

/**
 * Calculate remaining capacity
 * @param {number} capacity 
 * @param {number} registered 
 * @returns {number} - Remaining spots
 */
export const getRemainingCapacity = (capacity, registered) => {
    return Math.max(0, capacity - registered);
};

/**
 * Check if event is full
 * @param {number} capacity 
 * @param {number} registered 
 * @returns {boolean}
 */
export const isEventFull = (capacity, registered) => {
    return registered >= capacity;
};

/**
 * Get capacity percentage
 * @param {number} capacity 
 * @param {number} registered 
 * @returns {number} - Percentage (0-100)
 */
export const getCapacityPercentage = (capacity, registered) => {
    if (capacity === 0) return 0;
    return Math.min(100, Math.round((registered / capacity) * 100));
};

/**
 * Get capacity status color
 * @param {number} percentage 
 * @returns {object} - Color classes
 */
export const getCapacityColor = (percentage) => {
    if (percentage >= 90) {
        return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' };
    } else if (percentage >= 70) {
        return { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' };
    } else if (percentage >= 50) {
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    }
    return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' };
};

/**
 * Check if event is in the past
 * @param {string} dateString 
 * @param {string} endTime 
 * @returns {boolean}
 */
export const isEventPast = (dateString, endTime) => {
    const eventDate = new Date(dateString);

    if (endTime) {
        const [hours, minutes] = endTime.split(':');
        eventDate.setHours(parseInt(hours), parseInt(minutes));
    }

    return eventDate < new Date();
};

/**
 * Check if event is today
 * @param {string} dateString 
 * @returns {boolean}
 */
export const isEventToday = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();

    return eventDate.toDateString() === today.toDateString();
};

/**
 * Get days until event
 * @param {string} dateString 
 * @returns {number} - Days until event
 */
export const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Get event status badge
 * @param {object} event 
 * @returns {object} - Badge info
 */
export const getEventStatusBadge = (event) => {
    const isFull = isEventFull(event.capacity, event.registeredCount);
    const isPast = isEventPast(event.date, event.endTime);
    const isToday = isEventToday(event.date);

    if (isPast) {
        return { label: 'Past Event', color: 'bg-gray-100 text-gray-700' };
    }

    if (isToday) {
        return { label: 'Today', color: 'bg-blue-100 text-blue-700' };
    }

    if (isFull) {
        return { label: 'Full', color: 'bg-red-100 text-red-700' };
    }

    const remaining = getRemainingCapacity(event.capacity, event.registeredCount);
    if (remaining <= 10) {
        return { label: `${remaining} spots left`, color: 'bg-orange-100 text-orange-700' };
    }

    return { label: 'Available', color: 'bg-green-100 text-green-700' };
};

/**
 * Get category color
 * @param {string|object} category - Category slug string or category object
 * @returns {object} - Color classes
 */
export const getCategoryColor = (category) => {
    const colors = {
        academic: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
        career: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
        cultural: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
        sports: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
        arts: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
        technology: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
        wellness: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
        environmental: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
    };

    // Handle both string and object formats
    const categorySlug = typeof category === 'object' ? category?.slug : category;

    return colors[categorySlug] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};