import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import CategoryVenueManager from '@components/admin/CategoryVenueManager';

describe('CategoryVenueManager', () => {
  const mockOnAdd = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnRetire = vi.fn();

  const categories = [
    { id: '1', name: 'Career', slug: 'career', description: 'Career events', color: 'blue', isActive: true },
    { id: '2', name: 'Social', slug: 'social', description: 'Social events', color: 'green', isActive: false },
  ];

  const venues = [
    { id: '1', name: 'Stamp Student Union', building: 'Grand Ballroom', capacity: 500, facilities: ['WiFi', 'AV'], isActive: true },
    { id: '2', name: 'McKeldin Library', building: 'Room 123', capacity: 100, facilities: [], isActive: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true);
  });

  describe('Category Management', () => {
    it('renders category list with title and add button', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('Event Categories')).toBeInTheDocument();
      expect(screen.getByText('Add Category')).toBeInTheDocument();
    });

    it('displays categories with correct information', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('Career')).toBeInTheDocument();
      expect(screen.getByText('Social')).toBeInTheDocument();
      expect(screen.getByText('Career events')).toBeInTheDocument();
    });

    it('shows retired badge for inactive categories', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('Retired')).toBeInTheDocument();
    });

    it('opens add form when add button is clicked', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(addButtons[0]);

      expect(screen.getAllByText(/Add Category/i).length).toBeGreaterThan(1);
      expect(screen.getByPlaceholderText('e.g., Technology')).toBeInTheDocument();
    });

    it('opens edit form when edit button is clicked', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      expect(screen.getByText('Edit Category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Career')).toBeInTheDocument();
    });

    it('validates required fields when submitting category', async () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g., Technology')).toBeInTheDocument();
      });

      const submitButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(submitButtons[submitButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('submits new category when form is valid', async () => {
      mockOnAdd.mockResolvedValue({ success: true });

      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g., Technology')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('e.g., Technology');
      const slugInput = screen.getByPlaceholderText('e.g., technology');

      fireEvent.change(nameInput, { target: { value: 'Technology' } });
      fireEvent.change(slugInput, { target: { value: 'technology' } });

      const submitButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(submitButtons[submitButtons.length - 1]);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({
          name: 'Technology',
          slug: 'technology',
          description: '',
          color: 'blue'
        });
      });
    });

    it('updates category when edit form is submitted', async () => {
      mockOnUpdate.mockResolvedValue({ success: true });

      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const editButtons = screen.getAllByTitle('Edit');
      fireEvent.click(editButtons[0]);

      const nameInput = screen.getByDisplayValue('Career');
      fireEvent.change(nameInput, { target: { value: 'Career Updated' } });

      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
          name: 'Career Updated'
        }));
      });
    });

    it('retires category when retire button is clicked', async () => {
      mockOnRetire.mockResolvedValue({ success: true });

      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const retireButtons = screen.getAllByTitle('Retire');
      fireEvent.click(retireButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(mockOnRetire).toHaveBeenCalledWith('1');
      });
    });

    it('reactivates category when reactivate button is clicked', async () => {
      mockOnRetire.mockResolvedValue({ success: true });

      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const reactivateButtons = screen.getAllByTitle('Reactivate');
      fireEvent.click(reactivateButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(mockOnRetire).toHaveBeenCalledWith('2');
      });
    });

    it('allows selecting color for category', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButton = screen.getByRole('button', { name: /Add Category/i });
      fireEvent.click(addButton);

      const colorButtons = screen.getAllByTitle('green');
      fireEvent.click(colorButtons[0]);

      expect(screen.getByPlaceholderText('e.g., Technology')).toBeInTheDocument();
    });

    it('auto-generates slug from name', () => {
      render(
        <CategoryVenueManager
          type="category"
          items={categories}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Category/i });
      fireEvent.click(addButtons[0]);

      const nameInput = screen.getByPlaceholderText('e.g., Technology');
      const slugInput = screen.getByPlaceholderText('e.g., technology');

      fireEvent.change(slugInput, { target: { value: 'New Category Name' } });

      expect(slugInput.value).toBe('new-category-name');
    });
  });

  describe('Venue Management', () => {
    it('renders venue list with title and add button', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('Venues')).toBeInTheDocument();
      expect(screen.getByText('Add Venue')).toBeInTheDocument();
    });

    it('displays venues with correct information', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('Stamp Student Union')).toBeInTheDocument();
      expect(screen.getByText(/Grand Ballroom.*Capacity: 500/)).toBeInTheDocument();
    });


    it('opens add form for venue when add button is clicked', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      expect(screen.getAllByText(/Add Venue/i).length).toBeGreaterThan(1);
      const nameInputs = screen.getAllByPlaceholderText('e.g., Stamp Student Union');
      expect(nameInputs.length).toBeGreaterThan(0);
    });

    it('validates required fields when submitting venue', async () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        const nameInputs = screen.getAllByPlaceholderText('e.g., Stamp Student Union');
        expect(nameInputs.length).toBeGreaterThan(0);
      });

      const submitButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(submitButtons[submitButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('validates capacity is greater than 0', async () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        const nameInputs = screen.getAllByPlaceholderText('e.g., Stamp Student Union');
        expect(nameInputs.length).toBeGreaterThan(0);
      });

      const nameInputs = screen.getAllByPlaceholderText('e.g., Stamp Student Union');
      const nameInput = nameInputs[nameInputs.length - 1];
      const capacityLabel = screen.getByText('Capacity *');
      const capacityInput = capacityLabel.parentElement.querySelector('input[type="number"]');

      fireEvent.change(nameInput, { target: { value: 'New Venue' } });
      fireEvent.change(capacityInput, { target: { value: '0' } });

      const submitButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(submitButtons[submitButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText('Valid capacity required')).toBeInTheDocument();
      });
    });

    it('submits new venue when form is valid', async () => {
      mockOnAdd.mockResolvedValue({ success: true });

      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        const modals = document.querySelectorAll('.bg-white');
        expect(modals.length).toBeGreaterThan(0);
      });

      const modals = document.querySelectorAll('.bg-white');
      const modal = modals[modals.length - 1];
      const modalContainer = within(modal);

      const nameLabel = modalContainer.getByText('Name *');
      const nameInput = nameLabel.parentElement.querySelector('input[type="text"]');
      const buildingLabel = modalContainer.getByText('Building');
      const buildingInput = buildingLabel.parentElement.querySelector('input');
      const capacityLabel = modalContainer.getByText('Capacity *');
      const capacityInput = capacityLabel.parentElement.querySelector('input[type="number"]');
      const facilitiesInput = modalContainer.getByPlaceholderText(/AV Equipment/i);

      fireEvent.change(nameInput, { target: { value: 'New Venue' } });
      fireEvent.change(buildingInput, { target: { value: 'Building A' } });
      fireEvent.change(capacityInput, { target: { value: '200' } });
      fireEvent.change(facilitiesInput, { target: { value: 'WiFi, AV' } });

      const submitButton = modalContainer.getByRole('button', { name: /Add Venue/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({
          name: 'New Venue',
          building: 'Building A',
          capacity: 200,
          facilities: ['WiFi', 'AV']
        });
      });
    });

    it('closes form when cancel button is clicked', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      const nameInputs = screen.getAllByPlaceholderText('e.g., Stamp Student Union');
      expect(nameInputs.length).toBeGreaterThan(0);

      fireEvent.click(screen.getByText('Cancel'));

      const remainingInputs = screen.queryAllByPlaceholderText('e.g., Stamp Student Union');
      expect(remainingInputs.length).toBe(0);
    });

    it('shows empty state when no venues exist', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={[]}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
        />
      );

      expect(screen.getByText('No venues yet')).toBeInTheDocument();
    });

    it('shows loading state on submit button', () => {
      render(
        <CategoryVenueManager
          type="venue"
          items={venues}
          onAdd={mockOnAdd}
          onUpdate={mockOnUpdate}
          onRetire={mockOnRetire}
          loading={true}
        />
      );

      const addButtons = screen.getAllByRole('button', { name: /Add Venue/i });
      fireEvent.click(addButtons[0]);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });
});
