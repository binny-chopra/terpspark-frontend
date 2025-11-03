import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import RegistrationCard from '@components/registration/RegistrationCard';
import WaitlistCard from '@components/registration/WaitlistCard';
import TicketModal from '@components/registration/TicketModal';
import LoadingSpinner from '@components/common/LoadingSpinner';
import {
    getUserRegistrations,
    getUserWaitlist,
    cancelRegistration,
    leaveWaitlist
} from '@services/registrationService';

const MyRegistrationsPage = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [waitlist, setWaitlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' or 'waitlist'

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);

        const [regResult, waitResult] = await Promise.all([
            getUserRegistrations(user.id),
            getUserWaitlist(user.id)
        ]);

        if (regResult.success) {
            setRegistrations(regResult.registrations);
        }

        if (waitResult.success) {
            setWaitlist(waitResult.waitlist);
        }

        setLoading(false);
    };

    const handleCancelRegistration = async (registrationId) => {
        const result = await cancelRegistration(user.id, registrationId);

        if (result.success) {
            // Show success message
            alert('Registration cancelled successfully');
            // Reload data
            loadData();
        } else {
            alert(result.error || 'Failed to cancel registration');
        }
    };

    const handleLeaveWaitlist = async (waitlistId) => {
        const result = await leaveWaitlist(user.id, waitlistId);

        if (result.success) {
            alert('Removed from waitlist successfully');
            loadData();
        } else {
            alert(result.error || 'Failed to leave waitlist');
        }
    };

    const handleViewTicket = (registration) => {
        setSelectedTicket(registration);
    };

    const handleCloseTicket = () => {
        setSelectedTicket(null);
    };

    // Filter registrations
    const upcomingRegistrations = registrations.filter(r => {
        if (r.status !== 'confirmed') return false;
        const eventDate = new Date(r.event.date);
        return eventDate >= new Date();
    });

    const pastRegistrations = registrations.filter(r => {
        if (r.status === 'cancelled') return false;
        const eventDate = new Date(r.event.date);
        return eventDate < new Date();
    });

    const cancelledRegistrations = registrations.filter(r => r.status === 'cancelled');

    if (loading) {
        return <LoadingSpinner message="Loading your registrations..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
                    <p className="text-gray-600 mt-1">
                        View and manage your event registrations and waitlist
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('registrations')}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === 'registrations'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Registrations ({upcomingRegistrations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('waitlist')}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === 'waitlist'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Waitlist ({waitlist.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === 'past'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Past Events ({pastRegistrations.length})
                        </button>
                    </div>
                </div>

                {/* Registrations Tab */}
                {activeTab === 'registrations' && (
                    <div>
                        {upcomingRegistrations.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Upcoming Registrations
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    You haven't registered for any upcoming events yet.
                                </p>
                                <a
                                    href="/events"
                                    className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Browse Events
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingRegistrations.map((registration) => (
                                    <RegistrationCard
                                        key={registration.id}
                                        registration={registration}
                                        onCancel={handleCancelRegistration}
                                        onViewTicket={handleViewTicket}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Waitlist Tab */}
                {activeTab === 'waitlist' && (
                    <div>
                        {waitlist.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Waitlist Entries
                                </h3>
                                <p className="text-gray-600">
                                    You're not on any waitlists at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {waitlist.map((entry) => (
                                    <WaitlistCard
                                        key={entry.id}
                                        waitlistEntry={entry}
                                        onLeave={handleLeaveWaitlist}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Past Events Tab */}
                {activeTab === 'past' && (
                    <div>
                        {pastRegistrations.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Past Events
                                </h3>
                                <p className="text-gray-600">
                                    You haven't attended any events yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastRegistrations.map((registration) => (
                                    <RegistrationCard
                                        key={registration.id}
                                        registration={registration}
                                        onCancel={handleCancelRegistration}
                                        onViewTicket={handleViewTicket}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Cancelled Registrations */}
                        {cancelledRegistrations.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Cancelled Registrations
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {cancelledRegistrations.map((registration) => (
                                        <RegistrationCard
                                            key={registration.id}
                                            registration={registration}
                                            onCancel={handleCancelRegistration}
                                            onViewTicket={handleViewTicket}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Ticket Modal */}
            {selectedTicket && (
                <TicketModal
                    registration={selectedTicket}
                    onClose={handleCloseTicket}
                />
            )}
        </div>
    );
};

export default MyRegistrationsPage;