import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsChart from '@components/admin/AnalyticsChart';

vi.mock('recharts', () => ({
  BarChart: ({ children, data }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ dataKey, name }) => <div data-testid={`bar-${dataKey}`} data-name={name} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, dataKey, nameKey }) => <div data-testid="pie" data-key={dataKey} data-name-key={nameKey}>{children}</div>,
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
  Legend: () => <div data-testid="legend" />,
}));

describe('AnalyticsChart', () => {
  const barData = [
    { name: 'Jan', events: 10, registrations: 50 },
    { name: 'Feb', events: 15, registrations: 75 },
  ];

  const pieData = [
    { name: 'Career', value: 40 },
    { name: 'Social', value: 30 },
    { name: 'Academic', value: 20 },
  ];

  const categoryBarData = [
    { category: 'Career', registrations: 100, attendance: 80 },
    { category: 'Social', registrations: 75, attendance: 60 },
  ];

  it('renders bar chart with title and data', () => {
    render(<AnalyticsChart type="bar" data={barData} title="Events by Month" />);

    expect(screen.getByText('Events by Month')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-events')).toBeInTheDocument();
    expect(screen.getByTestId('bar-registrations')).toBeInTheDocument();
  });

  it('renders pie chart with title and data', () => {
    render(<AnalyticsChart type="pie" data={pieData} title="Events by Category" />);

    expect(screen.getByText('Events by Category')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders category-bars chart with title and data', () => {
    render(<AnalyticsChart type="category-bars" data={categoryBarData} title="Category Performance" />);

    expect(screen.getByText('Category Performance')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-registrations')).toBeInTheDocument();
    expect(screen.getByTestId('bar-attendance')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders null for unknown chart type', () => {
    const { container } = render(<AnalyticsChart type="unknown" data={barData} title="Test" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders bar chart with correct data keys', () => {
    render(<AnalyticsChart type="bar" data={barData} title="Test Chart" />);

    const eventsBar = screen.getByTestId('bar-events');
    const registrationsBar = screen.getByTestId('bar-registrations');

    expect(eventsBar).toHaveAttribute('data-name', 'Events');
    expect(registrationsBar).toHaveAttribute('data-name', 'Registrations');
  });

  it('renders pie chart with correct data keys', () => {
    render(<AnalyticsChart type="pie" data={pieData} title="Test Chart" />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-key', 'value');
    expect(pie).toHaveAttribute('data-name-key', 'name');
  });

  it('renders category-bars chart with vertical layout', () => {
    render(<AnalyticsChart type="category-bars" data={categoryBarData} title="Test Chart" />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-registrations')).toBeInTheDocument();
    expect(screen.getByTestId('bar-attendance')).toBeInTheDocument();
  });

  it('renders chart components for bar chart', () => {
    render(<AnalyticsChart type="bar" data={barData} title="Test Chart" />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders chart components for pie chart', () => {
    render(<AnalyticsChart type="pie" data={pieData} title="Test Chart" />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});
