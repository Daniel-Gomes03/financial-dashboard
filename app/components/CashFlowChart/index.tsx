'use client';

import { formatYAxisValue, formatToCurrency } from '@/app/utils/formatCurrency';
import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { EVENT_TYPE_LABELS, EventType } from '@/app/constants/form.constants';

const navy100 = 'var(--color-navy-100)';

export function CashFlowChart() {
  const { projection } = useFinancialDashboard();

  const years = projection.cash_flow.labels;
  const renda = projection.cash_flow.datasets.find(dataset => dataset.name === EVENT_TYPE_LABELS[EventType.RENDA]);
  const despesas = projection.cash_flow.datasets.find(dataset => dataset.name === EVENT_TYPE_LABELS[EventType.DESPESAS]);
  const data = years.map((year, index) => ({
    year,
    renda: renda?.data[index] || 0,
    despesas: despesas?.data[index] || 0,
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p align-center items-center justify-center">
      <h1 className='text-lg font-bold text-center mb-3 text-navy-100'>Gráfico de Fluxo de Caixa</h1>
      <ResponsiveContainer width="100%" height="90%" >
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" stroke={navy100} />
          <YAxis 
            tickFormatter={formatYAxisValue} 
            width={80}
            stroke={navy100}
          />
          <Tooltip formatter={(value: number) => formatToCurrency(value)} contentStyle={{ color: `${navy100}`}} />
          <Legend />
          <Bar dataKey="despesas" name="Despesas" fill="#f87171" />
          <Bar dataKey="renda" name="Renda" fill="#67b9b5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}