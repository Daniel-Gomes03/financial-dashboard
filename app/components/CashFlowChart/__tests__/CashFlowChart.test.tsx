import { render, screen } from '@testing-library/react';
import { SimulationDataType } from '@/app/types';

jest.mock('recharts', () => ({
  BarChart: ({ children, data }: { children: React.ReactNode; data: unknown }) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: ({ dataKey }: { dataKey: string }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: ({ tickFormatter, width }: { tickFormatter?: (...args: unknown[]) => unknown; width?: number }) => <div data-testid="y-axis" data-width={width} data-has-formatter={!!tickFormatter} />,
  Tooltip: ({ formatter }: { formatter?: (...args: unknown[]) => unknown }) => <div data-testid="tooltip" data-has-formatter={!!formatter} />,
  Legend: () => <div data-testid="legend" />,
  Bar: ({ dataKey, name, fill }: { dataKey: string; name?: string; fill?: string }) => <div data-testid={`bar-${dataKey}`} data-name={name} data-fill={fill} />,
}));

jest.mock('@/app/context/FinancialDashboardProvider', () => ({
  useFinancialDashboard: jest.fn(),
}));

import { CashFlowChart } from '../index';
import { useFinancialDashboard } from '@/app/context/FinancialDashboardProvider';

const mockProjection: SimulationDataType['projection'] = {
  cash_flow: {
    labels: [2024, 2025, 2026],
    datasets: [
      {
        name: 'Renda',
        type: 'line',
        data: [100000, 120000, 150000],
      },
      {
        name: 'Despesas',
        type: 'line',
        data: [80000, 90000, 100000],
      },
    ],
  },
};

const mockSimulation: SimulationDataType['simulation'] = {
  uuid: 'test-uuid',
  active_income_members: [],
  events: [],
};

const renderWithProvider = (projection = mockProjection, simulation = mockSimulation) => {
  (useFinancialDashboard as jest.Mock).mockReturnValue({
    projection,
    simulation,
    addEvent: jest.fn(),
    removeEvent: jest.fn(),
  });

  return render(<CashFlowChart />);
};

describe('CashFlowChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the chart title', () => {
    renderWithProvider();
    expect(screen.getByText('Gráfico de Fluxo de Caixa')).toBeInTheDocument();
  });

  it('should render ResponsiveContainer', () => {
    renderWithProvider();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render BarChart with correct data structure', () => {
    renderWithProvider();
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toBeInTheDocument();
    
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    expect(chartData).toHaveLength(3);
    expect(chartData[0]).toEqual({
      year: 2024,
      renda: 100000,
      despesas: 80000,
    });
  });

  it('should map years correctly to chart data', () => {
    renderWithProvider();
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData[0].year).toBe(2024);
    expect(chartData[1].year).toBe(2025);
    expect(chartData[2].year).toBe(2026);
  });

  it('should map renda data correctly', () => {
    renderWithProvider();
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData[0].renda).toBe(100000);
    expect(chartData[1].renda).toBe(120000);
    expect(chartData[2].renda).toBe(150000);
  });

  it('should map despesas data correctly', () => {
    renderWithProvider();
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData[0].despesas).toBe(80000);
    expect(chartData[1].despesas).toBe(90000);
    expect(chartData[2].despesas).toBe(100000);
  });

  it('should render XAxis with correct dataKey', () => {
    renderWithProvider();
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toBeInTheDocument();
    expect(xAxis.getAttribute('data-key')).toBe('year');
  });

  it('should render YAxis with formatter and width', () => {
    renderWithProvider();
    const yAxis = screen.getByTestId('y-axis');
    expect(yAxis).toBeInTheDocument();
    expect(yAxis.getAttribute('data-width')).toBe('80');
    expect(yAxis.getAttribute('data-has-formatter')).toBe('true');
  });

  it('should render Tooltip with formatter', () => {
    renderWithProvider();
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.getAttribute('data-has-formatter')).toBe('true');
  });

  it('should render Legend', () => {
    renderWithProvider();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should render Despesas Bar with correct props', () => {
    renderWithProvider();
    const despesasBar = screen.getByTestId('bar-despesas');
    expect(despesasBar).toBeInTheDocument();
    expect(despesasBar.getAttribute('data-name')).toBe('Despesas');
    expect(despesasBar.getAttribute('data-fill')).toBe('#f87171');
  });

  it('should render Renda Bar with correct props', () => {
    renderWithProvider();
    const rendaBar = screen.getByTestId('bar-renda');
    expect(rendaBar).toBeInTheDocument();
    expect(rendaBar.getAttribute('data-name')).toBe('Renda');
    expect(rendaBar.getAttribute('data-fill')).toBe('#67b9b5');
  });

  it('should handle missing renda dataset gracefully', () => {
    const projectionWithoutRenda: SimulationDataType['projection'] = {
      cash_flow: {
        labels: [2024, 2025],
        datasets: [
          {
            name: 'Despesas',
            type: 'line',
            data: [80000, 90000],
          },
        ],
      },
    };
    
    renderWithProvider(projectionWithoutRenda);
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData[0].renda).toBe(0);
    expect(chartData[1].renda).toBe(0);
  });

  it('should handle missing despesas dataset gracefully', () => {
    const projectionWithoutDespesas: SimulationDataType['projection'] = {
      cash_flow: {
        labels: [2024, 2025],
        datasets: [
          {
            name: 'Renda',
            type: 'line',
            data: [100000, 120000],
          },
        ],
      },
    };
    
    renderWithProvider(projectionWithoutDespesas);
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData[0].despesas).toBe(0);
    expect(chartData[1].despesas).toBe(0);
  });

  it('should apply correct CSS classes to container', () => {
    const { container } = renderWithProvider();
    const chartContainer = container.querySelector('.w-full.h-\\[400px\\].bg-white.rounded-lg.shadow');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should handle empty labels array', () => {
    const emptyProjection: SimulationDataType['projection'] = {
      cash_flow: {
        labels: [],
        datasets: [
          {
            name: 'Renda',
            type: 'line',
            data: [],
          },
          {
            name: 'Despesas',
            type: 'line',
            data: [],
          },
        ],
      },
    };
    
    renderWithProvider(emptyProjection);
    const barChart = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(barChart.getAttribute('data-chart-data') || '[]');
    
    expect(chartData).toHaveLength(0);
  });
});
