import { useState, useEffect } from 'react';
import { Clock, User, Users, Camera, Search as SearchIcon, Download, RefreshCw, Undo2 } from 'lucide-react';
import { getEventCheckIns, exportCheckIns, undoCheckIn } from '../../services/checkInService';

const CheckInHistory = ({ eventId, onRefresh }) => {
    const [checkIns, setCheckIns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMethod, setFilterMethod] = useState('all'); // all, qr_scan, manual, search

    useEffect(() => {
        loadCheckIns();
    }, [eventId]);

    const loadCheckIns = async () => {
        setIsLoading(true);
        try {
            const result = await getEventCheckIns(eventId);
            if (result.success) {
                setCheckIns(result.data);
            }
        } catch (error) {
            console.error('Failed to load check-ins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        loadCheckIns();
        onRefresh?.();
    };

    const handleExport = async () => {
        try {
            const result = await exportCheckIns(eventId);
            if (result.success) {
                // Create download link
                const url = window.URL.createObjectURL(result.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = result.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to export check-ins:', error);
        }
    };

    const handleUndo = async (checkInId) => {
        if (!confirm('Are you sure you want to undo this check-in?')) {
            return;
        }

        try {
            const result = await undoCheckIn(checkInId);
            if (result.success) {
                loadCheckIns();
                onRefresh?.();
            }
        } catch (error) {
            console.error('Failed to undo check-in:', error);
        }
    };

    const filteredCheckIns = checkIns.filter(checkIn => {
        const matchesSearch = searchQuery === '' ||
            checkIn.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            checkIn.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterMethod === 'all' || checkIn.method === filterMethod;

        return matchesSearch && matchesFilter;
    });

    const getMethodIcon = (method) => {
        switch (method) {
            case 'qr_scan':
                return <Camera className="w-4 h-4" />;
            case 'search':
                return <SearchIcon className="w-4 h-4" />;
            case 'manual':
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const getMethodLabel = (method) => {
        switch (method) {
            case 'qr_scan':
                return 'QR Scan';
            case 'search':
                return 'Search';
            case 'manual':
            default:
                return 'Manual';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umd-red"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    Check-In History ({filteredCheckIns.length})
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-umd-red text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                    />
                </div>
                <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                >
                    <option value="all">All Methods</option>
                    <option value="qr_scan">QR Scan</option>
                    <option value="manual">Manual</option>
                    <option value="search">Search</option>
                </select>
            </div>

            {/* Check-In List */}
            {filteredCheckIns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                        {checkIns.length === 0
                            ? 'No check-ins yet'
                            : 'No check-ins match your search'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredCheckIns.map((checkIn) => (
                        <div
                            key={checkIn.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-umd-red transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {checkIn.attendeeName}
                                        </h4>
                                        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                            {getMethodIcon(checkIn.method)}
                                            {getMethodLabel(checkIn.method)}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-sm">
                                        <p className="text-gray-600">{checkIn.attendeeEmail}</p>

                                        <div className="flex items-center gap-4 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(checkIn.checkedInAt)} • {formatDate(checkIn.checkedInAt)}
                                            </div>

                                            {checkIn.guestCount > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4" />
                                                    {checkIn.guestCount} {checkIn.guestCount === 1 ? 'guest' : 'guests'}
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-500 text-xs">
                                            Checked in by: {checkIn.checkedInBy.name}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUndo(checkIn.id)}
                                    className="ml-4 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-1.5"
                                    title="Undo check-in"
                                >
                                    <Undo2 className="w-4 h-4" />
                                    Undo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            {checkIns.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Check-Ins</p>
                            <p className="text-2xl font-bold text-gray-900">{checkIns.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">QR Scans</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {checkIns.filter(c => c.method === 'qr_scan').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Manual</p>
                            <p className="text-2xl font-bold text-green-600">
                                {checkIns.filter(c => c.method === 'manual').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Guests</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {checkIns.reduce((sum, c) => sum + c.guestCount, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckInHistory;