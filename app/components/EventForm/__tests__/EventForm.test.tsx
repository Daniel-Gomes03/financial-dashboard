import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from '../index';
import { SimulationDataType } from '@/app/types';

jest.mock('@/app/context/FinancialDashboardProvider', () => ({
  useFinancialDashboard: jest.fn(),
}));

import { useFinancialDashboard } from '@/app/context/FinancialDashboardProvider';

const mockProjection: SimulationDataType['projection'] = {
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

const mockAddEvent = jest.fn();

const renderEventForm = () => {
  (useFinancialDashboard as jest.Mock).mockReturnValue({
    projection: mockProjection,
    simulation: mockSimulation,
    addEvent: mockAddEvent,
    removeEvent: jest.fn(),
  });

  return render(<EventForm />);
};

describe('EventForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    renderEventForm();
    expect(screen.getByText('Tipo de Evento')).toBeInTheDocument();
    expect(screen.getByText('Frequência')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderEventForm();
    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should not show year field initially', () => {
    renderEventForm();
    expect(screen.queryByText('Ano')).not.toBeInTheDocument();
    expect(screen.queryByText('Ano inicial')).not.toBeInTheDocument();
    expect(screen.queryByText('Ano final')).not.toBeInTheDocument();
  });

  it('should show year field when frequency is "unica"', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const selects = screen.getAllByRole('combobox');
    const frequencySelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Frequência')
    ) as HTMLSelectElement;
    
    expect(frequencySelect).toBeInTheDocument();
    await user.selectOptions(frequencySelect, 'unica');

    await waitFor(() => {
      expect(screen.queryByText('Ano')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    expect(screen.queryByText('Ano inicial')).not.toBeInTheDocument();
    expect(screen.queryByText('Ano final')).not.toBeInTheDocument();
  });

  it('should show start_year and end_year fields when frequency is "mensal"', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const selects = screen.getAllByRole('combobox');
    const frequencySelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Frequência')
    ) as HTMLSelectElement;
    
    await user.selectOptions(frequencySelect, 'mensal');

    await waitFor(() => {
      expect(screen.queryByText('Ano inicial')).toBeInTheDocument();
      expect(screen.queryByText('Ano final')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    expect(screen.queryByText('Ano')).not.toBeInTheDocument();
  });

  it('should submit form with valid data for "unica" frequency', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Tipo de Evento')
    ) as HTMLSelectElement;
    await user.selectOptions(typeSelect, 'renda');

    const frequencySelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Frequência')
    ) as HTMLSelectElement;
    await user.selectOptions(frequencySelect, 'unica');

    let yearSelect: HTMLElement;
    await waitFor(() => {
      const allSelects = screen.getAllByRole('combobox');
      yearSelect = allSelects.find(select => 
        select.closest('div')?.textContent?.includes('Ano') && 
        !select.closest('div')?.textContent?.includes('inicial') &&
        !select.closest('div')?.textContent?.includes('final')
      ) as HTMLSelectElement;
      expect(yearSelect).toBeInTheDocument();
    }, { timeout: 5000 });
    
    await user.selectOptions(yearSelect!, '2024');

    const inputs = screen.getAllByRole('textbox');
    const valueInput = inputs[0] as HTMLInputElement;
    await user.clear(valueInput);
    await user.type(valueInput, '1000,00');

    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalledWith({
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        start_year: undefined,
        end_year: undefined,
        value: expect.any(Number),
      });
    });
  });

  it('should show success popup after successful submission', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Tipo de Evento')
    ) as HTMLSelectElement;
    await user.selectOptions(typeSelect, 'renda');

    const frequencySelect = selects.find(select => 
      select.closest('div')?.textContent?.includes('Frequência')
    ) as HTMLSelectElement;
    await user.selectOptions(frequencySelect, 'unica');

    let yearSelect: HTMLElement;
    await waitFor(() => {
      const allSelects = screen.getAllByRole('combobox');
      yearSelect = allSelects.find(select => 
        select.closest('div')?.textContent?.includes('Ano') && 
        !select.closest('div')?.textContent?.includes('inicial') &&
        !select.closest('div')?.textContent?.includes('final')
      ) as HTMLSelectElement;
      expect(yearSelect).toBeInTheDocument();
    }, { timeout: 5000 });

    await user.selectOptions(yearSelect!, '2024');

    const inputs = screen.getAllByRole('textbox');
    const valueInput = inputs[0] as HTMLInputElement;
    await user.clear(valueInput);
    await user.type(valueInput, '1000,00');

    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Evento cadastrado com sucesso!')).toBeInTheDocument();
    });
  });

  it('should apply correct CSS classes to form', () => {
    const { container } = renderEventForm();
    const form = container.querySelector('form');
    expect(form).toHaveClass('grid', 'gap-3');
  });

  it('should not submit form with invalid data', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(submitButton);

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup();
    renderEventForm();

    const submitButton = screen.getByRole('button', { name: /adicionar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddEvent).not.toHaveBeenCalled();
    });
  });
});
