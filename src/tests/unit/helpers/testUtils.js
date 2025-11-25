import { vi } from 'vitest';
import { screen } from '@testing-library/react';

/**
 * Shared test utilities for unit tests
 */

/**
 * Flushes all pending timers in fake timer mode
 * Use this when testing async operations with vi.useFakeTimers()
 */
export const flushTimers = async () => {
  await vi.runAllTimersAsync();
};

/**
 * Runs a callback while the system time is frozen
 * Automatically restores real timers afterwards
 * @param {string|Date} systemTime - ISO string or Date to set as current time
 * @param {Function} callback - Function to execute while timers are faked
 */
export const withSystemTime = (systemTime, callback) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(systemTime));
  try {
    return callback();
  } finally {
    vi.useRealTimers();
  }
};

/**
 * Common beforeEach setup for service tests
 * Resets modules, imports the service, and sets up real timers
 * @param {string} servicePath - Path to the service module (e.g., '@services/authService')
 * @returns {Promise<*>} The imported service module
 */
export const setupServiceBeforeEach = async (servicePath) => {
  vi.resetModules();
  const service = await import(servicePath);
  vi.useRealTimers();
  return service;
};

/**
 * Common afterEach cleanup for service tests
 * Resets timers to real mode
 */
export const setupServiceAfterEach = () => {
  vi.useRealTimers();
};

/**
 * Finds an input, textarea, or select element by its label text
 * Useful when labels are not explicitly associated with inputs via htmlFor
 * @param {string} labelText - The text content of the label
 * @returns {HTMLElement|null} The form field element or null if not found
 */
export const getFieldByLabel = (labelText) => {
  const label = screen.getByText(labelText);
  return label.parentElement.querySelector('input, textarea, select');
};

/**
 * Alias for getFieldByLabel for consistency
 * @param {string} labelText - The text content of the label
 * @returns {HTMLElement|null} The form field element or null if not found
 */
export const getInputByLabel = getFieldByLabel;

