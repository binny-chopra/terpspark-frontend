import React, { useState, useEffect } from 'react';
import { BarChart2, Calendar, Users, TrendingUp, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import AnalyticsChart from '@components/admin/AnalyticsChart';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { fetchAnalytics, exportAnalytics } from '@services/adminService';

const AnalyticsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        const result = await fetchAnalytics();
        if (result.success) {
            setAnalytics(result.analytics);
        }
        setLoading(false);
    };

    const handleExport = () => {
        if (analytics) {
            exportAnalytics(analytics);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading analytics..." />;
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Failed to load analytics data</p>
            </div>
        );
    }

    const summary = {
        totalEvents: 0,
        totalRegistrations: 0,
        totalAttendance: 0,
        noShows: 0,
        activeOrganizers: 0,
        activeStudents: 0,
        pendingApprovals: 0,
        ...analytics.summary
    };
    const byCategory = analytics.byCategory || [];
    const byMonth = analytics.byMonth || analytics.byDate || [];
    const attendanceRate = summary.totalRegistrations > 0
        ? ((summary.totalAttendance / summary.totalRegistrations) * 100).toFixed(1)
        : 0;

    // Prepare chart data
    const monthlyData = byMonth.map(m => {
        const label = m.month || m.date || '';
        const name = label.includes(' ') ? label.split(' ')[0] : label;
        return {
            name,
            events: m.events ?? m.count ?? 0,
            registrations: m.registrations ?? m.totalRegistrations ?? 0
        };
    });

    const attendancePieData = [
        { name: 'Attended', value: summary.totalAttendance },
        { name: 'No Shows', value: summary.noShows }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/management')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-1">Event and registration metrics overview</p>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Events</p>
                            <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{summary.totalEvents}</p>
                        <p className="text-xs text-gray-500 mt-1">All time</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                            <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{summary.totalRegistrations.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Across all events</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                            <TrendingUp className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">{attendanceRate}%</p>
                        <p className="text-xs text-gray-500 mt-1">{summary.totalAttendance} attended</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">No Shows</p>
                            <BarChart2 className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{summary.noShows}</p>
                        <p className="text-xs text-gray-500 mt-1">{(100 - parseFloat(attendanceRate)).toFixed(1)}% of registrations</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <AnalyticsChart
                        type="bar"
                        data={monthlyData}
                        title="Monthly Trends"
                    />
                    <AnalyticsChart
                        type="pie"
                        data={attendancePieData}
                        title="Attendance vs No Shows"
                    />
                </div>

                {/* Category Breakdown */}
                <AnalyticsChart
                    type="category-bars"
                    data={byCategory}
                    title="Performance by Category"
                />

                {/* Category Table */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Events
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registrations
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Attendance
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {byCategory.map((cat, idx) => {
                                    const rate = cat.registrations > 0
                                        ? ((cat.attendance / cat.registrations) * 100).toFixed(1)
                                        : 0;
                                    return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-medium text-gray-900">{cat.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                                                {cat.events}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                                                {cat.registrations}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                                                {cat.attendance}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${rate >= 80 ? 'bg-green-100 text-green-700' :
                                                        rate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {rate}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Organizers</span>
                                <span className="font-semibold text-gray-900">{summary.activeOrganizers}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Pending Approvals</span>
                                <span className="font-semibold text-orange-600">{summary.pendingApprovals}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Registrations/Event</span>
                                <span className="font-semibold text-gray-900">
                                    {summary.totalEvents ? (summary.totalRegistrations / summary.totalEvents).toFixed(1) : 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Attendance/Event</span>
                                <span className="font-semibold text-gray-900">
                                    {summary.totalEvents ? (summary.totalAttendance / summary.totalEvents).toFixed(1) : 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">
                                    <strong>Career</strong> events have the highest attendance rate with {byCategory.find(c => c.category === 'Career')?.attendance || 0} attendees.
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>{byCategory.length ? byCategory.reduce((max, c) => c.events > max.events ? c : max, byCategory[0])?.category : 'N/A'}</strong> is the most popular category with the most events.
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                <p className="text-sm text-purple-800">
                                    Overall platform engagement is at <strong>{attendanceRate}%</strong> attendance rate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;
