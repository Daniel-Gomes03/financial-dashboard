import { render, screen, waitFor, act } from '@testing-library/react';
import { FinancialDashboardProvider, useFinancialDashboard } from '../FinancialDashboardProvider';
import { SimulationDataType, ProjectionType } from '@/app/types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

jest.mock('@/app/utils/formatCurrency', () => ({
  formatToCurrency: jest.fn((value: number) => {
    if (!value || value === 0) return '';
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }),
}));

const mockProjection: ProjectionType = {
  cash_flow: {
    labels: [2024, 2025, 2026, 2027, 2028],
    datasets: [
      {
        name: 'Renda',
        type: 'line',
        data: [100000, 120000, 150000, 180000, 200000],
      },
      {
        name: 'Despesas',
        type: 'line',
        data: [80000, 90000, 100000, 110000, 120000],
      },
    ],
  },
};

const mockSimulation: SimulationDataType['simulation'] = {
  uuid: 'test-uuid',
  active_income_members: [],
  events: [],
};

const mockSimulationData: SimulationDataType = {
  simulation: mockSimulation,
  projection: mockProjection,
};

function TestComponent() {
  const { simulation, projection, addEvent, removeEvent } = useFinancialDashboard();
  return (
    <div>
      <div data-testid="simulation-uuid">{simulation.uuid}</div>
      <div data-testid="events-count">{simulation.events.length}</div>
      <div data-testid="projection-labels">{projection.cash_flow.labels.join(',')}</div>
      <button
        data-testid="add-event-button"
        onClick={() =>
          addEvent({
            type: 'renda',
            frequency: 'unica',
            year: 2024,
            value: 5000,
          })
        }
      >
        Add Event
      </button>
      <button
        data-testid="remove-event-button"
        onClick={() => {
          if (simulation.events.length > 0) {
            removeEvent(simulation.events[0].id);
          }
        }}
      >
        Remove Event
      </button>
    </div>
  );
}

describe('FinancialDashboardProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('should show loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
        })
    );

    render(
      <FinancialDashboardProvider>
        <div>Test</div>
      </FinancialDashboardProvider>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should load initial data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    render(
      <FinancialDashboardProvider>
        <TestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('simulation-uuid')).toHaveTextContent('test-uuid');
    expect(screen.getByTestId('projection-labels')).toHaveTextContent('2024,2025,2026,2027,2028');
  });

  it('should add event correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    render(
      <FinancialDashboardProvider>
        <TestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('0');
    });

    const addButton = screen.getByTestId('add-event-button');
    await act(async () => {
      addButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('1');
    });
  });

  it('should remove event correctly', async () => {
    const simulationWithEvents: SimulationDataType = {
      simulation: {
        ...mockSimulation,
        events: [
          {
            id: 'event-1',
            type: 'renda',
            frequency: 'unica',
            year: 2024,
            value: 5000,
            created_at: '2024-01-01T00:00:00Z',
            description: 'Renda única de R$ 5.000,00',
          },
        ],
      },
      projection: mockProjection,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => simulationWithEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSimulationData,
      });

    render(
      <FinancialDashboardProvider>
        <TestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('1');
    });

    const removeButton = screen.getByTestId('remove-event-button');
    await act(async () => {
      removeButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('0');
    });
  });

  it('should throw error when useFinancialDashboard is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFinancialDashboard must be used within FinancialDashboardProvider');

    consoleError.mockRestore();
  });

  it('should process unique event correctly on projection', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    render(
      <FinancialDashboardProvider>
        <TestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('add-event-button')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('add-event-button');
    await act(async () => {
      addButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('events-count')).toHaveTextContent('1');
    });
  });

  it('should process monthly event correctly on projection', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    function MonthlyEventTestComponent() {
      const { addEvent } = useFinancialDashboard();
      return (
        <button
          data-testid="add-monthly-event"
          onClick={() =>
            addEvent({
              type: 'renda',
              frequency: 'mensal',
              start_year: 2024,
              end_year: 2026,
              value: 1000,
            })
          }
        >
          Add Monthly Event
        </button>
      );
    }

    render(
      <FinancialDashboardProvider>
        <MonthlyEventTestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('add-monthly-event')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('add-monthly-event');
    await act(async () => {
      addButton.click();
    });
  });

  it('should create event with correct description for renda unica', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    function DescriptionTestComponent() {
      const { simulation, addEvent } = useFinancialDashboard();
      return (
        <div>
          <button
            data-testid="add-renda-unica"
            onClick={() =>
              addEvent({
                type: 'renda',
                frequency: 'unica',
                year: 2024,
                value: 5000,
              })
            }
          >
            Add
          </button>
          {simulation.events.length > 0 && (
            <div data-testid="event-description">{simulation.events[0].description}</div>
          )}
        </div>
      );
    }

    render(
      <FinancialDashboardProvider>
        <DescriptionTestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('add-renda-unica')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('add-renda-unica');
    await act(async () => {
      addButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('event-description')).toHaveTextContent(/Renda única/);
    });
  });

  it('should create event with correct description for despesa mensal', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimulationData,
    });

    function DescriptionTestComponent() {
      const { simulation, addEvent } = useFinancialDashboard();
      return (
        <div>
          <button
            data-testid="add-despesa-mensal"
            onClick={() =>
              addEvent({
                type: 'despesa',
                frequency: 'mensal',
                start_year: 2024,
                end_year: 2026,
                value: 3000,
              })
            }
          >
            Add
          </button>
          {simulation.events.length > 0 && (
            <div data-testid="event-description">{simulation.events[0].description}</div>
          )}
        </div>
      );
    }

    render(
      <FinancialDashboardProvider>
        <DescriptionTestComponent />
      </FinancialDashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('add-despesa-mensal')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('add-despesa-mensal');
    await act(async () => {
      addButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('event-description')).toHaveTextContent(/Despesa mensal/);
    });
  });
});
