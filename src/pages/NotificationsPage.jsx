// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, CheckCircle, XCircle, AlertCircle, Calendar,
    Mail, Megaphone, Filter, CheckCheck, Trash2, ArrowLeft
} from 'lucide-react';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../services/notificationService';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // Mock current user (replace with auth context)
    const currentUser = { id: 1 };

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [notifications, filterType, showUnreadOnly]);

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const result = await getNotifications(currentUser.id);
            if (result.success) {
                setNotifications(result.data);
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...notifications];

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(n => n.type === filterType);
        }

        // Filter unread only
        if (showUnreadOnly) {
            filtered = filtered.filter(n => !n.isRead);
        }

        setFilteredNotifications(filtered);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const result = await markAsRead(notificationId);
            if (result.success) {
                setNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
                );
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const result = await markAllAsRead(currentUser.id);
            if (result.success) {
                setNotifications(prev =>
                    prev.map(n => ({ ...n, isRead: true }))
                );
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        if (!confirm('Delete this notification?')) return;

        try {
            const result = await deleteNotification(notificationId);
            if (result.success) {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        // Navigate to related event if applicable
        if (notification.relatedEvent) {
            navigate(`/events/${notification.relatedEvent.id}`);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'registration_confirmed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'event_reminder':
                return <Calendar className="w-5 h-5 text-blue-600" />;
            case 'event_update':
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            case 'event_cancelled':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'waitlist_promoted':
                return <CheckCircle className="w-5 h-5 text-purple-600" />;
            case 'announcement':
                return <Megaphone className="w-5 h-5 text-indigo-600" />;
            case 'system':
                return <Mail className="w-5 h-5 text-gray-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'registration_confirmed':
                return 'bg-green-50 border-green-200';
            case 'event_reminder':
                return 'bg-blue-50 border-blue-200';
            case 'event_update':
                return 'bg-orange-50 border-orange-200';
            case 'event_cancelled':
                return 'bg-red-50 border-red-200';
            case 'waitlist_promoted':
                return 'bg-purple-50 border-purple-200';
            case 'announcement':
                return 'bg-indigo-50 border-indigo-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umd-red"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Notifications</h1>
                            <p className="text-gray-600">
                                {unreadCount > 0 ? (
                                    <span className="font-semibold text-umd-red">{unreadCount} unread</span>
                                ) : (
                                    'All caught up!'
                                )}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 bg-umd-red text-white rounded-lg hover:bg-red-700 transition"
                            >
                                <CheckCheck className="w-5 h-5" />
                                Mark All as Read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Filter:</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'all'
                                        ? 'bg-umd-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('registration_confirmed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'registration_confirmed'
                                        ? 'bg-umd-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Registrations
                            </button>
                            <button
                                onClick={() => setFilterType('event_reminder')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'event_reminder'
                                        ? 'bg-umd-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Reminders
                            </button>
                            <button
                                onClick={() => setFilterType('event_update')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'event_update'
                                        ? 'bg-umd-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Updates
                            </button>
                            <button
                                onClick={() => setFilterType('system')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'system'
                                        ? 'bg-umd-red text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                System
                            </button>
                        </div>

                        <label className="flex items-center gap-2 ml-auto cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showUnreadOnly}
                                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                                className="w-4 h-4 text-umd-red border-gray-300 rounded focus:ring-umd-red"
                            />
                            <span className="text-sm text-gray-700">Unread only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="container mx-auto px-4 py-8">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-16">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-600">
                            {showUnreadOnly || filterType !== 'all'
                                ? 'No notifications match your filters'
                                : 'You\'re all caught up!'}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`${notification.isRead ? 'bg-white' : getNotificationColor(notification.type)
                                    } border rounded-lg p-4 hover:shadow-md transition cursor-pointer relative group`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`font-semibold ${notification.isRead ? 'text-gray-900' : 'text-gray-900'
                                                }`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 bg-umd-red rounded-full flex-shrink-0 mt-2"></div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mt-1 text-sm">
                                            {notification.message}
                                        </p>

                                        {notification.relatedEvent && (
                                            <div className="mt-2 inline-flex items-center gap-1 text-sm text-umd-red">
                                                <Calendar className="w-4 h-4" />
                                                {notification.relatedEvent.title}
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatTime(notification.createdAt)}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notification.id);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;