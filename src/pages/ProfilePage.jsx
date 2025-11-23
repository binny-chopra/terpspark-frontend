import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, Building, Calendar, Bell,
    Save, Camera, Edit2, Activity, Award, X
} from 'lucide-react';
import {
    getProfile,
    updateProfile,
    updateProfilePicture,
    updatePreferences,
    getUserStats
} from '../services/profileService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // profile, preferences, stats

    // Mock current user (replace with auth context)
    const currentUser = { id: 1 };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        graduationYear: '',
        bio: '',
        interests: '',
        profilePicture: ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        eventReminders: true,
        weeklyDigest: true
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setIsLoading(true);
        try {
            // Load profile
            const profileResult = await getProfile(currentUser.id);
            if (profileResult.success) {
                const prof = profileResult.data;
                setProfile(prof);

                setFormData({
                    name: prof.name || '',
                    email: prof.email || '',
                    phone: prof.phone || '',
                    department: prof.department || '',
                    graduationYear: prof.graduationYear || '',
                    bio: prof.bio || '',
                    interests: prof.interests?.join(', ') || '',
                    profilePicture: prof.profilePicture || ''
                });

                setPreferences(prof.preferences || preferences);
            }

            // Load stats
            const statsResult = await getUserStats(currentUser.id);
            if (statsResult.success) {
                setStats(statsResult.data);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            showToast('Failed to load profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePreferenceChange = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (formData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be in format: XXX-XXX-XXXX';
        }

        if (formData.profilePicture && !formData.profilePicture.startsWith('http')) {
            newErrors.profilePicture = 'Profile picture must be a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) {
            showToast('Please fix the errors', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                ...formData,
                interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
                graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null
            };

            const result = await updateProfile(currentUser.id, updateData);

            if (result.success) {
                setProfile(result.data);
                setIsEditing(false);
                showToast('Profile updated successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Update error:', error);
            showToast('Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePreferences = async () => {
        setIsSaving(true);
        try {
            const result = await updatePreferences(currentUser.id, preferences);

            if (result.success) {
                showToast('Preferences updated successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to update preferences', 'error');
            }
        } catch (error) {
            console.error('Update error:', error);
            showToast('Failed to update preferences', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                department: profile.department || '',
                graduationYear: profile.graduationYear || '',
                bio: profile.bio || '',
                interests: profile.interests?.join(', ') || '',
                profilePicture: profile.profilePicture || ''
            });
        }
        setIsEditing(false);
        setErrors({});
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-umd-red"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600">Profile not found</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <img
                                src={formData.profilePicture || profile.profilePicture}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 bg-umd-red text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition">
                                    <Camera className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-600">{profile.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${profile.role === 'student' ? 'bg-blue-100 text-blue-800' :
                                        profile.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && activeTab === 'profile' && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-umd-red text-white rounded-lg hover:bg-red-700 transition"
                            >
                                <Edit2 className="w-5 h-5" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'profile'
                                    ? 'border-umd-red text-umd-red'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'preferences'
                                    ? 'border-umd-red text-umd-red'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Preferences
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'stats'
                                    ? 'border-umd-red text-umd-red'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Activity
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                            } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="XXX-XXX-XXXX"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                            } ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Department/Major
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Graduation Year */}
                            {profile.role === 'student' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Graduation Year
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            min="2024"
                                            max="2030"
                                            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                                }`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Interests (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                        }`}
                                    placeholder="e.g., Technology, Sports, Music"
                                />
                            </div>

                            {/* Profile Picture URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Profile Picture URL
                                </label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="url"
                                        name="profilePicture"
                                        value={formData.profilePicture}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-umd-red focus:border-transparent ${!isEditing ? 'bg-gray-50' : ''
                                            } ${errors.profilePicture ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="https://example.com/picture.jpg"
                                    />
                                </div>
                                {errors.profilePicture && (
                                    <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
                                )}
                            </div>

                            {/* Actions */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="flex-1 bg-umd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                                Notification Preferences
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-semibold text-gray-900">Email Notifications</p>
                                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={() => handlePreferenceChange('emailNotifications')}
                                        className="w-5 h-5 text-umd-red border-gray-300 rounded focus:ring-umd-red"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-semibold text-gray-900">SMS Notifications</p>
                                        <p className="text-sm text-gray-600">Receive notifications via text message</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.smsNotifications}
                                        onChange={() => handlePreferenceChange('smsNotifications')}
                                        className="w-5 h-5 text-umd-red border-gray-300 rounded focus:ring-umd-red"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-semibold text-gray-900">Event Reminders</p>
                                        <p className="text-sm text-gray-600">Get reminded 24 hours before events</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.eventReminders}
                                        onChange={() => handlePreferenceChange('eventReminders')}
                                        className="w-5 h-5 text-umd-red border-gray-300 rounded focus:ring-umd-red"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-semibold text-gray-900">Weekly Digest</p>
                                        <p className="text-sm text-gray-600">Receive a weekly summary of upcoming events</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.weeklyDigest}
                                        onChange={() => handlePreferenceChange('weeklyDigest')}
                                        className="w-5 h-5 text-umd-red border-gray-300 rounded focus:ring-umd-red"
                                    />
                                </label>
                            </div>

                            <button
                                onClick={handleSavePreferences}
                                disabled={isSaving}
                                className="w-full bg-umd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {isSaving ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && stats && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6">
                                    Your Activity
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-8 h-8 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Events Attended</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats.eventsAttended}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-6">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-8 h-8 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Upcoming Events</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {profile.role === 'organizer' && (
                                        <div className="bg-purple-50 rounded-lg p-6">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-8 h-8 text-purple-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Events Created</p>
                                                    <p className="text-3xl font-bold text-gray-900">{stats.eventsCreated}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="font-bold text-gray-900 mb-4">Member Since</h3>
                                <p className="text-gray-600">
                                    {new Date(profile.joinedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;