import React, { useState, useEffect } from 'react';
import { Tag, MapPin, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import Header from '@components/layout/Header';
import Navigation from '@components/layout/Navigation';
import CategoryVenueManager from '@components/admin/CategoryVenueManager';
import LoadingSpinner from '@components/common/LoadingSpinner';
import {
    fetchCategories,
    fetchVenues,
    createCategory,
    updateCategory,
    retireCategory,
    createVenue,
    updateVenue,
    retireVenue
} from '@services/adminService';

const ManagementPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [catResult, venResult] = await Promise.all([
            fetchCategories(),
            fetchVenues()
        ]);
        if (catResult.success) setCategories(catResult.categories);
        if (venResult.success) setVenues(venResult.venues);
        setLoading(false);
    };

    // Category handlers
    const handleAddCategory = async (data) => {
        setActionLoading(true);
        const result = await createCategory(data, user);
        if (result.success) {
            alert('Category added successfully!');
            loadData();
        } else {
            alert(result.error || 'Failed to add category');
        }
        setActionLoading(false);
    };

    const handleUpdateCategory = async (id, data) => {
        setActionLoading(true);
        const result = await updateCategory(id, data, user);
        if (result.success) {
            alert('Category updated successfully!');
            loadData();
        } else {
            alert(result.error || 'Failed to update category');
        }
        setActionLoading(false);
    };

    const handleRetireCategory = async (id) => {
        setActionLoading(true);
        const result = await retireCategory(id, user);
        if (result.success) {
            loadData();
        } else {
            alert(result.error || 'Failed to update category status');
        }
        setActionLoading(false);
    };

    // Venue handlers
    const handleAddVenue = async (data) => {
        setActionLoading(true);
        const result = await createVenue(data, user);
        if (result.success) {
            alert('Venue added successfully!');
            loadData();
        } else {
            alert(result.error || 'Failed to add venue');
        }
        setActionLoading(false);
    };

    const handleUpdateVenue = async (id, data) => {
        setActionLoading(true);
        const result = await updateVenue(id, data, user);
        if (result.success) {
            alert('Venue updated successfully!');
            loadData();
        } else {
            alert(result.error || 'Failed to update venue');
        }
        setActionLoading(false);
    };

    const handleRetireVenue = async (id) => {
        setActionLoading(true);
        const result = await retireVenue(id, user);
        if (result.success) {
            loadData();
        } else {
            alert(result.error || 'Failed to update venue status');
        }
        setActionLoading(false);
    };

    if (loading) {
        return <LoadingSpinner message="Loading management data..." />;
    }

    const activeCategories = categories.filter(c => c.isActive !== false).length;
    const activeVenues = venues.filter(v => v.isActive !== false).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Management</h1>
                        <p className="text-gray-600 mt-1">Manage categories, venues, and view analytics</p>
                    </div>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <BarChart2 className="w-4 h-4" />
                        <span>View Analytics</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Categories</p>
                                <p className="text-2xl font-bold text-purple-600">{activeCategories}</p>
                                <p className="text-xs text-gray-500">{categories.length} total</p>
                            </div>
                            <Tag className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Venues</p>
                                <p className="text-2xl font-bold text-teal-600">{activeVenues}</p>
                                <p className="text-xs text-gray-500">{venues.length} total</p>
                            </div>
                            <MapPin className="w-8 h-8 text-teal-500" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'categories'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Tag className="w-4 h-4" />
                            <span>Categories ({categories.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('venues')}
                            className={`pb-3 border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'venues'
                                    ? 'border-red-600 text-red-600 font-semibold'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <MapPin className="w-4 h-4" />
                            <span>Venues ({venues.length})</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'categories' && (
                    <CategoryVenueManager
                        type="category"
                        items={categories}
                        onAdd={handleAddCategory}
                        onUpdate={handleUpdateCategory}
                        onRetire={handleRetireCategory}
                        loading={actionLoading}
                    />
                )}

                {activeTab === 'venues' && (
                    <CategoryVenueManager
                        type="venue"
                        items={venues}
                        onAdd={handleAddVenue}
                        onUpdate={handleUpdateVenue}
                        onRetire={handleRetireVenue}
                        loading={actionLoading}
                    />
                )}

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Reference Data Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Categories and venues are used by organizers when creating events</li>
                        <li>• Retired items won't appear in event creation forms but existing events keep their data</li>
                        <li>• All changes are logged in the audit trail for compliance</li>
                        <li>• Venue capacity helps organizers plan appropriate event sizes</li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default ManagementPage;