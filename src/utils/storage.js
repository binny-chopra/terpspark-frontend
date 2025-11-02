/**
 * Storage utility functions for localStorage operations
 * Provides type-safe storage with JSON serialization
 */

/**
 * Set an item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setStorageItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
};

/**
 * Get an item from localStorage
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed value or null if not found
 */
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export const hasStorageItem = (key) => {
  return localStorage.getItem(key) !== null;
};