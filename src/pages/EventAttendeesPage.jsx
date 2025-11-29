import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Send, ArrowLeft, Search, Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { getEventAttendees, exportAttendeesCSV, sendAnnouncement, getEventById } from '@services/organizerService';

const EventAttendeesPage = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [checkInFilter, setCheckInFilter] = useState('all');
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementData, setAnnouncementData] = useState({
        subject: '',
        message: '',
        sendVia: 'email'
    });
    const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

    useEffect(() => {
        loadData();
    }, [eventId]);

    useEffect(() => {
        // Reload attendees when search or filter changes
        loadAttendees();
    }, [searchQuery, checkInFilter]);

    const loadData = async () => {
        setLoading(true);

        // Get event details
        const eventResult = await getEventById(eventId);
        if (eventResult.success) {
            setEvent(eventResult.data);
        }

        // Load attendees
        await loadAttendees();

        setLoading(false);
    };

    const loadAttendees = async () => {
        const filters = {};
        
        if (searchQuery.trim()) {
            filters.search = searchQuery.trim();
        }
        
        if (checkInFilter !== 'all') {
            filters.checkInStatus = checkInFilter;
        }

        const attendeesResult = await getEventAttendees(eventId, filters);
        if (attendeesResult.success) {
            setAttendees(attendeesResult.attendees);
            setStatistics(attendeesResult.statistics);
        }
    };

    const handleExportCSV = async () => {
        if (event) {
            const result = await exportAttendeesCSV(eventId, event.title);
            if (!result.success) {
                alert(result.error || 'Failed to export attendees');
            }
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementData.subject.trim()) {
            alert('Please enter a subject');
            return;
        }

        if (!announcementData.message.trim()) {
            alert('Please enter a message');
            return;
        }

        setSendingAnnouncement(true);
        const result = await sendAnnouncement(eventId, announcementData);

        if (result.success) {
            alert(result.message || 'Announcement sent successfully!');
            setShowAnnouncementModal(false);
            setAnnouncementData({
                subject: '',
                message: '',
                sendVia: 'email'
            });
        } else {
            alert(result.error || 'Failed to send announcement');
        }

        setSendingAnnouncement(false);
    };

    // Use statistics from API if available, otherwise calculate from attendees
    const checkedInCount = statistics?.checkedIn || attendees.filter(a => a.checkInStatus === 'checked_in').length;
    const notCheckedInCount = statistics?.notCheckedIn || attendees.filter(a => a.checkInStatus === 'not_checked_in').length;
    const totalRegistrations = statistics?.totalRegistrations || attendees.length;
    const totalAttendees = statistics?.totalAttendees || attendees.reduce((sum, a) => sum + 1 + (a.guests?.length || 0), 0);

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
                                <p className="text-sm text-gray-600">Total Registrations</p>
                                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
                                {statistics?.totalAttendees && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {totalAttendees} total attendees (incl. guests)
                                    </p>
                                )}
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Checked In</p>
                                <p className="text-2xl font-bold text-green-600">{checkedInCount}</p>
                                {statistics?.checkedIn !== undefined && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {statistics.capacityUsed || '0%'} capacity used
                                    </p>
                                )}
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
                                {statistics?.capacityUsed && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {statistics.capacityUsed} used
                                    </p>
                                )}
                            </div>
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={checkInFilter}
                            onChange={(e) => setCheckInFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none"
                        >
                            <option value="all">All Check-in Status</option>
                            <option value="checked_in">Checked In</option>
                            <option value="not_checked_in">Not Checked In</option>
                        </select>
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
                                {attendees.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            {searchQuery || checkInFilter !== 'all' 
                                                ? 'No attendees match your search criteria' 
                                                : 'No attendees yet'}
                                        </td>
                                    </tr>
                                ) : (
                                    attendees.map((attendee) => (
                                        <tr key={attendee.id || attendee.registrationId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{attendee.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(attendee.registeredAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {attendee.guests && attendee.guests.length > 0 ? (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">
                                                                {attendee.guests.length} guest(s)
                                                            </span>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {attendee.guests.map((g, i) => (
                                                                    <div key={i}>{g.name}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        'None'
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {attendee.checkInStatus === 'checked_in' ? (
                                                    <div>
                                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                                            Checked In
                                                        </span>
                                                        {attendee.checkedInAt && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {new Date(attendee.checkedInAt).toLocaleTimeString()}
                                                            </div>
                                                        )}
                                                    </div>
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
                            This message will be sent to all {totalRegistrations} registered attendees.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                value={announcementData.subject}
                                onChange={(e) => setAnnouncementData({ ...announcementData, subject: e.target.value })}
                                placeholder="Enter announcement subject..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message *
                            </label>
                            <textarea
                                value={announcementData.message}
                                onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                                rows={6}
                                placeholder="Enter your announcement message..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Send Via
                            </label>
                            <select
                                value={announcementData.sendVia}
                                onChange={(e) => setAnnouncementData({ ...announcementData, sendVia: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            >
                                <option value="email">Email Only</option>
                                <option value="sms">SMS Only</option>
                                <option value="both">Email and SMS</option>
                            </select>
                        </div>

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
                                onClick={() => {
                                    setShowAnnouncementModal(false);
                                    setAnnouncementData({ subject: '', message: '', sendVia: 'email' });
                                }}
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