import { useState } from 'react';
import { X, Users, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { formatEventDate, formatTimeRange } from '@utils/eventUtils';

const RegistrationModal = ({ event, onClose, onSubmit, isWaitlist = false }) => {
    const [formData, setFormData] = useState({
        guests: [],
        sessions: [],
        notificationPreference: 'email'
    });
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [errors, setErrors] = useState({});

    const handleAddGuest = () => {
        setErrors({});

        if (!guestName.trim()) {
            setErrors({ guestName: 'Guest name is required' });
            return;
        }

        if (!guestEmail.trim()) {
            setErrors({ guestEmail: 'Guest email is required' });
            return;
        }

        if (!guestEmail.endsWith('@umd.edu')) {
            setErrors({ guestEmail: 'Guest must have a UMD email address' });
            return;
        }

        // Check guest limit (example: max 2 guests)
        if (formData.guests.length >= 2) {
            setErrors({ guests: 'Maximum 2 guests allowed per registration' });
            return;
        }

        const newGuest = {
            id: Date.now(),
            name: guestName.trim(),
            email: guestEmail.trim()
        };

        setFormData({
            ...formData,
            guests: [...formData.guests, newGuest]
        });

        setGuestName('');
        setGuestEmail('');
    };

    const handleRemoveGuest = (guestId) => {
        setFormData({
            ...formData,
            guests: formData.guests.filter(g => g.id !== guestId)
        });
        setErrors({});
    };

    const handleSubmit = () => {
        setErrors({});

        // Validate total capacity including guests
        const totalAttendees = 1 + formData.guests.length;
        const remainingCapacity = event.capacity - event.registeredCount;

        if (!isWaitlist && totalAttendees > remainingCapacity) {
            setErrors({
                capacity: `Only ${remainingCapacity} spot(s) remaining. Please reduce number of guests or join waitlist.`
            });
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isWaitlist ? 'Join Waitlist' : 'Register for Event'}
                        </h2>
                        <p className="text-gray-600">{event.title}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {formatEventDate(event.date)} • {formatTimeRange(event.startTime, event.endTime)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Waitlist Info */}
                    {isWaitlist && (
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-orange-900 mb-1">Event is Currently Full</h3>
                                    <p className="text-sm text-orange-800">
                                        This event has reached capacity. You'll be added to the waitlist and notified if a spot becomes available.
                                        Current waitlist: <strong>{event.waitlistCount || 0}</strong> people.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Info */}
                    {!isWaitlist && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-green-900 mb-1">Confirm Your Registration</h3>
                                    <p className="text-sm text-green-800">
                                        You'll receive a confirmation email with your ticket and QR code.
                                        Remaining capacity: <strong>{event.capacity - event.registeredCount}</strong> spots.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest Registration Section */}
                    {!isWaitlist && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Bring Guests (Optional)
                            </h3>

                            <p className="text-sm text-gray-600 mb-4">
                                You can bring up to 2 campus-affiliated guests. All guests must have a UMD email address.
                            </p>

                            {/* Add Guest Form */}
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Guest Name
                                    </label>
                                    <input
                                        type="text"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        placeholder="Enter guest's full name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                                    {errors.guestName && (
                                        <p className="text-sm text-red-600 mt-1">{errors.guestName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Guest Email (UMD)
                                    </label>
                                    <input
                                        type="email"
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        placeholder="guest@umd.edu"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                                    {errors.guestEmail && (
                                        <p className="text-sm text-red-600 mt-1">{errors.guestEmail}</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddGuest}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Add Guest
                                </button>

                                {errors.guests && (
                                    <p className="text-sm text-red-600">{errors.guests}</p>
                                )}
                            </div>

                            {/* Guest List */}
                            {formData.guests.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Guests ({formData.guests.length}/2):
                                    </p>
                                    {formData.guests.map((guest) => (
                                        <div
                                            key={guest.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{guest.name}</p>
                                                <p className="text-sm text-gray-600">{guest.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveGuest(guest.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Remove guest"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Capacity Warning */}
                    {errors.capacity && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{errors.capacity}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            {isWaitlist ? 'Join Waitlist' : 'Confirm Registration'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        By registering, you agree to attend the event and follow campus guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;