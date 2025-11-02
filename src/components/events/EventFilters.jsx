import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { getCategories } from '@services/eventService';

const EventFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [categories, setCategories] = useState([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const result = await getCategories();
        if (result.success) {
            setCategories(result.categories);
        }
    };

    const handleInputChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const hasActiveFilters = () => {
        return filters.search ||
            filters.category !== 'all' ||
            filters.startDate ||
            filters.endDate ||
            filters.availableOnly;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events by title, description, or tags..."
                    value={filters.search || ''}
                    onChange={(e) => handleInputChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        value={filters.category || 'all'}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.slug}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        value={filters.sortBy || 'date'}
                        onChange={(e) => handleInputChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    >
                        <option value="date">Date</option>
                        <option value="title">Title (A-Z)</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>

                {/* Available Only */}
                <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.availableOnly || false}
                            onChange={(e) => handleInputChange('availableOnly', e.target.checked)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Show only available events</span>
                    </label>
                </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 font-medium mb-3"
            >
                <Filter className="w-4 h-4" />
                <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Organizer Search */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Organizer
                        </label>
                        <input
                            type="text"
                            placeholder="Filter by organizer name..."
                            value={filters.organizer || ''}
                            onChange={(e) => handleInputChange('organizer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters() && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClearFilters}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <X className="w-4 h-4" />
                        <span>Clear all filters</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventFilters;