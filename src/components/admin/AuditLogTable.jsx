import React from 'react';
import { User, Calendar, Shield, FileText, Users, CheckCircle, XCircle, Edit, Trash2, LogIn } from 'lucide-react';

const ACTION_CONFIG = {
    USER_LOGIN: { icon: LogIn, color: 'bg-blue-100 text-blue-700', label: 'Login' },
    ORGANIZER_APPROVED: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Org Approved' },
    ORGANIZER_REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Org Rejected' },
    ORGANIZER_REQUEST: { icon: User, color: 'bg-orange-100 text-orange-700', label: 'Org Request' },
    EVENT_CREATED: { icon: FileText, color: 'bg-blue-100 text-blue-700', label: 'Event Created' },
    EVENT_SUBMITTED: { icon: FileText, color: 'bg-orange-100 text-orange-700', label: 'Event Submitted' },
    EVENT_APPROVED: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Event Approved' },
    EVENT_REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Event Rejected' },
    EVENT_CANCELLED: { icon: Trash2, color: 'bg-red-100 text-red-700', label: 'Event Cancelled' },
    EVENT_EDITED: { icon: Edit, color: 'bg-yellow-100 text-yellow-700', label: 'Event Edited' },
    REGISTRATION: { icon: Users, color: 'bg-blue-100 text-blue-700', label: 'Registration' },
    REGISTRATION_CANCELLED: { icon: XCircle, color: 'bg-orange-100 text-orange-700', label: 'Reg Cancelled' },
    CHECK_IN: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Check-in' },
    CATEGORY_CREATED: { icon: Shield, color: 'bg-purple-100 text-purple-700', label: 'Category Added' },
    CATEGORY_UPDATED: { icon: Edit, color: 'bg-purple-100 text-purple-700', label: 'Category Updated' },
    CATEGORY_RETIRED: { icon: Trash2, color: 'bg-gray-100 text-gray-700', label: 'Category Retired' },
    CATEGORY_REACTIVATED: { icon: CheckCircle, color: 'bg-purple-100 text-purple-700', label: 'Category Active' },
    VENUE_CREATED: { icon: Shield, color: 'bg-teal-100 text-teal-700', label: 'Venue Added' },
    VENUE_UPDATED: { icon: Edit, color: 'bg-teal-100 text-teal-700', label: 'Venue Updated' },
    VENUE_RETIRED: { icon: Trash2, color: 'bg-gray-100 text-gray-700', label: 'Venue Retired' },
    VENUE_REACTIVATED: { icon: CheckCircle, color: 'bg-teal-100 text-teal-700', label: 'Venue Active' },
    ROLE_CHANGE: { icon: Shield, color: 'bg-purple-100 text-purple-700', label: 'Role Change' }
};

const AuditLogTable = ({ logs }) => {
    const getActionConfig = (action) => {
        return ACTION_CONFIG[action] || { icon: FileText, color: 'bg-gray-100 text-gray-700', label: action };
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (logs.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Audit Logs Found</h3>
                <p className="text-gray-600">No logs match your current filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actor
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => {
                            const config = getActionConfig(log.action);
                            const Icon = config.icon;
                            const { date, time } = formatTimestamp(log.timestamp);

                            return (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{date}</div>
                                        <div className="text-xs text-gray-500">{time}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
                                            <Icon className="w-3 h-3 mr-1" />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {log.actor?.name || 'System'}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {log.actor?.role || 'system'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {log.target ? (
                                            <div>
                                                <div className="text-sm text-gray-900">{log.target.name}</div>
                                                <div className="text-xs text-gray-500 capitalize">{log.target.type}</div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                                            {log.details}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;