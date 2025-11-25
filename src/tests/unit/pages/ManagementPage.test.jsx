import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManagementPage from '@pages/ManagementPage';
import '../setup/layoutMocks';

const mockNavigate = vi.fn();
const mockFetchCategories = vi.fn();
const mockFetchVenues = vi.fn();
const mockCreateCategory = vi.fn();
const mockUpdateCategory = vi.fn();
const mockRetireCategory = vi.fn();
const mockCreateVenue = vi.fn();
const mockUpdateVenue = vi.fn();
const mockRetireVenue = vi.fn();

vi.mock('@context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'admin-1', name: 'Admin One' } }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/admin/management' }),
}));

vi.mock('@components/common/LoadingSpinner', () => ({
  default: ({ message }) => <div>{message}</div>,
}));

vi.mock('@components/admin/CategoryVenueManager', () => ({
  default: ({ type, items, onAdd, onUpdate, onRetire, loading }) => (
    <div data-testid={`${type}-manager`}>
      <button onClick={() => onAdd({ name: `${type} name` })} disabled={loading}>
        Add {type}
      </button>
      <button onClick={() => onUpdate('item-1', { name: `${type} updated` })} disabled={loading}>
        Update {type}
      </button>
      <button onClick={() => onRetire('item-1')} disabled={loading}>
        Retire {type}
      </button>
      <p>Items: {items.length}</p>
    </div>
  ),
}));

vi.mock('@services/adminService', () => ({
  fetchCategories: (...args) => mockFetchCategories(...args),
  fetchVenues: (...args) => mockFetchVenues(...args),
  createCategory: (...args) => mockCreateCategory(...args),
  updateCategory: (...args) => mockUpdateCategory(...args),
  retireCategory: (...args) => mockRetireCategory(...args),
  createVenue: (...args) => mockCreateVenue(...args),
  updateVenue: (...args) => mockUpdateVenue(...args),
  retireVenue: (...args) => mockRetireVenue(...args),
}));

const categoriesFixture = [
  { id: 'cat-1', name: 'Career', isActive: true },
  { id: 'cat-2', name: 'Social', isActive: false },
];

const venuesFixture = [
  { id: 'venue-1', name: 'Stamp', isActive: true },
  { id: 'venue-2', name: 'Arena', isActive: true },
];

const resolveData = () => {
  mockFetchCategories.mockResolvedValue({ success: true, categories: categoriesFixture });
  mockFetchVenues.mockResolvedValue({ success: true, venues: venuesFixture });
};

describe('ManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveData();
    mockCreateCategory.mockResolvedValue({ success: true });
    mockUpdateCategory.mockResolvedValue({ success: true });
    mockRetireCategory.mockResolvedValue({ success: true });
    mockCreateVenue.mockResolvedValue({ success: true });
    mockUpdateVenue.mockResolvedValue({ success: true });
    mockRetireVenue.mockResolvedValue({ success: true });
    window.alert = vi.fn();
  });

  it('shows loading spinner while data is fetched', () => {
    mockFetchCategories.mockReturnValue(new Promise(() => {}));
    mockFetchVenues.mockReturnValue(new Promise(() => {}));
    render(<ManagementPage />);
    expect(screen.getByText('Loading management data...')).toBeInTheDocument();
  });

  it('renders stats and category manager by default', async () => {
    render(<ManagementPage />);

    await waitFor(() => expect(screen.getByText('Management')).toBeInTheDocument());
    expect(screen.getByText('Active Categories')).toBeInTheDocument();
    expect(screen.getByText('Active Venues')).toBeInTheDocument();
    expect(screen.getByTestId('category-manager')).toBeInTheDocument();
  });

  it('switches to venues tab when button is clicked', async () => {
    render(<ManagementPage />);
    await waitFor(() => expect(screen.getByText('Management')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Venues/ }));
    expect(screen.getByTestId('venue-manager')).toBeInTheDocument();
  });

  it('navigates to analytics when button is clicked', async () => {
    render(<ManagementPage />);
    await waitFor(() => expect(screen.getByText('View Analytics')).toBeInTheDocument());

    fireEvent.click(screen.getByText('View Analytics'));
    expect(mockNavigate).toHaveBeenCalledWith('/analytics');
  });

  it('handles category actions via manager component', async () => {
    render(<ManagementPage />);
    await screen.findByTestId('category-manager');

    fireEvent.click(screen.getByText('Add category'));
    await waitFor(() => expect(mockCreateCategory).toHaveBeenCalledWith({ name: 'category name' }, { id: 'admin-1', name: 'Admin One' }));

    fireEvent.click(screen.getByText('Update category'));
    await waitFor(() =>
      expect(mockUpdateCategory).toHaveBeenCalledWith('item-1', { name: 'category updated' }, { id: 'admin-1', name: 'Admin One' }),
    );

    fireEvent.click(screen.getByText('Retire category'));
    await waitFor(() => expect(mockRetireCategory).toHaveBeenCalledWith('item-1', { id: 'admin-1', name: 'Admin One' }));
  });

  it('handles venue actions via manager component', async () => {
    render(<ManagementPage />);
    await screen.findByTestId('category-manager');

    fireEvent.click(screen.getByRole('button', { name: /Venues/ }));
    await screen.findByTestId('venue-manager');

    fireEvent.click(screen.getByText('Add venue'));
    await waitFor(() => expect(mockCreateVenue).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Update venue'));
    await waitFor(() => expect(mockUpdateVenue).toHaveBeenCalled());

    fireEvent.click(screen.getByText('Retire venue'));
    await waitFor(() => expect(mockRetireVenue).toHaveBeenCalled());
  });
});
