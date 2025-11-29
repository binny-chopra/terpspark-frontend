import React, { useState } from 'react';
import { Calendar, MapPin, Users, Edit, Copy, Trash2, Eye, MoreVertical, X } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getCategoryColor,
    getCapacityPercentage
} from '@utils/eventUtils';

const OrganizerEventCard = ({ event, onEdit, onCancel, onDuplicate, onViewAttendees }) => {
    const [showMenu, setShowMenu] = useState(false);

    const categoryColor = getCategoryColor(event.category);
    const capacityPercentage = getCapacityPercentage(event.capacity, event.registeredCount);

    const getStatusBadge = () => {
        const badges = {
            draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
            pending: { label: 'Pending Approval', color: 'bg-orange-100 text-orange-700' },
            published: { label: 'Published', color: 'bg-green-100 text-green-700' },
            cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
        };
        return badges[event.status] || badges.draft;
    };

    const statusBadge = getStatusBadge();
    const canEdit = event.status === 'draft' || event.status === 'pending';
    const canCancel = event.status === 'published';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                            {typeof event.category === 'object' ? event.category.name : event.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.label}
                        </span>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            {showMenu ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                {canEdit && (
                                    <button
                                        onClick={() => {
                                            onEdit(event.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit Event</span>
                                    </button>
                                )}

                                {event.status === 'published' && (
                                    <button
                                        onClick={() => {
                                            onViewAttendees(event.id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View Attendees</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        onDuplicate(event.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span>Duplicate</span>
                                </button>

                                {canCancel && (
                                    <>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                onCancel(event.id);
                                                setShowMenu(false);
                                            }}
                                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Cancel Event</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                </h3>

                {/* Event Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatEventDate(event.date)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{event.venue}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="p-5">
                {event.status === 'published' && (
                    <>
                        {/* Registrations */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <div className="flex items-center text-gray-600">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>Registrations</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {event.registeredCount} / {event.capacity}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full transition-all ${capacityPercentage >= 90 ? 'bg-red-500' :
                                            capacityPercentage >= 70 ? 'bg-orange-500' :
                                                capacityPercentage >= 50 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                        }`}
                                    style={{ width: `${capacityPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Waitlist */}
                        {event.waitlistCount > 0 && (
                            <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                                <strong>{event.waitlistCount}</strong> on waitlist
                            </div>
                        )}
                    </>
                )}

                {/* Pending Approval Message */}
                {event.status === 'pending' && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        Waiting for admin approval
                    </div>
                )}

                {/* Draft Message */}
                {event.status === 'draft' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                        Complete and submit for approval
                    </div>
                )}

                {/* Cancelled Message */}
                {event.status === 'cancelled' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        This event has been cancelled
                    </div>
                )}

                {/* Created Date */}
                <p className="text-xs text-gray-500 mt-3">
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default OrganizerEventCard;