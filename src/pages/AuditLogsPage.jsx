import React, { useState, useEffect } from 'react';
import { Shield, Download, Search, Calendar, Filter } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import AuditLogTable from '@components/admin/AuditLogTable';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { fetchAuditLogs, exportAuditLogs } from '@services/adminService';

const ACTION_TYPES = [
    { value: 'all', label: 'All Actions' },
    { value: 'USER_LOGIN', label: 'User Logins' },
    { value: 'ORGANIZER_APPROVED', label: 'Organizer Approvals' },
    { value: 'ORGANIZER_REJECTED', label: 'Organizer Rejections' },
    { value: 'ORGANIZER_REQUEST', label: 'Organizer Requests' },
    { value: 'EVENT_CREATED', label: 'Events Created' },
    { value: 'EVENT_SUBMITTED', label: 'Events Submitted' },
    { value: 'EVENT_APPROVED', label: 'Events Approved' },
    { value: 'EVENT_REJECTED', label: 'Events Rejected' },
    { value: 'EVENT_CANCELLED', label: 'Events Cancelled' },
    { value: 'REGISTRATION', label: 'Registrations' },
    { value: 'CHECK_IN', label: 'Check-ins' },
    { value: 'ROLE_CHANGE', label: 'Role Changes' },
    { value: 'CATEGORY_CREATED', label: 'Categories Created' },
    { value: 'VENUE_CREATED', label: 'Venues Created' }
];

const AuditLogsPage = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: 'all',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadLogs();
    }, [filters]);

    const loadLogs = async () => {
        setLoading(true);
        const result = await fetchAuditLogs(filters);
        if (result.success) {
            setLogs(result.logs);
        }
        setLoading(false);
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleClearFilters = () => {
        setFilters({
            action: 'all',
            startDate: '',
            endDate: '',
            search: ''
        });
    };

    const handleExport = () => {
        exportAuditLogs(logs);
    };

    const hasActiveFilters = filters.action !== 'all' || filters.startDate || filters.endDate || filters.search;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
                        <p className="text-gray-600 mt-1">View system activity and security events</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={logs.length === 0}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Info Banner */}
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-purple-900">Read-Only Audit Trail</h4>
                        <p className="text-sm text-purple-800">
                            Audit logs are append-only and cannot be modified or deleted. All system actions are automatically recorded for security and compliance.
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user, event, or details..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${showFilters || hasActiveFilters
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
                                <select
                                    value={filters.action}
                                    onChange={(e) => handleFilterChange('action', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                >
                                    {ACTION_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={filters.startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-900">{logs.length}</span> log entries
                    </p>
                </div>

                {/* Audit Log Table */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading audit logs...</p>
                    </div>
                ) : (
                    <AuditLogTable logs={logs} />
                )}
            </main>
        </div>
    );
};

export default AuditLogsPage;