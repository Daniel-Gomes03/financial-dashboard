import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventList } from '../index';
import { SimulationDataType, FinancialEventType } from '@/app/types';

jest.mock('@/app/context/FinancialDashboardProvider', () => ({
  useFinancialDashboard: jest.fn(),
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

import { useFinancialDashboard } from '@/app/context/FinancialDashboardProvider';

const mockRemoveEvent = jest.fn();

const mockSimulation: SimulationDataType['simulation'] = {
  uuid: 'test-uuid',
  active_income_members: [],
  events: [],
};

const renderEventList = (events: FinancialEventType[] = []) => {
  const simulation = {
    ...mockSimulation,
    events,
  };

  (useFinancialDashboard as jest.Mock).mockReturnValue({
    simulation,
    projection: {} as SimulationDataType['projection'],
    addEvent: jest.fn(),
    removeEvent: mockRemoveEvent,
  });

  return render(<EventList />);
};

describe('EventList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty message when there are no events', () => {
    renderEventList();
    expect(screen.getByText('Nenhum evento cadastrado.')).toBeInTheDocument();
  });

  it('should render section title when there are events', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única de R$ 1.000,00',
      },
    ];
    renderEventList(events);
    expect(screen.getByText('Eventos Cadastrados')).toBeInTheDocument();
  });

  it('should render event description', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única de R$ 1.000,00',
      },
    ];
    renderEventList(events);
    expect(screen.getByText('Renda única de R$ 1.000,00')).toBeInTheDocument();
  });

  it('should render renda event with green styling', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    const { container } = renderEventList(events);
    const eventCard = container.querySelector('.border-primary-500.bg-primary-50');
    expect(eventCard).toBeInTheDocument();
  });

  it('should render despesa event with red styling', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'despesa',
        frequency: 'unica',
        year: 2024,
        value: 500,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Despesa única',
      },
    ];
    const { container } = renderEventList(events);
    const eventCard = container.querySelector('.border-red-400.bg-red-50');
    expect(eventCard).toBeInTheDocument();
  });

  it('should display year for "unica" frequency events', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    renderEventList(events);
    expect(screen.getByText(/Ano:/)).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should display start_year and end_year for "mensal" frequency events', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'mensal',
        start_year: 2024,
        end_year: 2026,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda mensal',
      },
    ];
    renderEventList(events);
    expect(screen.getByText(/Anos:/)).toBeInTheDocument();
    expect(screen.getByText('2024 - 2026')).toBeInTheDocument();
  });

  it('should display formatted currency value', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1234.56,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    renderEventList(events);
    expect(screen.getByText(/Valor:/)).toBeInTheDocument();
    expect(screen.getByText(/1.234,56/)).toBeInTheDocument();
  });

  it('should render remove button for each event', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    renderEventList(events);
    const removeButton = screen.getByRole('button', { name: /remover/i });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveAttribute('title', 'Remover evento');
  });

  it('should call removeEvent when remove button is clicked', async () => {
    const user = userEvent.setup();
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    renderEventList(events);
    const removeButton = screen.getByRole('button', { name: /remover/i });
    await user.click(removeButton);
    expect(mockRemoveEvent).toHaveBeenCalledWith('1');
  });

  it('should sort events by created_at descending (newest first)', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Evento antigo',
      },
      {
        id: '2',
        type: 'despesa',
        frequency: 'unica',
        year: 2024,
        value: 500,
        created_at: '2024-01-02T00:00:00Z',
        description: 'Evento novo',
      },
    ];
    renderEventList(events);
    
    const allTexts = screen.getAllByText(/Evento (novo|antigo)/);
    
    expect(allTexts[0]).toHaveTextContent('Evento novo');
    expect(allTexts[1]).toHaveTextContent('Evento antigo');
  });

  it('should render multiple events correctly', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
      {
        id: '2',
        type: 'despesa',
        frequency: 'mensal',
        start_year: 2024,
        end_year: 2026,
        value: 500,
        created_at: '2024-01-02T00:00:00Z',
        description: 'Despesa mensal',
      },
    ];
    renderEventList(events);
    expect(screen.getByText('Renda única')).toBeInTheDocument();
    expect(screen.getByText('Despesa mensal')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /remover/i })).toHaveLength(2);
  });

  it('should apply correct CSS classes to section', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    const { container } = renderEventList(events);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white', 'p-4', 'rounded-lg', 'shadow', 'mb-6');
  });

  it('should render grid layout for events', () => {
    const events: FinancialEventType[] = [
      {
        id: '1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 1000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única',
      },
    ];
    const { container } = renderEventList(events);
    const grid = container.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });
});
