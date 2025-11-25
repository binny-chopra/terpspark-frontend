import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventFilters from '@components/events/EventFilters';
import * as eventService from '@services/eventService';

vi.mock('@services/eventService');

describe('EventFilters', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearFilters = vi.fn();

  const defaultFilters = {
    search: '',
    category: 'all',
    sortBy: 'date',
    availableOnly: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    eventService.getCategories.mockResolvedValue({
      success: true,
      categories: [
        { id: 1, name: 'Academic', slug: 'academic' },
        { id: 2, name: 'Sports', slug: 'sports' }
      ]
    });
  });

  it('renders search input', () => {
    render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByPlaceholderText(/search events/i)).toBeInTheDocument();
  });

  it('calls onFilterChange when search input changes', async () => {
    const user = userEvent.setup();
    render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search events/i);
    await user.type(searchInput, 'test search');

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('loads and displays categories', async () => {
    const { container } = render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await waitFor(() => {
      expect(eventService.getCategories).toHaveBeenCalled();
    });

    // Wait for categories to load and select to be available
    await waitFor(() => {
      const categorySelect = container.querySelector('select');
      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect).toHaveValue('all');
    });
  });

  it('calls onFilterChange when category is selected', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await waitFor(() => {
      expect(eventService.getCategories).toHaveBeenCalled();
    });

    // Wait for select to be available
    await waitFor(() => {
      const categorySelect = container.querySelector('select');
      expect(categorySelect).toBeInTheDocument();
    });

    const categorySelect = container.querySelector('select');
    await user.selectOptions(categorySelect, 'academic');

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('toggles advanced filters', async () => {
    const user = userEvent.setup();
    render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const toggleButton = screen.getByText(/show advanced filters/i);
    await user.click(toggleButton);

    expect(screen.getByText(/hide advanced filters/i)).toBeInTheDocument();
  });

  it('shows clear filters button when filters are active', () => {
    const activeFilters = {
      ...defaultFilters,
      search: 'test',
      category: 'academic'
    };

    render(
      <EventFilters
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText(/clear all filters/i)).toBeInTheDocument();
  });

  it('calls onClearFilters when clear button is clicked', async () => {
    const user = userEvent.setup();
    const activeFilters = {
      ...defaultFilters,
      search: 'test'
    };

    render(
      <EventFilters
        filters={activeFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const clearButton = screen.getByText(/clear all filters/i);
    await user.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('toggles availableOnly checkbox', async () => {
    const user = userEvent.setup();
    render(
      <EventFilters
        filters={defaultFilters}
        onFilterChange={mockOnFilterChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const checkbox = screen.getByLabelText(/show only available events/i);
    await user.click(checkbox);

    expect(mockOnFilterChange).toHaveBeenCalled();
  });
});
