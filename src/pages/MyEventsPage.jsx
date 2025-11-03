import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import OrganizerEventCard from '@components/organizer/OrganizerEventCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { getOrganizerEvents, cancelEvent, duplicateEvent } from '@services/organizerService';

const MyEventsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, draft, pending, published, cancelled

    useEffect(() => {
        loadEvents();
    }, [user]);

    const loadEvents = async () => {
        setLoading(true);
        const result = await getOrganizerEvents(user.id);
        if (result.success) {
            setEvents(result.events);
        }
        setLoading(false);
    };

    const handleCancelEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to cancel this event? All registrations will be cancelled and attendees will be notified.')) {
            return;
        }

        const result = await cancelEvent(eventId, user.id);
        if (result.success) {
            alert('Event cancelled successfully');
            loadEvents();
        } else {
            alert(result.error || 'Failed to cancel event');
        }
    };

    const handleDuplicateEvent = async (eventId) => {
        const result = await duplicateEvent(eventId, user.id);
        if (result.success) {
            alert('Event duplicated successfully as a draft');
            loadEvents();
        } else {
            alert(result.error || 'Failed to duplicate event');
        }
    };

    const handleEditEvent = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };

    const handleViewAttendees = (eventId) => {
        navigate(`/event-attendees/${eventId}`);
    };

    // Filter events by status
    const filteredEvents = events.filter(event => {
        if (activeTab === 'all') return true;
        if (activeTab === 'draft') return event.status === 'draft';
        if (activeTab === 'pending') return event.status === 'pending';
        if (activeTab === 'published') return event.status === 'published';
        if (activeTab === 'cancelled') return event.status === 'cancelled';
        return true;
    });

    // Count events by status
    const counts = {
        all: events.length,
        draft: events.filter(e => e.status === 'draft').length,
        pending: events.filter(e => e.status === 'pending').length,
        published: events.filter(e => e.status === 'published').length,
        cancelled: events.filter(e => e.status === 'cancelled').length
    };

    if (loading) {
        return <LoadingSpinner message="Loading your events..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your events and track attendance
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-event')}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Event</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Draft</p>
                        <p className="text-2xl font-bold text-gray-500">{counts.draft}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-orange-600">{counts.pending}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Published</p>
                        <p className="text-2xl font-bold text-green-600">{counts.published}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Cancelled</p>
                        <p className="text-2xl font-bold text-red-600">{counts.cancelled}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8 overflow-x-auto">
                        {['all', 'draft', 'pending', 'published', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab
                                        ? 'border-red-600 text-red-600 font-semibold'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab} ({counts[tab]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {activeTab === 'all' ? 'No Events Yet' : `No ${activeTab} Events`}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {activeTab === 'all'
                                ? "You haven't created any events yet. Create your first event to get started!"
                                : `You don't have any ${activeTab} events at the moment.`
                            }
                        </p>
                        {activeTab === 'all' && (
                            <button
                                onClick={() => navigate('/create-event')}
                                className="inline-flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Your First Event</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <OrganizerEventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEditEvent}
                                onCancel={handleCancelEvent}
                                onDuplicate={handleDuplicateEvent}
                                onViewAttendees={handleViewAttendees}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyEventsPage;