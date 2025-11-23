import React, { useState } from 'react';
import { User, Calendar, MapPin, Users, Clock, Check, X, MessageSquare } from 'lucide-react';

const ApprovalCard = ({ item, type, onApprove, onReject }) => {
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [action, setAction] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleAction = (actionType) => {
        setAction(actionType);
        setShowNotesModal(true);
    };

    const handleSubmit = async () => {
        setProcessing(true);
        if (action === 'approve') {
            await onApprove(item.id, notes);
        } else {
            await onReject(item.id, notes);
        }
        setProcessing(false);
        setShowNotesModal(false);
        setNotes('');
    };

    if (type === 'organizer') {
        return (
            <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.email}</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            Pending
                        </span>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Department: <strong>{item.department}</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Requested: {new Date(item.requestedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Reason:</strong> {item.reason}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleAction('approve')}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                        </button>
                        <button
                            onClick={() => handleAction('reject')}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                        </button>
                    </div>
                </div>

                {showNotesModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {action === 'approve' ? 'Approve' : 'Reject'} Organizer Request
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {action === 'approve'
                                    ? 'Add optional notes for approval (visible to organizer).'
                                    : 'Please provide a reason for rejection (required).'}
                            </p>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={action === 'approve' ? 'Optional notes...' : 'Reason for rejection (required)...'}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                            />
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing || (action === 'reject' && !notes.trim())}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${action === 'approve'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {processing ? 'Processing...' : (action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')}
                                </button>
                                <button
                                    onClick={() => { setShowNotesModal(false); setNotes(''); }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Event type
    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded capitalize">
                        {item.category}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                        Pending Review
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{item.startTime} - {item.endTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{item.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Capacity: {item.capacity}</span>
                    </div>
                </div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Submitted by</p>
                    <p className="text-sm font-medium text-gray-900">{item.organizer.name}</p>
                    <p className="text-xs text-gray-600">{item.organizer.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Submitted: {new Date(item.submittedAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleAction('approve')}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        <span>Approve & Publish</span>
                    </button>
                    <button
                        onClick={() => handleAction('reject')}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                    </button>
                </div>
            </div>

            {showNotesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {action === 'approve' ? 'Approve & Publish' : 'Reject'} Event
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {action === 'approve'
                                ? 'Add optional notes. The event will be published immediately.'
                                : 'Please provide feedback for the organizer (required).'}
                        </p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={action === 'approve' ? 'Optional notes...' : 'Feedback for organizer (required)...'}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSubmit}
                                disabled={processing || (action === 'reject' && !notes.trim())}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${action === 'approve'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {processing ? 'Processing...' : (action === 'approve' ? 'Publish Event' : 'Confirm Rejection')}
                            </button>
                            <button
                                onClick={() => { setShowNotesModal(false); setNotes(''); }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApprovalCard;