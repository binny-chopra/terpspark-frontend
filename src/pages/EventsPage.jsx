import React, { useState, useEffect } from 'react';
import { Calendar, Grid, List } from 'lucide-react';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import EventCard from '@components/events/EventCard';
import EventFilters from '@components/events/EventFilters';
import EventDetailModal from '@components/events/EventDetailModal';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { getAllEvents } from '@services/eventService';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        sortBy: 'date',
        availableOnly: false,
        startDate: '',
        endDate: '',
        organizer: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, events]);

    const loadEvents = async () => {
        setLoading(true);
        const result = await getAllEvents();
        if (result.success) {
            setEvents(result.events);
            setFilteredEvents(result.events);
        }
        setLoading(false);
    };

    const applyFilters = async () => {
        const result = await getAllEvents(filters);
        if (result.success) {
            setFilteredEvents(result.events);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category: 'all',
            sortBy: 'date',
            availableOnly: false,
            startDate: '',
            endDate: '',
            organizer: ''
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleRegister = (event) => {
        // This will be implemented in Phase 3
        alert(`Registration for "${event.title}" will be implemented in Phase 3!`);
        setSelectedEvent(null);
    };

    if (loading) {
        return <LoadingSpinner message="Loading events..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
                        <p className="text-gray-600 mt-1">
                            Discover and register for campus events
                        </p>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            aria-label="Grid view"
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            aria-label="List view"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <EventFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-900">{filteredEvents.length}</span> event
                        {filteredEvents.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Events Grid/List */}
                {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your filters or search criteria
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={handleEventClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onRegister={handleRegister}
                />
            )}
        </div>
    );
};

export default EventsPage;