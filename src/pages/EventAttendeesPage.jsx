import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Send, ArrowLeft, Search, Users, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { getEventAttendees, exportAttendeesCSV, sendAnnouncement } from '@services/organizerService';
import { getOrganizerEvents } from '@services/organizerService';

const EventAttendeesPage = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

    useEffect(() => {
        loadData();
    }, [eventId, user]);

    const loadData = async () => {
        setLoading(true);

        // Get event details
        const eventsResult = await getOrganizerEvents(user.id);
        if (eventsResult.success) {
            const foundEvent = eventsResult.events.find(e => e.id === parseInt(eventId));
            setEvent(foundEvent);
        }

        // Get attendees
        const attendeesResult = await getEventAttendees(eventId);
        if (attendeesResult.success) {
            setAttendees(attendeesResult.attendees);
        }

        setLoading(false);
    };

    const handleExportCSV = () => {
        if (event && attendees.length > 0) {
            exportAttendeesCSV(attendees, event.title);
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementMessage.trim()) {
            alert('Please enter a message');
            return;
        }

        setSendingAnnouncement(true);
        const result = await sendAnnouncement(eventId, announcementMessage);

        if (result.success) {
            alert('Announcement sent successfully!');
            setShowAnnouncementModal(false);
            setAnnouncementMessage('');
        } else {
            alert(result.error || 'Failed to send announcement');
        }

        setSendingAnnouncement(false);
    };

    const filteredAttendees = attendees.filter(attendee =>
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const checkedInCount = attendees.filter(a => a.checkInStatus === 'checked_in').length;
    const notCheckedInCount = attendees.filter(a => a.checkInStatus === 'not_checked_in').length;

    if (loading) {
        return <LoadingSpinner message="Loading attendees..." />;
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
                    <button
                        onClick={() => navigate('/my-events')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Back to My Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/my-events')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to My Events</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                            <p className="text-gray-600 mt-1">Manage attendees and send announcements</p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowAnnouncementModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                                <span>Send Announcement</span>
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Registered</p>
                                <p className="text-2xl font-bold text-gray-900">{attendees.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Checked In</p>
                                <p className="text-2xl font-bold text-green-600">{checkedInCount}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Not Checked In</p>
                                <p className="text-2xl font-bold text-orange-600">{notCheckedInCount}</p>
                            </div>
                            <XCircle className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Capacity</p>
                                <p className="text-2xl font-bold text-gray-900">{event.capacity}</p>
                            </div>
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Attendees Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Guests
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Check-in Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAttendees.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            {searchQuery ? 'No attendees match your search' : 'No attendees yet'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAttendees.map((attendee) => (
                                        <tr key={attendee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{attendee.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(attendee.registeredAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {attendee.guests.length > 0 ? (
                                                        <span className="text-blue-600 font-medium">
                                                            {attendee.guests.length} guest(s)
                                                        </span>
                                                    ) : (
                                                        'None'
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {attendee.checkInStatus === 'checked_in' ? (
                                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                                        Checked In
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                                                        Not Checked In
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Announcement</h2>
                        <p className="text-gray-600 mb-4">
                            This message will be sent to all {attendees.length} registered attendees via email and SMS.
                        </p>

                        <textarea
                            value={announcementMessage}
                            onChange={(e) => setAnnouncementMessage(e.target.value)}
                            rows={6}
                            placeholder="Enter your announcement message..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none mb-4"
                        />

                        <div className="flex space-x-3">
                            <button
                                onClick={handleSendAnnouncement}
                                disabled={sendingAnnouncement}
                                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${sendingAnnouncement
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {sendingAnnouncement ? 'Sending...' : 'Send Announcement'}
                            </button>
                            <button
                                onClick={() => setShowAnnouncementModal(false)}
                                disabled={sendingAnnouncement}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventAttendeesPage;