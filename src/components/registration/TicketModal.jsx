import React, { useRef } from 'react';
import { X, Download, Calendar, MapPin, Clock, User } from 'lucide-react';
import { formatEventDate, formatTimeRange } from '@utils/eventUtils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TicketModal = ({ registration, onClose }) => {
    const { event } = registration;
    const ticketRef = useRef(null);

    const handleDownload = async () => {
        try {
            const ticketElement = ticketRef.current;
            const canvas = await html2canvas(ticketElement, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const y = 10;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`ticket-${registration.ticketCode}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to download ticket. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Your Ticket</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Ticket Content */}
                <div className="p-6" ref={ticketRef}>
                    {/* Event Title */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.venue}</p>
                    </div>

                    {/* QR Code */}
                    <div className="mb-6 flex justify-center">
                        <div className="bg-white border-4 border-red-600 rounded-lg p-4">
                            <img
                                src={registration.qrCode}
                                alt="Ticket QR Code"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    {/* Ticket Code */}
                    <div className="mb-6 text-center">
                        <p className="text-xs text-gray-500 mb-1">Ticket Code</p>
                        <p className="font-mono text-lg font-bold text-gray-900">{registration.ticketCode}</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm font-medium text-gray-900">{formatEventDate(event.date)}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatTimeRange(event.startTime, event.endTime)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                                <p className="text-xs text-gray-600">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-500">Organizer</p>
                                <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                                <p className="text-xs text-gray-600">{event.organizer.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Guests */}
                    {registration.guests && registration.guests.length > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-2">
                                Guests ({registration.guests.length})
                            </p>
                            <div className="space-y-1">
                                {registration.guests.map((guest, index) => (
                                    <p key={index} className="text-sm text-blue-800">
                                        • {guest.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-900 mb-2">Check-in Instructions</p>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Show this QR code at the event entrance</li>
                            <li>• Arrive 15 minutes early for smooth check-in</li>
                            <li>• Bring a valid student ID</li>
                            <li>• Guests must check in with you</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download Ticket</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Save this ticket or take a screenshot. You can also access it anytime from My Registrations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;