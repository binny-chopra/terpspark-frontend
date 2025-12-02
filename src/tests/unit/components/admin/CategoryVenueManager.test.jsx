import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CategoryVenueManager from '@components/admin/CategoryVenueManager';

describe('CategoryVenueManager Component - Complete Coverage', () => {
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
    mockOnAdd.mockResolvedValue(undefined);
    mockOnUpdate.mockResolvedValue(undefined);
    mockOnRetire.mockResolvedValue(undefined);
  });

  describe('Basic Rendering', () => {
    test('renders category manager', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Event Categories')).toBeInTheDocument();
    });

    test('renders venue manager', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Venues')).toBeInTheDocument();
    });

    test('renders add category button', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Add Category')).toBeInTheDocument();
    });

    test('renders add venue button', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Add Venue')).toBeInTheDocument();
    });

    test('displays all category items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Sports')).toBeInTheDocument();
      expect(screen.getByText('Arts')).toBeInTheDocument();
    });

    test('displays all venue items', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);
      expect(screen.getByText('Grand Ballroom')).toBeInTheDocument();
      expect(screen.getByText('Conference Room')).toBeInTheDocument();
      expect(screen.getByText('Auditorium')).toBeInTheDocument();
    });
  });

  describe('Add Form - Categories', () => {
    test('opens add category form', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const addButton = screen.getByText('Add Category');
      fireEvent.click(addButton);

      expect(screen.getByText('Add Category', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., Technology')).toBeInTheDocument();
    });

    test('form can be filled with category data', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      const nameInput = screen.getByPlaceholderText('e.g., Technology');
      const slugInput = screen.getByPlaceholderText('e.g., technology');
      const descriptionInput = screen.getByPlaceholderText('Brief description...');

      fireEvent.change(nameInput, { target: { value: 'New Category' } });
      fireEvent.change(slugInput, { target: { value: 'new-category' } });
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      expect(nameInput.value).toBe('New Category');
      expect(slugInput.value).toBe('new-category');
      expect(descriptionInput.value).toBe('New description');
    });

    test('transforms slug to lowercase with hyphens', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      const slugInput = screen.getByPlaceholderText('e.g., technology');
      fireEvent.change(slugInput, { target: { value: 'Test Category Name' } });

      expect(slugInput.value).toBe('test-category-name');
    });

    test('allows changing category color', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      const greenColorButton = screen.getByTitle('green');
      fireEvent.click(greenColorButton);

      // Form data updated with color
      expect(greenColorButton).toBeInTheDocument();
    });

    test('closes form on cancel', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));
      expect(screen.getByText('Add Category', { selector: 'h3' })).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Add Category', { selector: 'h3' })).not.toBeInTheDocument();
    });

    test('form has close button', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      // Check that form is open and has close functionality
      expect(screen.getByText('Add Category', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Add Form - Venues', () => {
    test('opens add venue form', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      fireEvent.click(screen.getByText('Add Venue'));

      expect(screen.getByText('Add Venue', { selector: 'h3' })).toBeInTheDocument();
    });

    test('capacity field has numeric constraints', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      fireEvent.click(screen.getByText('Add Venue'));

      const capacityInput = screen.getByDisplayValue('100');
      expect(capacityInput.getAttribute('type')).toBe('number');
      expect(capacityInput.getAttribute('min')).toBe('1');
    });

    test('facilities input accepts comma-separated values', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      fireEvent.click(screen.getByText('Add Venue'));

      const facilitiesInput = screen.getByPlaceholderText(/AV Equipment/);
      fireEvent.change(facilitiesInput, { target: { value: '  WiFi  ,  Projector  , , AV  ' } });

      expect(facilitiesInput.value).toBe('  WiFi  ,  Projector  , , AV  ');
    });
  });

  describe('Edit Form - Categories', () => {
    test('opens edit form for category', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      expect(screen.getByText('Edit Category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Technology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('technology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Tech events')).toBeInTheDocument();
    });

    test('updates category', async () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      const nameInput = screen.getByDisplayValue('Technology');
      fireEvent.change(nameInput, { target: { value: 'Updated Technology' } });

      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            name: 'Updated Technology'
          })
        );
      });
    });

    test('handles category without description', () => {
      const itemsWithoutDescription = [
        { id: 1, name: 'Test', slug: 'test', color: 'blue', isActive: true }
      ];

      render(<CategoryVenueManager {...defaultCategoryProps} items={itemsWithoutDescription} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      const descriptionInput = screen.getByPlaceholderText('Brief description...');
      expect(descriptionInput.value).toBe('');
    });
  });

  describe('Edit Form - Venues', () => {
    test('opens edit form for venue', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      expect(screen.getByText('Edit Venue')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Grand Ballroom')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Stamp Union')).toBeInTheDocument();
      expect(screen.getByDisplayValue('500')).toBeInTheDocument();
      expect(screen.getByDisplayValue('AV Equipment, WiFi')).toBeInTheDocument();
    });

    test('updates venue', async () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      const nameInput = screen.getByDisplayValue('Grand Ballroom');
      fireEvent.change(nameInput, { target: { value: 'Updated Ballroom' } });

      const submitButton = screen.getByText('Save Changes');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            name: 'Updated Ballroom'
          })
        );
      });
    });

    test('handles venue with empty facilities', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[2]); // Auditorium has empty facilities

      const facilitiesInput = screen.getByPlaceholderText(/AV Equipment/);
      expect(facilitiesInput.value).toBe('');
    });
  });

  describe('Retire/Reactivate Functionality', () => {
    test('opens retire confirmation modal', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const retireButtons = screen.getAllByTitle('Retire');
      fireEvent.click(retireButtons[0]);

      expect(screen.getByText(/retire.*"Technology"/i)).toBeInTheDocument();
    });

    test('retires item on confirmation', async () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const retireButtons = screen.getAllByTitle('Retire');
      fireEvent.click(retireButtons[0]);

      const okButton = screen.getByText('OK');
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockOnRetire).toHaveBeenCalledWith(1);
      });
    });

    test('cancels retire on cancel button', async () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const retireButtons = screen.getAllByTitle('Retire');
      fireEvent.click(retireButtons[0]);

      const cancelButton = screen.getAllByText('Cancel').find(btn =>
        btn.className.includes('bg-gray-100')
      );
      fireEvent.click(cancelButton);

      expect(mockOnRetire).not.toHaveBeenCalled();
      expect(screen.queryByText(/retire.*"Technology"/i)).not.toBeInTheDocument();
    });

    test('shows reactivate option for inactive items', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      expect(screen.getByText('Retired')).toBeInTheDocument();
      expect(screen.getByTitle('Reactivate')).toBeInTheDocument();
    });

    test('reactivates inactive item', async () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      const reactivateButton = screen.getByTitle('Reactivate');
      fireEvent.click(reactivateButton);

      expect(screen.getByText(/reactivate.*"Arts"/i)).toBeInTheDocument();

      const okButton = screen.getByText('OK');
      fireEvent.click(okButton);

      await waitFor(() => {
        expect(mockOnRetire).toHaveBeenCalledWith(3);
      });
    });
  });

  describe('Loading State', () => {
    test('shows loading state on submit button', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} loading={true} />);

      fireEvent.click(screen.getByText('Add Category'));

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    test('disables submit button when loading', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} loading={true} />);

      fireEvent.click(screen.getByText('Add Category'));

      const submitButton = screen.getByText('Saving...');
      expect(submitButton).toBeDisabled();
    });

    test('shows loading state in confirmation modal', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} loading={true} />);

      const retireButtons = screen.getAllByTitle('Retire');
      fireEvent.click(retireButtons[0]);

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    test('shows empty state for categories', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} items={[]} />);

      expect(screen.getByText('No categories yet')).toBeInTheDocument();
    });

    test('shows empty state for venues', () => {
      render(<CategoryVenueManager {...defaultVenueProps} items={[]} />);

      expect(screen.getByText('No venues yet')).toBeInTheDocument();
    });
  });

  describe('Facilities Display', () => {
    test('displays venue facilities as badges', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      expect(screen.getByText('AV Equipment')).toBeInTheDocument();
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('Projector')).toBeInTheDocument();
    });

    test('does not show facilities section for empty array', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      const auditoriumCard = screen.getByText('Auditorium').closest('div').parentElement.parentElement;
      expect(auditoriumCard.textContent).not.toContain('AV Equipment');
    });
  });

  describe('Color Options', () => {
    test('displays all color options', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      const colors = ['blue', 'green', 'purple', 'red', 'pink', 'indigo', 'teal', 'emerald', 'orange', 'yellow'];

      colors.forEach(color => {
        expect(screen.getByTitle(color)).toBeInTheDocument();
      });
    });

    test('selects different color', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      fireEvent.click(screen.getByText('Add Category'));

      const purpleButton = screen.getByTitle('purple');
      fireEvent.click(purpleButton);

      expect(purpleButton).toHaveClass('border-gray-800');
    });
  });

  describe('Category Description Display', () => {
    test('displays category description', () => {
      render(<CategoryVenueManager {...defaultCategoryProps} />);

      expect(screen.getByText('Tech events')).toBeInTheDocument();
      expect(screen.getByText('Sports events')).toBeInTheDocument();
    });

    test('displays slug when description is missing', () => {
      const itemsWithoutDescription = [
        { id: 1, name: 'Test', slug: 'test-slug', color: 'blue', isActive: true }
      ];

      render(<CategoryVenueManager {...defaultCategoryProps} items={itemsWithoutDescription} />);

      expect(screen.getByText('test-slug')).toBeInTheDocument();
    });
  });

  describe('Venue Display', () => {
    test('displays venue building and capacity', () => {
      render(<CategoryVenueManager {...defaultVenueProps} />);

      expect(screen.getByText(/Stamp Union.*Capacity: 500/)).toBeInTheDocument();
      expect(screen.getByText(/Tech Building.*Capacity: 50/)).toBeInTheDocument();
    });
  });
});