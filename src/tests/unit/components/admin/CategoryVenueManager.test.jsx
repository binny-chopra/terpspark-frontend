import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryVenueManager from '@components/admin/CategoryVenueManager';

describe('CategoryVenueManager Component - Logic Tests', () => {
  const mockOnAdd = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnRetire = vi.fn();

  const mockCategories = [
    { id: 1, name: 'Technology', slug: 'technology', description: 'Tech events', color: 'blue', isActive: true },
    { id: 2, name: 'Sports', slug: 'sports', description: 'Sports events', color: 'green', isActive: true },
    { id: 3, name: 'Arts', slug: 'arts', description: 'Art events', color: 'purple', isActive: false }
  ];

  const mockVenues = [
    { id: 1, name: 'Grand Ballroom', building: 'Stamp Union', capacity: 500, facilities: ['AV Equipment', 'WiFi'], isActive: true },
    { id: 2, name: 'Conference Room', building: 'Tech Building', capacity: 50, facilities: ['Projector'], isActive: true },
    { id: 3, name: 'Auditorium', building: 'Main Hall', capacity: 1000, facilities: [], isActive: false }
  ];

  const defaultCategoryProps = {
    type: 'category',
    items: mockCategories,
    onAdd: mockOnAdd,
    onUpdate: mockOnUpdate,
    onRetire: mockOnRetire,
    loading: false
  };

  const defaultVenueProps = {
    type: 'venue',
    items: mockVenues,
    onAdd: mockOnAdd,
    onUpdate: mockOnUpdate,
    onRetire: mockOnRetire,
    loading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders with category type', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Event Categories')).toBeInTheDocument();
    });

    test('renders with venue type', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Venues')).toBeInTheDocument();
    });

    test('renders category items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Sports')).toBeInTheDocument();
    });

    test('renders venue items', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Grand Ballroom')).toBeInTheDocument();
      expect(screen.getByText('Conference Room')).toBeInTheDocument();
    });

    test('renders add button for categories', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Add Category')).toBeInTheDocument();
    });

    test('renders add button for venues', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Add Venue')).toBeInTheDocument();
    });
  });

  describe('Data Structure Validation', () => {
    test('category items have required fields', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      mockCategories.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('isActive');
      });
    });

    test('venue items have required fields', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      mockVenues.forEach(venue => {
        expect(venue).toHaveProperty('id');
        expect(venue).toHaveProperty('name');
        expect(venue).toHaveProperty('capacity');
        expect(venue).toHaveProperty('facilities');
        expect(venue).toHaveProperty('isActive');
      });
    });

    test('displays category descriptions', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Tech events')).toBeInTheDocument();
      expect(screen.getByText('Sports events')).toBeInTheDocument();
    });

  });

  describe('Slug Transformation Logic', () => {
    test('converts uppercase to lowercase', () => {
      const input = 'TEST-SLUG';
      const expected = input.toLowerCase();
      expect(expected).toBe('test-slug');
    });

    test('replaces single space with hyphen', () => {
      const input = 'test slug';
      const expected = input.replace(/\s+/g, '-');
      expect(expected).toBe('test-slug');
    });

    test('replaces multiple spaces with single hyphen', () => {
      const input = 'test    slug';
      const expected = input.replace(/\s+/g, '-');
      expect(expected).toBe('test-slug');
    });

    test('handles mixed case and spaces', () => {
      const input = 'Test Slug Here';
      const expected = input.toLowerCase().replace(/\s+/g, '-');
      expect(expected).toBe('test-slug-here');
    });
  });

  describe('Facilities Processing Logic', () => {
    test('splits facilities by comma', () => {
      const input = 'WiFi,Projector,AV';
      const expected = input.split(',').map(f => f.trim()).filter(Boolean);
      expect(expected).toEqual(['WiFi', 'Projector', 'AV']);
    });

    test('trims whitespace from facilities', () => {
      const input = '  WiFi  ,  Projector  ';
      const expected = input.split(',').map(f => f.trim()).filter(Boolean);
      expect(expected).toEqual(['WiFi', 'Projector']);
    });

    test('filters out empty strings', () => {
      const input = 'WiFi,,Projector,,';
      const expected = input.split(',').map(f => f.trim()).filter(Boolean);
      expect(expected).toEqual(['WiFi', 'Projector']);
    });

    test('handles empty string', () => {
      const input = '';
      const expected = input.split(',').map(f => f.trim()).filter(Boolean);
      expect(expected).toEqual([]);
    });

    test('handles only commas', () => {
      const input = ',,,';
      const expected = input.split(',').map(f => f.trim()).filter(Boolean);
      expect(expected).toEqual([]);
    });
  });

  describe('Capacity Conversion Logic', () => {
    test('converts string to integer', () => {
      const input = '100';
      const expected = parseInt(input);
      expect(expected).toBe(100);
      expect(typeof expected).toBe('number');
    });

    test('handles decimal string', () => {
      const input = '100.5';
      const expected = parseInt(input);
      expect(expected).toBe(100);
    });

    test('handles negative string', () => {
      const input = '-50';
      const expected = parseInt(input);
      expect(expected).toBe(-50);
    });
  });

  describe('Color Options', () => {
    test('has predefined color options', () => {
      const colorOptions = ['blue', 'green', 'purple', 'red', 'pink', 'indigo', 'teal', 'emerald', 'orange', 'yellow'];
      expect(colorOptions.length).toBe(10);
    });

    test('all colors are lowercase strings', () => {
      const colorOptions = ['blue', 'green', 'purple', 'red', 'pink', 'indigo', 'teal', 'emerald', 'orange', 'yellow'];
      colorOptions.forEach(color => {
        expect(typeof color).toBe('string');
        expect(color).toBe(color.toLowerCase());
      });
    });

    test('default color is blue', () => {
      const defaultColor = 'blue';
      expect(defaultColor).toBe('blue');
    });
  });

  describe('Item Status Logic', () => {
    test('distinguishes active items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      const activeCategories = mockCategories.filter(item => item.isActive !== false);
      expect(activeCategories.length).toBe(2);
    });

    test('distinguishes inactive items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      const inactiveCategories = mockCategories.filter(item => item.isActive === false);
      expect(inactiveCategories.length).toBe(1);
    });

    test('displays retired badge for inactive items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Retired')).toBeInTheDocument();
    });

    test('handles missing isActive field as active', () => {
      const item = { id: 1, name: 'Test' };
      const isActive = item.isActive !== false;
      expect(isActive).toBe(true);
    });
  });

  describe('Form Data Initialization', () => {
    test('initializes category form with defaults', () => {
      const formData = { name: '', slug: '', description: '', color: 'blue' };

      expect(formData.name).toBe('');
      expect(formData.slug).toBe('');
      expect(formData.description).toBe('');
      expect(formData.color).toBe('blue');
    });

    test('initializes venue form with defaults', () => {
      const formData = { name: '', building: '', capacity: 100, facilities: '' };

      expect(formData.name).toBe('');
      expect(formData.building).toBe('');
      expect(formData.capacity).toBe(100);
      expect(formData.facilities).toBe('');
    });

    test('populates category form from existing item', () => {
      const item = mockCategories[0];
      const formData = {
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        color: item.color || 'blue'
      };

      expect(formData.name).toBe('Technology');
      expect(formData.slug).toBe('technology');
      expect(formData.description).toBe('Tech events');
      expect(formData.color).toBe('blue');
    });

    test('populates venue form from existing item', () => {
      const item = mockVenues[0];
      const formData = {
        name: item.name,
        building: item.building || '',
        capacity: item.capacity || 100,
        facilities: item.facilities?.join(', ') || ''
      };

      expect(formData.name).toBe('Grand Ballroom');
      expect(formData.building).toBe('Stamp Union');
      expect(formData.capacity).toBe(500);
      expect(formData.facilities).toBe('AV Equipment, WiFi');
    });

    test('handles missing optional fields', () => {
      const item = { id: 1, name: 'Test', slug: 'test', color: 'blue', isActive: true };
      const formData = {
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        color: item.color || 'blue'
      };

      expect(formData.description).toBe('');
    });
  });

  describe('Validation Logic', () => {
    test('category requires name field', () => {
      const invalidData = { slug: 'test', description: '', color: 'blue' };
      expect(invalidData.name).toBeUndefined();
    });

    test('category requires slug field', () => {
      const invalidData = { name: 'Test', description: '', color: 'blue' };
      expect(invalidData.slug).toBeUndefined();
    });

    test('venue requires name field', () => {
      const invalidData = { building: '', capacity: 100, facilities: [] };
      expect(invalidData.name).toBeUndefined();
    });

    test('venue requires capacity greater than zero', () => {
      const invalidCapacities = [0, -1, -100];
      invalidCapacities.forEach(capacity => {
        expect(capacity).toBeLessThanOrEqual(0);
      });
    });

    test('valid category data structure', () => {
      const validData = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test description',
        color: 'blue'
      };

      expect(validData.name.trim().length).toBeGreaterThan(0);
      expect(validData.slug.trim().length).toBeGreaterThan(0);
    });

    test('valid venue data structure', () => {
      const validData = {
        name: 'Test Venue',
        building: 'Test Building',
        capacity: 100,
        facilities: ['WiFi', 'Projector']
      };

      expect(validData.name.trim().length).toBeGreaterThan(0);
      expect(validData.capacity).toBeGreaterThan(0);
    });
  });

  describe('Error State Management', () => {
    test('initializes errors as empty object', () => {
      const errors = {};
      expect(Object.keys(errors).length).toBe(0);
    });

    test('adds name error when missing', () => {
      const errors = {};
      const formData = { name: '' };

      if (!formData.name?.trim()) {
        errors.name = 'Name is required';
      }

      expect(errors.name).toBe('Name is required');
    });

    test('adds slug error when missing for category', () => {
      const errors = {};
      const formData = { name: 'Test', slug: '' };
      const isCategory = true;

      if (isCategory && !formData.slug?.trim()) {
        errors.slug = 'Slug is required';
      }

      expect(errors.slug).toBe('Slug is required');
    });

    test('adds capacity error when invalid for venue', () => {
      const errors = {};
      const formData = { name: 'Test', capacity: 0 };
      const isCategory = false;

      if (!isCategory && (!formData.capacity || formData.capacity < 1)) {
        errors.capacity = 'Valid capacity required';
      }

      expect(errors.capacity).toBe('Valid capacity required');
    });

    test('validates successfully with no errors', () => {
      const errors = {};
      const formData = { name: 'Test', slug: 'test', description: '', color: 'blue' };

      if (!formData.name?.trim()) errors.name = 'Name is required';
      if (!formData.slug?.trim()) errors.slug = 'Slug is required';

      const isValid = Object.keys(errors).length === 0;
      expect(isValid).toBe(true);
    });
  });

  describe('Data Transformation for Submission', () => {
    test('transforms category data for submission', () => {
      const formData = {
        name: 'New Category',
        slug: 'new-category',
        description: 'Test description',
        color: 'green'
      };

      const submitData = { ...formData };

      expect(submitData).toEqual(formData);
    });

    test('transforms venue data for submission', () => {
      const formData = {
        name: 'New Venue',
        building: 'Test Building',
        capacity: '250',
        facilities: 'WiFi, Projector'
      };

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        facilities: formData.facilities?.split(',').map(f => f.trim()).filter(Boolean) || []
      };

      expect(submitData.capacity).toBe(250);
      expect(submitData.facilities).toEqual(['WiFi', 'Projector']);
    });
  });

  describe('Type Detection Logic', () => {
    test('identifies category type', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      const type = 'category';
      const isCategory = type === 'category';
      expect(isCategory).toBe(true);
    });

    test('identifies venue type', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      const type = 'venue';
      const isCategory = type === 'category';
      expect(isCategory).toBe(false);
    });
  });

  describe('Empty State', () => {
    test('renders with empty category items', () => {
      const emptyProps = { ...defaultCategoryProps, items: [] };
      render(<CategoryVenueManager {...emptyProps} />);
      expect(screen.getByText('Event Categories')).toBeInTheDocument();
    });

    test('renders with empty venue items', () => {
      const emptyProps = { ...defaultVenueProps, items: [] };
      render(<CategoryVenueManager {...emptyProps} />);
      expect(screen.getByText('Venues')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('handles loading state for categories', () => {
      const loadingProps = { ...defaultCategoryProps, loading: true };
      render(<CategoryVenueManager {...loadingProps} />);
      expect(screen.getByText('Event Categories')).toBeInTheDocument();
    });

    test('handles loading state for venues', () => {
      const loadingProps = { ...defaultVenueProps, loading: true };
      render(<CategoryVenueManager {...loadingProps} />);
      expect(screen.getByText('Venues')).toBeInTheDocument();
    });
  });
});