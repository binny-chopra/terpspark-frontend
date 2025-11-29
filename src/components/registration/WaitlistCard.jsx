import React, { useState } from 'react';
import { Calendar, MapPin, Clock, AlertCircle, X } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getCategoryColor
} from '@utils/eventUtils';

const WaitlistCard = ({ waitlistEntry, onLeave }) => {
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const { event } = waitlistEntry;

    if (!event) return null;

    const categoryColor = getCategoryColor(event.category);

    const handleLeaveClick = () => {
        setShowLeaveConfirm(true);
    };

    const handleConfirmLeave = () => {
        onLeave(waitlistEntry.id);
        setShowLeaveConfirm(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
            {/* Header with orange accent */}
            <div className="bg-orange-50 p-4 border-b border-orange-200">
                <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
                        {typeof event.category === 'object' ? event.category.name : event.category}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">
                        Waitlist Position: #{waitlistEntry.position}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h3>

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
                        <span>{event.venue}</span>
                    </div>
                </div>

                {/* Waitlist Info */}
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                        You're <strong>#{waitlistEntry.position}</strong> on the waitlist.
                        We'll notify you via <strong>{waitlistEntry.notificationPreference.replace('_', ' & ')}</strong> if a spot opens up.
                    </p>
                </div>

                {/* Joined Date */}
                <p className="text-xs text-gray-500 mb-4">
                    Joined waitlist: {new Date(waitlistEntry.joinedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    })}
                </p>

                {/* Leave Waitlist Button */}
                <button
                    onClick={handleLeaveClick}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    Leave Waitlist
                </button>
            </div>

            {/* Leave Confirmation Modal */}
            {showLeaveConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-start space-x-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Leave Waitlist?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Are you sure you want to leave the waitlist for "{event.title}"?
                                    You'll lose your position (#{waitlistEntry.position}) and will need to rejoin at the end if you change your mind.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleConfirmLeave}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                            >
                                Yes, Leave Waitlist
                            </button>
                            <button
                                onClick={() => setShowLeaveConfirm(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Stay on Waitlist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaitlistCard;