import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import QRScanner from '../components/checkin/QRScanner';
import AttendeeSearch from '../components/checkin/AttendeeSearch';
import CheckInHistory from '../components/checkin/CheckInHistory';
import { validateQRCode, checkInAttendee, getCheckInStats } from '../services/checkInService';
import { getEventById } from '../services/eventService';

const CheckInPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('qr'); // qr, manual, history
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Get current user (mock - replace with auth context)
    const currentUser = { id: 2, name: 'Jane Smith', role: 'organizer' };

    useEffect(() => {
        loadEventAndStats();
    }, [eventId]);

    const loadEventAndStats = async () => {
        setIsLoading(true);
        try {
            // Load event details
            const eventResult = await getEventById(eventId);
            if (eventResult.success) {
                setEvent(eventResult.data);
            }

            // Load check-in stats
            const statsResult = await getCheckInStats(eventId);
            if (statsResult.success) {
                setStats(statsResult.data);
            }
        } catch (error) {
            console.error('Failed to load event data:', error);
            showToast('Failed to load event data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleQRScan = async (qrCode) => {
        try {
            // Validate QR code
            const validateResult = await validateQRCode(qrCode, parseInt(eventId));

            if (!validateResult.success) {
                showToast(validateResult.error, 'error');
                return;
            }

            const registration = validateResult.data;

            // Check in attendee
            const checkInResult = await checkInAttendee(
                parseInt(eventId),
                registration.id,
                'qr_scan',
                currentUser.id
            );

            if (checkInResult.success) {
                showToast(`✓ ${registration.attendeeName} checked in successfully!`, 'success');
                loadEventAndStats(); // Refresh stats
            } else {
                showToast(checkInResult.error, 'error');
            }
        } catch (error) {
            console.error('Check-in error:', error);
            showToast('Failed to check in attendee', 'error');
        }
    };

    const handleManualCheckIn = async (attendee) => {
        try {
            const checkInResult = await checkInAttendee(
                parseInt(eventId),
                attendee.registrationId,
                'manual',
                currentUser.id
            );

            if (checkInResult.success) {
                showToast(`✓ ${attendee.name} checked in successfully!`, 'success');
                loadEventAndStats(); // Refresh stats
                setActiveTab('history'); // Switch to history tab to show result
            } else {
                showToast(checkInResult.error, 'error');
            }
        } catch (error) {
            console.error('Check-in error:', error);
            showToast('Failed to check in attendee', 'error');
        }
    };

    const handleError = (error) => {
        showToast(typeof error === 'string' ? error : error.message, 'error');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umd-red"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Event not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-umd-red hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`${toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                            toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                                'bg-blue-50 text-blue-800 border-blue-200'
                        } border rounded-lg shadow-lg p-4 min-w-[300px]`}>
                        <p className="font-medium">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Event
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Event Check-In
                            </h1>
                            <p className="text-xl text-gray-600">{event.title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} • {event.startTime}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Registered</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Checked In</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.checkedIn}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-8 h-8 text-orange-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Not Checked In</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.notCheckedIn}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Check-In Rate</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.checkInRate}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('qr')}
                                className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'qr'
                                        ? 'bg-umd-red text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                QR Scanner
                            </button>
                            <button
                                onClick={() => setActiveTab('manual')}
                                className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'manual'
                                        ? 'bg-umd-red text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Manual Check-In
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'history'
                                        ? 'bg-umd-red text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                History
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'qr' && (
                            <QRScanner
                                eventId={parseInt(eventId)}
                                onScan={handleQRScan}
                                onError={handleError}
                            />
                        )}

                        {activeTab === 'manual' && (
                            <AttendeeSearch
                                eventId={parseInt(eventId)}
                                onCheckIn={handleManualCheckIn}
                                onError={handleError}
                            />
                        )}

                        {activeTab === 'history' && (
                            <CheckInHistory
                                eventId={parseInt(eventId)}
                                onRefresh={loadEventAndStats}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInPage;