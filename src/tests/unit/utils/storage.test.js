import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearStorage,
  hasStorageItem
} from '@utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should set and get JSON-serialized values', () => {
    const value = { foo: 'bar', count: 3 };
    setStorageItem('test', value);
    expect(localStorage.getItem('test')).toBe(JSON.stringify(value));
    expect(getStorageItem('test')).toEqual(value);
  });

  it('should return null for missing keys and handle parse errors gracefully', () => {
    expect(getStorageItem('missing')).toBeNull();

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('bad', '{invalid json');
    expect(getStorageItem('bad')).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error getting storage item bad:'), expect.any(SyntaxError));
    consoleSpy.mockRestore();
  });

  it('should remove individual keys and report existence', () => {
    setStorageItem('key', 'value');
    expect(hasStorageItem('key')).toBe(true);
    removeStorageItem('key');
    expect(hasStorageItem('key')).toBe(false);
  });

  it('should clear storage safely', () => {
    setStorageItem('a', 1);
    setStorageItem('b', 2);
    clearStorage();
    expect(localStorage.length).toBe(0);
  });

  it('should swallow errors when localStorage operations throw', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => setStorageItem('key', 'value')).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Error setting storage item key:', expect.any(Error));

    setSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

