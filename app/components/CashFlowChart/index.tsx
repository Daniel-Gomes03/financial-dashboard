'use client';

import { formatYAxisValue, formatToCurrency } from '@/app/utils/formatCurrency';
import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

export function CashFlowChart() {
  const { projection } = useFinancialDashboard();

  const years = projection.cash_flow.labels;
  const renda = projection.cash_flow.datasets.find(ds => ds.name === 'Renda');
  const despesas = projection.cash_flow.datasets.find(ds => ds.name === 'Despesas');
  const data = years.map((year, idx) => ({
    year,
    renda: renda?.data[idx] || 0,
    despesas: despesas?.data[idx] || 0,
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow p align-center items-center justify-center">
      <h1 className='text-lg font-bold text-center mb-3'>Gráfico de Fluxo de Caixa</h1>
      <ResponsiveContainer width="100%" height="90%" >
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            tickFormatter={formatYAxisValue} 
            width={80}
          />
          <Tooltip formatter={(value: number) => formatToCurrency(value)} />
          <Legend />
          <Bar dataKey="despesas" name="Despesas" fill="#f87171" />
          <Bar dataKey="renda" name="Renda" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}