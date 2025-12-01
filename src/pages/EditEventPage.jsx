import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Image as ImageIcon, Tag, Save, X } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import { getCategories } from '@services/eventService';
import { getOrganizerEvents, updateEvent } from '@services/organizerService';
import { useToast } from '@context/ToastContext';

const BACKEND_URL = 'http://127.0.0.1:8000';

const EditEventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        location: '',
        capacity: '',
        tags: '',
        imageUrl: ''
    });

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId, user?.id]);

    const loadData = async () => {
        setLoading(true);
        let eventPayload = null;

        const [catResult, eventsResult] = await Promise.all([
            getCategories(),
            getOrganizerEvents(user?.id)
        ]);

        if (catResult.success) {
            setCategories(catResult.categories);
        }

        if (eventsResult.success && eventsResult.events) {
            eventPayload = eventsResult.events.find((evt) => String(evt.id) === String(eventId));
        }

        if (eventPayload) {
            setFormData({
                title: eventPayload.title || '',
                description: eventPayload.description || '',
                categoryId: eventPayload.categoryId || '',
                date: eventPayload.date || '',
                startTime: eventPayload.startTime || '',
                endTime: eventPayload.endTime || '',
                venue: eventPayload.venue || '',
                location: eventPayload.location || '',
                capacity: eventPayload.capacity || '',
                tags: eventPayload.tags?.join(', ') || '',
                imageUrl: eventPayload.imageUrl || ''
            });
        } else {
            addToast('Event not found', 'error');
            navigate('/my-events');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/venues`);
            const data = await response.json();
            if (data.success) {
                setVenues(data.venues || []);
                if (eventPayload) {
                    const match = data.venues.find(
                        (v) => v.id === eventPayload.venueId || v.name === eventPayload.venue
                    );
                    if (match) setSelectedVenue(match);
                }
            }
        } catch (error) {
            console.error('Failed to load venues:', error);
        }

        setLoading(false);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleVenueChange = (venueId) => {
        const venue = venues.find((v) => v.id === venueId);
        if (venue) {
            setSelectedVenue(venue);
            setFormData({
                ...formData,
                venue: venue.name,
                location: venue.building
            });
            if (errors.venue || errors.location) {
                setErrors({ ...errors, venue: '', location: '' });
            }
        } else {
            setSelectedVenue(null);
            setFormData({ ...formData, venue: '', location: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Event description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Please select a category';
        }

        if (!formData.date) {
            newErrors.date = 'Event date is required';
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Start time is required';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'End time is required';
        }

        if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
            newErrors.endTime = 'End time must be after start time';
        }

        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (parseInt(formData.capacity, 10) < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        } else if (parseInt(formData.capacity, 10) > 5000) {
            newErrors.capacity = 'Capacity cannot exceed 5000';
        } else if (selectedVenue && parseInt(formData.capacity, 10) > selectedVenue.capacity) {
            newErrors.capacity = `Capacity cannot exceed venue capacity of ${selectedVenue.capacity}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            addToast('Please fix the highlighted errors', 'warning');
            return;
        }

        setSaving(true);
        const payload = {
            ...formData,
            capacity: parseInt(formData.capacity, 10),
            tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            organizerId: user.id
        };

        const result = await updateEvent(eventId, payload);

        if (result.success) {
            addToast('Event updated successfully', 'success');
            navigate('/my-events');
        } else {
            addToast(result.error || 'Failed to update event', 'error');
        }

        setSaving(false);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
            navigate('/my-events');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
                    <p className="text-gray-600 mt-1">Update your event details and save changes.</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                placeholder="e.g., Fall Career Fair 2025"
                            />
                            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description * (minimum 50 characters)
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                placeholder="Provide a detailed description of your event..."
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                <p className="text-sm text-gray-500 ml-auto">
                                    {formData.description.length} characters
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => handleChange('categoryId', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleChange('startTime', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                                {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleChange('endTime', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                />
                                {errors.endTime && <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Venue *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <select
                                    value={selectedVenue?.id || ''}
                                    onChange={(e) => handleVenueChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none"
                                >
                                    <option value="">Select a venue</option>
                                    {venues.filter((v) => v.isActive !== false).map((venue) => (
                                        <option key={venue.id} value={venue.id}>
                                            {venue.name} - {venue.building} (Capacity: {venue.capacity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.venue && <p className="text-sm text-red-600 mt-1">{errors.venue}</p>}
                            {selectedVenue && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Selected Venue:</strong> {selectedVenue.name} - {selectedVenue.building}
                                    </p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        <strong>Max Capacity:</strong> {selectedVenue.capacity} attendees
                                    </p>
                                    {selectedVenue.facilities && selectedVenue.facilities.length > 0 && (
                                        <p className="text-sm text-blue-700 mt-1">
                                            <strong>Facilities:</strong> {selectedVenue.facilities.join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacity *
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleChange('capacity', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Maximum number of attendees"
                                    min="1"
                                    max="5000"
                                />
                            </div>
                            {errors.capacity && <p className="text-sm text-red-600 mt-1">{errors.capacity}</p>}
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedVenue
                                    ? `Venue capacity: ${selectedVenue.capacity} | System maximum: 5000 attendees`
                                    : 'System maximum: 5000 attendees'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (Optional)
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => handleChange('tags', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="career, networking, professional (comma-separated)"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Image URL (Optional)
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Provide a URL to an event banner or poster image</p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Updates may require admin review before they are reflected to students.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                <span>{saving ? 'Updating...' : 'Update Event'}</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditEventPage;
