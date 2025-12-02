import { render } from '@testing-library/react';
import { vi } from 'vitest';
import AnalyticsChart from '@components/admin/AnalyticsChart';

// Mock recharts components
vi.mock('recharts', () => ({
  BarChart: vi.fn(({ children }) => <div data-testid="bar-chart">{children}</div>),
  Bar: vi.fn(() => <div data-testid="bar" />),
  XAxis: vi.fn(() => <div data-testid="x-axis" />),
  YAxis: vi.fn(() => <div data-testid="y-axis" />),
  CartesianGrid: vi.fn(() => <div data-testid="cartesian-grid" />),
  Tooltip: vi.fn(() => <div data-testid="tooltip" />),
  ResponsiveContainer: vi.fn(({ children }) => <div data-testid="responsive-container">{children}</div>),
  PieChart: vi.fn(({ children }) => <div data-testid="pie-chart">{children}</div>),
  Pie: vi.fn(() => <div data-testid="pie" />),
  Cell: vi.fn(() => <div data-testid="cell" />),
  Legend: vi.fn(() => <div data-testid="legend" />)
}));

describe('AnalyticsChart Component', () => {
  const mockBarData = [
    { name: 'Jan', events: 10, registrations: 50 },
    { name: 'Feb', events: 15, registrations: 75 },
    { name: 'Mar', events: 12, registrations: 60 }
  ];

  const mockPieData = [
    { name: 'Technology', value: 30 },
    { name: 'Sports', value: 25 },
    { name: 'Arts', value: 20 },
    { name: 'Academic', value: 15 }
  ];

  const mockCategoryData = [
    { category: 'Technology', registrations: 100, attendance: 80 },
    { category: 'Sports', registrations: 80, attendance: 70 },
    { category: 'Arts', registrations: 60, attendance: 55 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering Based on Type', () => {
    test('renders bar chart when type is "bar"', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Monthly Statistics" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('renders pie chart when type is "pie"', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={mockPieData} title="Event Distribution" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('renders category bars when type is "category-bars"', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="category-bars" data={mockCategoryData} title="Category Analysis" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('renders null for unknown chart type', () => {
      const { container } = render(
        <AnalyticsChart type="unknown" data={mockBarData} title="Unknown Chart" />
      );

      expect(container.firstChild).toBeNull();
    });

    test('renders null when type is not provided', () => {
      const { container } = render(
        <AnalyticsChart data={mockBarData} title="No Type Chart" />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Props Handling', () => {
    test('accepts and uses title prop for bar chart', () => {
      const title = 'Monthly Analytics';
      const { getByText } = render(
        <AnalyticsChart type="bar" data={mockBarData} title={title} />
      );

      expect(getByText(title)).toBeInTheDocument();
    });

    test('accepts and uses title prop for pie chart', () => {
      const title = 'Category Distribution';
      const { getByText } = render(
        <AnalyticsChart type="pie" data={mockPieData} title={title} />
      );

      expect(getByText(title)).toBeInTheDocument();
    });

    test('accepts and uses title prop for category bars', () => {
      const title = 'Category Performance';
      const { getByText } = render(
        <AnalyticsChart type="category-bars" data={mockCategoryData} title={title} />
      );

      expect(getByText(title)).toBeInTheDocument();
    });

    test('handles empty data array for bar chart', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={[]} title="Empty Bar Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles empty data array for pie chart', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={[]} title="Empty Pie Chart" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles empty data array for category bars', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="category-bars" data={[]} title="Empty Category Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Data Structure Validation', () => {
    test('renders with valid bar chart data structure', () => {
      const validData = [
        { name: 'Week 1', events: 5, registrations: 25 }
      ];

      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={validData} title="Test Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('renders with valid pie chart data structure', () => {
      const validData = [
        { name: 'Category A', value: 100 }
      ];

      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={validData} title="Test Chart" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('renders with valid category bars data structure', () => {
      const validData = [
        { category: 'Type A', registrations: 50, attendance: 40 }
      ];

      const { getByTestId } = render(
        <AnalyticsChart type="category-bars" data={validData} title="Test Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles multiple data points in bar chart', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Multi-point Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles multiple data points in pie chart', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={mockPieData} title="Multi-point Chart" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles multiple data points in category bars', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="category-bars" data={mockCategoryData} title="Multi-point Chart" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('bar chart contains ResponsiveContainer', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Test" />
      );

      expect(getByTestId('responsive-container')).toBeInTheDocument();
    });

    test('pie chart contains ResponsiveContainer', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={mockPieData} title="Test" />
      );

      expect(getByTestId('responsive-container')).toBeInTheDocument();
    });

    test('category bars contains ResponsiveContainer', () => {
      const { getByTestId } = render(
        <AnalyticsChart type="category-bars" data={mockCategoryData} title="Test" />
      );

      expect(getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Chart Type Switching', () => {
    test('switches from bar to pie chart', () => {
      const { getByTestId, rerender } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="pie" data={mockPieData} title="Test" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('switches from pie to category-bars', () => {
      const { getByTestId, rerender } = render(
        <AnalyticsChart type="pie" data={mockPieData} title="Test" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="category-bars" data={mockCategoryData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('switches to null when type becomes invalid', () => {
      const { getByTestId, rerender, container } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="invalid" data={mockBarData} title="Test" />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Title Updates', () => {
    test('updates title when prop changes', () => {
      const { getByText, rerender } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Original Title" />
      );

      expect(getByText('Original Title')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="bar" data={mockBarData} title="Updated Title" />
      );

      expect(getByText('Updated Title')).toBeInTheDocument();
    });
  });

  describe('Data Updates', () => {
    test('handles data updates for bar chart', () => {
      const initialData = [{ name: 'A', events: 1, registrations: 10 }];
      const updatedData = [{ name: 'B', events: 2, registrations: 20 }];

      const { getByTestId, rerender } = render(
        <AnalyticsChart type="bar" data={initialData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="bar" data={updatedData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles data updates for pie chart', () => {
      const initialData = [{ name: 'A', value: 10 }];
      const updatedData = [{ name: 'B', value: 20 }];

      const { getByTestId, rerender } = render(
        <AnalyticsChart type="pie" data={initialData} title="Test" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="pie" data={updatedData} title="Test" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles data updates for category bars', () => {
      const initialData = [{ category: 'A', registrations: 10, attendance: 5 }];
      const updatedData = [{ category: 'B', registrations: 20, attendance: 15 }];

      const { getByTestId, rerender } = render(
        <AnalyticsChart type="category-bars" data={initialData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();

      rerender(
        <AnalyticsChart type="category-bars" data={updatedData} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles null data gracefully', () => {
      const { container } = render(
        <AnalyticsChart type="bar" data={null} title="Null Data" />
      );

      // Component should render without crashing
      expect(container).toBeInTheDocument();
    });

    test('handles undefined data gracefully', () => {
      const { container } = render(
        <AnalyticsChart type="bar" data={undefined} title="Undefined Data" />
      );

      // Component should render without crashing
      expect(container).toBeInTheDocument();
    });

    test('handles missing title prop', () => {
      const { container } = render(
        <AnalyticsChart type="bar" data={mockBarData} />
      );

      // Component should render without crashing
      expect(container).toBeInTheDocument();
    });

    test('handles data with extra fields for bar chart', () => {
      const dataWithExtra = [
        { name: 'Jan', events: 10, registrations: 50, extraField: 'ignored' }
      ];

      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={dataWithExtra} title="Test" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles data with extra fields for pie chart', () => {
      const dataWithExtra = [
        { name: 'Category', value: 100, extraField: 'ignored' }
      ];

      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={dataWithExtra} title="Test" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });

    test('handles large dataset for bar chart', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        name: `Item ${i}`,
        events: i,
        registrations: i * 5
      }));

      const { getByTestId } = render(
        <AnalyticsChart type="bar" data={largeData} title="Large Dataset" />
      );

      expect(getByTestId('bar-chart')).toBeInTheDocument();
    });

    test('handles large dataset for pie chart', () => {
      const largeData = Array.from({ length: 50 }, (_, i) => ({
        name: `Category ${i}`,
        value: i * 10
      }));

      const { getByTestId } = render(
        <AnalyticsChart type="pie" data={largeData} title="Large Dataset" />
      );

      expect(getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  describe('Type Case Sensitivity', () => {
    test('does not render for uppercase "BAR"', () => {
      const { container } = render(
        <AnalyticsChart type="BAR" data={mockBarData} title="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

    test('does not render for mixed case "Pie"', () => {
      const { container } = render(
        <AnalyticsChart type="Pie" data={mockPieData} title="Test" />
      );

      expect(container.firstChild).toBeNull();
    });

  });

  describe('Component Stability', () => {
    test('does not crash when rapidly switching types', () => {
      const { rerender } = render(
        <AnalyticsChart type="bar" data={mockBarData} title="Test" />
      );

      expect(() => {
        rerender(<AnalyticsChart type="pie" data={mockPieData} title="Test" />);
        rerender(<AnalyticsChart type="category-bars" data={mockCategoryData} title="Test" />);
        rerender(<AnalyticsChart type="bar" data={mockBarData} title="Test" />);
      }).not.toThrow();
    });

    test('handles all props being undefined', () => {
      const { container } = render(<AnalyticsChart />);

      expect(container.firstChild).toBeNull();
    });
  });
});