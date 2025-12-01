import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getRemainingCapacity,
    getCapacityPercentage,
    getEventStatusBadge,
    getCategoryColor,
    truncateText
} from '@utils/eventUtils';

const EventCard = ({ event, onClick }) => {
    const remaining = getRemainingCapacity(event.capacity, event.registeredCount);
    const percentage = getCapacityPercentage(event.capacity, event.registeredCount);
    const statusBadge = getEventStatusBadge(event);
    const categoryColor = getCategoryColor(event.category);

    return (
        <div
            onClick={() => onClick(event)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
            {/* Event Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-red-300" />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Header with badges */}
                <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                        {typeof event.category === 'object' ? event.category.name : event.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {truncateText(event.description, 100)}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
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
                        <span className="truncate">{event.venue}</span>
                    </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{event.registeredCount} / {event.capacity} registered</span>
                        </div>
                        <span className="font-medium">{percentage}%</span>
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
                </div>

                {/* Organizer */}
                <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Organized by <span className="font-medium text-gray-700">{event.organizer.name}</span>
                    </p>
                </div>

                {/* Waitlist indicator */}
                {event.waitlistCount > 0 && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {event.waitlistCount} on waitlist
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;