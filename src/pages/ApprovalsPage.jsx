import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import ApprovalCard from '@components/admin/ApprovalCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import {
    fetchPendingOrganizers,
    fetchPendingEvents,
    approveOrganizer,
    rejectOrganizer,
    approveEvent,
    rejectEvent
} from '@services/adminService';

const ApprovalsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('organizers');
    const [pendingOrganizers, setPendingOrganizers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [orgResult, evtResult] = await Promise.all([
            fetchPendingOrganizers(),
            fetchPendingEvents()
        ]);
        if (orgResult.success) setPendingOrganizers(orgResult.requests);
        if (evtResult.success) setPendingEvents(evtResult.events);
        setLoading(false);
    };

    const handleApproveOrganizer = async (requestId, notes) => {
        const result = await approveOrganizer(requestId, user, notes);
        if (result.success) {
            alert('Organizer approved successfully!');
            loadData();
        } else {
            alert(result.error || 'Failed to approve');
        }
    };

    const handleRejectOrganizer = async (requestId, notes) => {
        const result = await rejectOrganizer(requestId, user, notes);
        if (result.success) {
            alert('Organizer request rejected');
            loadData();
        } else {
            alert(result.error || 'Failed to reject');
        }
    };

    const handleApproveEvent = async (submissionId, notes) => {
        const result = await approveEvent(submissionId, user, notes);
        if (result.success) {
            alert('Event approved and published!');
            loadData();
        } else {
            alert(result.error || 'Failed to approve');
        }
    };

    const handleRejectEvent = async (submissionId, notes) => {
        const result = await rejectEvent(submissionId, user, notes);
        if (result.success) {
            alert('Event rejected');
            loadData();
        } else {
            alert(result.error || 'Failed to reject');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading approvals..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
                    <p className="text-gray-600 mt-1">Review and approve organizer requests and event submissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Organizers</p>
                                <p className="text-2xl font-bold text-orange-600">{pendingOrganizers.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Events</p>
                                <p className="text-2xl font-bold text-blue-600">{pendingEvents.length}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {pendingOrganizers.length + pendingEvents.length}
                                </p>
                            </div>
                            <Shield className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('organizers')}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === 'organizers'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Organizer Requests ({pendingOrganizers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === 'events'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Event Submissions ({pendingEvents.length})
                        </button>
                    </div>
                </div>

                {/* Organizers Tab */}
                {activeTab === 'organizers' && (
                    <div>
                        {pendingOrganizers.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                                <p className="text-gray-600">All organizer requests have been processed.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingOrganizers.map((request) => (
                                    <ApprovalCard
                                        key={request.id}
                                        item={request}
                                        type="organizer"
                                        onApprove={handleApproveOrganizer}
                                        onReject={handleRejectOrganizer}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                    <div>
                        {pendingEvents.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Events</h3>
                                <p className="text-gray-600">All event submissions have been reviewed.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingEvents.map((event) => (
                                    <ApprovalCard
                                        key={event.id}
                                        item={event}
                                        type="event"
                                        onApprove={handleApproveEvent}
                                        onReject={handleRejectEvent}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ApprovalsPage;