import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, AlertCircle, Clock, MapPin, Users, Tag } from 'lucide-react';
import { getEventById, updateEvent } from '../services/organizerService';
import { getAllCategories } from '../services/eventService';

const EditEventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);

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
        imageUrl: '',
        tags: '',
        changeNote: ''
    });

    useEffect(() => {
        loadEventAndCategories();
    }, [eventId]);

    const loadEventAndCategories = async () => {
        setIsLoading(true);
        try {
            // Load event
            const eventResult = await getEventById(eventId);
            if (eventResult.success) {
                const evt = eventResult.data;
                setEvent(evt);

                // Populate form
                setFormData({
                    title: evt.title || '',
                    description: evt.description || '',
                    categoryId: evt.categoryId || '',
                    date: evt.date || '',
                    startTime: evt.startTime || '',
                    endTime: evt.endTime || '',
                    venue: evt.venue || '',
                    location: evt.location || '',
                    capacity: evt.capacity || '',
                    imageUrl: evt.imageUrl || '',
                    tags: evt.tags?.join(', ') || '',
                    changeNote: ''
                });
            } else {
                showToast('Event not found', 'error');
                navigate('/organizer/events');
            }

            // Load categories
            const categoriesResult = await getAllCategories();
            if (categoriesResult.success) {
                setCategories(categoriesResult.data);
            }
        } catch (error) {
            console.error('Failed to load event:', error);
            showToast('Failed to load event data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const canEdit = () => {
        if (!event) return false;
        // Can edit if status is draft or pending
        return event.status === 'draft' || event.status === 'pending';
    };

    const getEditableFields = () => {
        if (!event) return [];

        if (event.status === 'draft') {
            // All fields editable for draft
            return ['all'];
        } else if (event.status === 'pending') {
            // Most fields editable for pending (will require resubmission)
            return ['all'];
        } else if (event.status === 'published') {
            // Very limited editing for published events
            return ['capacity', 'description'];
        }

        return [];
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            const eventDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (eventDate < today) {
                newErrors.date = 'Event date must be in the future';
            }
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Start time is required';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'End time is required';
        }

        if (formData.startTime && formData.endTime) {
            if (formData.endTime <= formData.startTime) {
                newErrors.endTime = 'End time must be after start time';
            }
        }

        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else {
            const capacity = parseInt(formData.capacity);
            if (isNaN(capacity) || capacity < 1) {
                newErrors.capacity = 'Capacity must be at least 1';
            } else if (capacity > 5000) {
                newErrors.capacity = 'Capacity cannot exceed 5000';
            }
        }

        if (event.status === 'pending' && !formData.changeNote.trim()) {
            newErrors.changeNote = 'Change note is required when editing pending events';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                ...formData,
                capacity: parseInt(formData.capacity),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const result = await updateEvent(eventId, updateData);

            if (result.success) {
                showToast('Event updated successfully!', 'success');

                // If pending event, it's resubmitted for approval
                if (event.status === 'pending') {
                    showToast('Event resubmitted for approval', 'info');
                }

                setTimeout(() => {
                    navigate('/organizer/events');
                }, 1500);
            } else {
                showToast(result.error || 'Failed to update event', 'error');
            }
        } catch (error) {
            console.error('Update error:', error);
            showToast('Failed to update event', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
            navigate('/organizer/events');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umd-red"></div>
            </div>
        );
    }

    if (!event || !canEdit()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cannot Edit Event</h2>
                    <p className="text-gray-600 mb-4">
                        {!event ? 'Event not found' : `Events with status "${event.status}" cannot be edited`}
                    </p>
                    <button
                        onClick={() => navigate('/organizer/events')}
                        className="text-umd-red hover:underline"
                    >
                        Back to My Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`${toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                        toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                            'bg-blue-50 text-blue-800 border-blue-200'
                        } border rounded-lg shadow-lg p-4 min-w-[300px]`}>
                        <p className="font-medium">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/organizer/events')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to My Events
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
                            <p className="text-gray-600">Update your event details</p>
                            <div className="mt-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                    Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notice for pending events */}
            {event.status === 'pending' && (
                <div className="bg-yellow-50 border-b border-yellow-200">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-yellow-900">Pending Event</h3>
                                <p className="text-sm text-yellow-800">
                                    This event is pending approval. Any changes will require re-submission for approval.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <div className="container mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Basic Information
                        </h2>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter event title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description * (minimum 50 characters)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Describe your event in detail..."
                            />
                            <div className="flex justify-between mt-1">
                                {errors.description ? (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        {formData.description.length} / 50 minimum
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="mt-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Date & Time
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.startTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.startTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                                )}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.endTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.endTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="mt-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Location
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Venue */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Venue *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.venue ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., Stamp Student Union"
                                    />
                                </div>
                                {errors.venue && (
                                    <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Room/Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Grand Ballroom"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-8 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Additional Details
                        </h2>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Capacity * (1-5000)
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min="1"
                                    max="5000"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.capacity ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Maximum number of attendees"
                                />
                            </div>
                            {errors.capacity && (
                                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                            )}
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Image URL (optional)
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tags (comma-separated, optional)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent"
                                placeholder="e.g., networking, workshop, free food"
                            />
                        </div>

                        {/* Change Note (for pending events) */}
                        {event.status === 'pending' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Change Note * (required for pending events)
                                </label>
                                <textarea
                                    name="changeNote"
                                    value={formData.changeNote}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${errors.changeNote ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Briefly explain what changes you made..."
                                />
                                {errors.changeNote && (
                                    <p className="mt-1 text-sm text-red-600">{errors.changeNote}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-umd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventPage;
