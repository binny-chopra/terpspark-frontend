import { useState } from 'react';
import { Search, UserCheck, Users, Calendar, Mail, Ticket, X } from 'lucide-react';

const AttendeeSearch = ({ eventId, onCheckIn, onError }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            onError?.('Please enter a search term');
            return;
        }

        setIsSearching(true);

        try {
            // Mock search - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock search results
            const mockAttendees = [
                {
                    id: 1,
                    registrationId: 1,
                    userId: 1,
                    name: 'John Doe',
                    email: 'student@umd.edu',
                    ticketCode: 'TKT-1699558899-3',
                    qrCode: 'QR-TKT-1699558899-3',
                    guestCount: 0,
                    guests: [],
                    checkedIn: false,
                    checkedInAt: null,
                    registeredAt: '2025-10-28T10:30:00Z'
                },
                {
                    id: 2,
                    registrationId: 2,
                    userId: 2,
                    name: 'Jane Smith',
                    email: 'jane.smith@umd.edu',
                    ticketCode: 'TKT-1699559000-3',
                    qrCode: 'QR-TKT-1699559000-3',
                    guestCount: 1,
                    guests: [{ name: 'Guest One', email: 'guest1@umd.edu' }],
                    checkedIn: false,
                    checkedInAt: null,
                    registeredAt: '2025-10-28T11:00:00Z'
                },
                {
                    id: 3,
                    registrationId: 8,
                    userId: 5,
                    name: 'Emily Davis',
                    email: 'emily.davis@umd.edu',
                    ticketCode: 'TKT-1699560000-3',
                    qrCode: 'QR-TKT-1699560000-3',
                    guestCount: 2,
                    guests: [
                        { name: 'Guest Two', email: 'guest2@umd.edu' },
                        { name: 'Guest Three', email: 'guest3@umd.edu' }
                    ],
                    checkedIn: true,
                    checkedInAt: '2025-11-08T14:10:00Z',
                    registeredAt: '2025-10-28T12:00:00Z'
                }
            ];

            const filtered = mockAttendees.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.ticketCode.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filtered);
        } catch (error) {
            console.error('Search error:', error);
            onError?.('Failed to search attendees');
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const selectAttendee = (attendee) => {
        setSelectedAttendee(attendee);
    };

    const clearSelection = () => {
        setSelectedAttendee(null);
    };

    const confirmCheckIn = () => {
        if (selectedAttendee && onCheckIn) {
            onCheckIn(selectedAttendee);
            setSelectedAttendee(null);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search by name, email, or ticket code..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-umd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedAttendee && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">
                        Found {searchResults.length} {searchResults.length === 1 ? 'attendee' : 'attendees'}
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {searchResults.map((attendee) => (
                            <div
                                key={attendee.id}
                                onClick={() => !attendee.checkedIn && selectAttendee(attendee)}
                                className={`p-4 border rounded-lg transition ${attendee.checkedIn
                                    ? 'bg-gray-50 border-gray-300 cursor-not-allowed opacity-60'
                                    : 'bg-white border-gray-200 hover:border-umd-red hover:shadow-md cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">{attendee.name}</h4>
                                            {attendee.checkedIn && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    ✓ Checked In
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {attendee.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Ticket className="w-4 h-4" />
                                                {attendee.ticketCode}
                                            </div>
                                            {attendee.guestCount > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    {attendee.guestCount} {attendee.guestCount === 1 ? 'guest' : 'guests'}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                Registered: {new Date(attendee.registeredAt).toLocaleDateString()}
                                            </div>
                                            {attendee.checkedIn && (
                                                <div className="text-sm text-green-600 font-medium">
                                                    Checked in: {new Date(attendee.checkedInAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!attendee.checkedIn && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectAttendee(attendee);
                                            }}
                                            className="bg-umd-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                            Check In
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && searchQuery && !isSearching && (
                <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No attendees found matching "{searchQuery}"</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Try searching by name, email, or ticket code
                    </p>
                </div>
            )}

            {/* Selected Attendee Confirmation */}
            {selectedAttendee && (
                <div className="bg-white border-2 border-umd-red rounded-lg p-6 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Confirm Check-In</h3>
                        <button
                            onClick={clearSelection}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Attendee Name</label>
                            <p className="text-lg font-semibold text-gray-900">{selectedAttendee.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{selectedAttendee.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Ticket Code</label>
                            <p className="font-mono text-gray-900">{selectedAttendee.ticketCode}</p>
                        </div>
                        {selectedAttendee.guestCount > 0 && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Guests ({selectedAttendee.guestCount})</label>
                                <ul className="mt-1 space-y-1">
                                    {selectedAttendee.guests.map((guest, idx) => (
                                        <li key={idx} className="text-gray-900 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            {guest.name} ({guest.email})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={confirmCheckIn}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <UserCheck className="w-5 h-5" />
                            Confirm Check-In
                        </button>
                        <button
                            onClick={clearSelection}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!selectedAttendee && searchResults.length === 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Manual Check-In Instructions:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Enter the attendee's name, email, or ticket code in the search box</li>
                        <li>• Select the correct attendee from the search results</li>
                        <li>• Review the attendee details and confirm check-in</li>
                        <li>• Attendees who are already checked in will be marked and disabled</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AttendeeSearch;