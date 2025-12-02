import React, { useState } from 'react';
import { Plus, Edit, Archive, RefreshCw, X, Tag, MapPin } from 'lucide-react';

const CategoryVenueManager = ({
    type,
    items,
    onAdd,
    onUpdate,
    onRetire,
    loading
}) => {
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const isCategory = type === 'category';
    const Icon = isCategory ? Tag : MapPin;

    const colorOptions = ['blue', 'green', 'purple', 'red', 'pink', 'indigo', 'teal', 'emerald', 'orange', 'yellow'];

    const resetForm = () => {
        setFormData({});
        setEditingItem(null);
        setShowForm(false);
        setErrors({});
    };

    const openAddForm = () => {
        setEditingItem(null);
        setFormData(isCategory
            ? { name: '', slug: '', description: '', color: 'blue' }
            : { name: '', building: '', capacity: 100, facilities: '' }
        );
        setShowForm(true);
    };

    const openEditForm = (item) => {
        setEditingItem(item);
        setFormData(isCategory
            ? { name: item.name, slug: item.slug, description: item.description || '', color: item.color || 'blue' }
            : { name: item.name, building: item.building || '', capacity: item.capacity || 100, facilities: item.facilities?.join(', ') || '' }
        );
        setShowForm(true);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (isCategory && !formData.slug?.trim()) newErrors.slug = 'Slug is required';
        if (!isCategory && (!formData.capacity || formData.capacity < 1)) newErrors.capacity = 'Valid capacity required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const data = isCategory
            ? { ...formData }
            : { ...formData, capacity: parseInt(formData.capacity), facilities: formData.facilities?.split(',').map(f => f.trim()).filter(Boolean) || [] };

        if (editingItem) {
            await onUpdate(editingItem.id, data);
        } else {
            await onAdd(data);
        }
        resetForm();
    };

    const handleRetire = async (item) => {
        setItemToDelete(item);
        setShowDeleteConfirm(true);
    };

    const confirmRetire = async () => {
        if (itemToDelete) {
            await onRetire(itemToDelete.id);
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const cancelRetire = () => {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
    };

    const getColorClass = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700',
            green: 'bg-green-100 text-green-700',
            purple: 'bg-purple-100 text-purple-700',
            red: 'bg-red-100 text-red-700',
            pink: 'bg-pink-100 text-pink-700',
            indigo: 'bg-indigo-100 text-indigo-700',
            teal: 'bg-teal-100 text-teal-700',
            emerald: 'bg-emerald-100 text-emerald-700',
            orange: 'bg-orange-100 text-orange-700',
            yellow: 'bg-yellow-100 text-yellow-700'
        };
        return colors[color] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    {isCategory ? 'Event Categories' : 'Venues'}
                </h3>
                <button
                    onClick={openAddForm}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add {isCategory ? 'Category' : 'Venue'}</span>
                </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-lg border p-4 ${item.isActive === false ? 'border-gray-300 bg-gray-50' : 'border-gray-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCategory ? getColorClass(item.color) : 'bg-teal-100 text-teal-700'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className={`font-medium ${item.isActive === false ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {item.name}
                                        </h4>
                                        {item.isActive === false && (
                                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Retired</span>
                                        )}
                                    </div>
                                    {isCategory ? (
                                        <p className="text-sm text-gray-500">{item.description || item.slug}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {item.building} • Capacity: {item.capacity}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => openEditForm(item)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleRetire(item)}
                                    className={`p-2 rounded-lg transition-colors ${item.isActive === false ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                    title={item.isActive === false ? 'Reactivate' : 'Retire'}
                                >
                                    {item.isActive === false ? <RefreshCw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {!isCategory && item.facilities?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.facilities.map((f, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No {isCategory ? 'categories' : 'venues'} yet</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingItem ? 'Edit' : 'Add'} {isCategory ? 'Category' : 'Venue'}
                            </h3>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder={isCategory ? 'e.g., Technology' : 'e.g., Stamp Student Union'}
                                />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {isCategory ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                        <input
                                            type="text"
                                            value={formData.slug || ''}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                            placeholder="e.g., technology"
                                        />
                                        {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                            placeholder="Brief description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all ${formData.color === color ? 'border-gray-800 scale-110' : 'border-transparent'} ${getColorClass(color)}`}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                                        <input
                                            type="text"
                                            value={formData.building || ''}
                                            onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                            placeholder="e.g., Stamp Student Union"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                                        <input
                                            type="number"
                                            value={formData.capacity || ''}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        />
                                        {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={formData.facilities || ''}
                                            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                            placeholder="e.g., AV Equipment, WiFi, Wheelchair Accessible"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingItem ? 'Save Changes' : `Add ${isCategory ? 'Category' : 'Venue'}`)}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && itemToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {itemToDelete.isActive !== false ? 'Retire' : 'Reactivate'} {isCategory ? 'Category' : 'Venue'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to {itemToDelete.isActive !== false ? 'retire' : 'reactivate'} "{itemToDelete.name}"?
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={confirmRetire}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'OK'}
                            </button>
                            <button
                                onClick={cancelRetire}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryVenueManager;