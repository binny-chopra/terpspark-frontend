import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, QrCode, Download, X, AlertCircle } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getCategoryColor,
    isEventPast,
    getDaysUntilEvent
} from '@utils/eventUtils';

const RegistrationCard = ({ registration, onCancel, onViewTicket }) => {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const { event } = registration;

    if (!event) return null;

    const categoryColor = getCategoryColor(event.category);
    const isPast = isEventPast(event.date, event.endTime);
    const daysUntil = getDaysUntilEvent(event.date);

    const getStatusBadge = () => {
        if (registration.status === 'cancelled') {
            return { label: 'Cancelled', color: 'bg-gray-100 text-gray-700' };
        }
        if (isPast) {
            return { label: 'Completed', color: 'bg-gray-100 text-gray-700' };
        }
        if (daysUntil === 0) {
            return { label: 'Today', color: 'bg-blue-100 text-blue-700' };
        }
        if (daysUntil === 1) {
            return { label: 'Tomorrow', color: 'bg-green-100 text-green-700' };
        }
        return { label: 'Upcoming', color: 'bg-green-100 text-green-700' };
    };

    const statusBadge = getStatusBadge();

    const handleCancelClick = () => {
        setShowCancelConfirm(true);
    };

    const handleConfirmCancel = () => {
        onCancel(registration.id);
        setShowCancelConfirm(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                            {event.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                            {statusBadge.label}
                        </span>
                    </div>
                    {registration.status === 'confirmed' && !isPast && (
                        <button
                            onClick={handleCancelClick}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>

                {/* Event Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatEventDate(event.date)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatTimeRange(event.startTime, event.endTime)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{event.venue}</span>
                    </div>
                </div>
            </div>

            {/* Registration Details */}
            <div className="p-5">
                {/* Ticket Info */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Ticket Code</p>
                    <p className="font-mono text-sm font-medium text-gray-900">{registration.ticketCode}</p>
                </div>

                {/* Guests */}
                {registration.guests && registration.guests.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Guests ({registration.guests.length})</span>
                        </div>
                        <div className="space-y-1">
                            {registration.guests.map((guest, index) => (
                                <p key={index} className="text-sm text-gray-600 pl-6">
                                    {guest.name} ({guest.email})
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Check-in Status */}
                {registration.checkInStatus === 'checked_in' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                            ✓ Checked in at event
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                {registration.status === 'confirmed' && !isPast && (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => onViewTicket(registration)}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            <QrCode className="w-4 h-4" />
                            <span>View QR Code</span>
                        </button>
                        <button
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            onClick={() => alert('Download ticket feature will be implemented with backend')}
                        >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-start space-x-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Cancel Registration?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to cancel your registration for "{event.title}"?
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleConfirmCancel}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Yes, Cancel Registration
                            </button>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Keep Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationCard;