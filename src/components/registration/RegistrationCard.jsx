import React, { useState, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, QrCode, Download, X, AlertCircle } from 'lucide-react';
import {
    formatEventDate,
    formatTimeRange,
    getCategoryColor,
    isEventPast,
    getDaysUntilEvent
} from '@utils/eventUtils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const RegistrationCard = ({ registration, onCancel, onViewTicket }) => {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const ticketRef = useRef(null);
    const { event } = registration;

    if (!event) return null;

    const categoryColor = getCategoryColor(event.category);
    const isPast = isEventPast(event.date, event.endTime);
    const daysUntil = getDaysUntilEvent(event.date);

    const handleDownload = async () => {
        try {
            // Create a temporary container with ticket content
            const ticketContent = document.createElement('div');
            ticketContent.style.padding = '40px';
            ticketContent.style.backgroundColor = '#ffffff';
            ticketContent.style.width = '600px';
            ticketContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="font-size: 24px; font-weight: bold; color: #111827; margin-bottom: 8px;">Your Ticket</h2>
                    <h3 style="font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 8px;">${event.title}</h3>
                    <p style="font-size: 14px; color: #6b7280;">${event.venue}</p>
                </div>
                
                <div style="display: flex; justify-content: center; margin-bottom: 30px;">
                    <div style="border: 4px solid #dc2626; border-radius: 8px; padding: 16px; background: white;">
                        <img src="${registration.qrCode}" alt="QR Code" style="width: 200px; height: 200px; display: block;" />
                    </div>
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Ticket Code</p>
                    <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #111827;">${registration.ticketCode}</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="margin-bottom: 16px;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Date</p>
                        <p style="font-size: 14px; font-weight: 500; color: #111827;">${formatEventDate(event.date)}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Time</p>
                        <p style="font-size: 14px; font-weight: 500; color: #111827;">${formatTimeRange(event.startTime, event.endTime)}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Location</p>
                        <p style="font-size: 14px; font-weight: 500; color: #111827;">${event.venue}</p>
                    </div>
                    
                    <div>
                        <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Organizer</p>
                        <p style="font-size: 14px; font-weight: 500; color: #111827;">${event.organizer.name}</p>
                    </div>
                </div>
                
                <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; border: 1px solid #fbbf24;">
                    <p style="font-size: 14px; font-weight: 500; color: #92400e; margin-bottom: 8px;">Check-in Instructions</p>
                    <ul style="font-size: 14px; color: #92400e; margin: 0; padding-left: 20px;">
                        <li>Show this QR code at the event entrance</li>
                        <li>Arrive 15 minutes early for smooth check-in</li>
                        <li>Bring a valid student ID</li>
                        <li>Guests must check in with you</li>
                    </ul>
                </div>
            `;

            document.body.appendChild(ticketContent);

            const canvas = await html2canvas(ticketContent, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });

            document.body.removeChild(ticketContent);

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
                            {typeof event.category === 'object' ? event.category.name : event.category}
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
                            onClick={handleDownload}
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