import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Mail, Tag } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getRemainingCapacity,
    getCapacityPercentage,
    getEventStatusBadge,
    getCategoryColor,
    isEventFull
} from '@utils/eventUtils';

const EventDetailModal = ({ event, onClose, onRegister }) => {
    if (!event) return null;

    const remaining = getRemainingCapacity(event.capacity, event.registeredCount);
    const percentage = getCapacityPercentage(event.capacity, event.registeredCount);
    const statusBadge = getEventStatusBadge(event);
    const categoryColor = getCategoryColor(event.category);
    const isFull = isEventFull(event.capacity, event.registeredCount);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                                {event.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.label}
                            </span>
                            {event.isFeatured && (
                                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                    Featured
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Image */}
                <div className="h-64 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                    <Calendar className="w-24 h-24 text-red-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Date</p>
                                    <p className="text-gray-900">{formatEventDate(event.date)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Time</p>
                                    <p className="text-gray-900">{formatTimeRange(event.startTime, event.endTime)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Location</p>
                                    <p className="text-gray-900">{event.venue}</p>
                                    <p className="text-sm text-gray-500">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Capacity</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Registered: {event.registeredCount}</span>
                                            <span className="text-gray-600">Total: {event.capacity}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${percentage >= 90 ? 'bg-red-500' :
                                                        percentage >= 70 ? 'bg-orange-500' :
                                                            percentage >= 50 ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {remaining} spots remaining
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Organizer</p>
                                    <p className="text-gray-900">{event.organizer.name}</p>
                                    <p className="text-sm text-gray-500">{event.organizer.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-2">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Waitlist Info */}
                    {event.waitlistCount > 0 && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                                <strong>{event.waitlistCount}</strong> people are currently on the waitlist for this event.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {!isFull ? (
                            <button
                                onClick={() => onRegister(event)}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Register for Event
                            </button>
                        ) : (
                            <button
                                onClick={() => onRegister(event)}
                                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                            >
                                Join Waitlist
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;