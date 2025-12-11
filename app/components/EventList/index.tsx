"use client";

import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { FaTrash, FaPlusCircle, FaMinusCircle, FaCalendar } from 'react-icons/fa';
import { formatToCurrency } from '@/app/utils/formatCurrency';

export function EventList() {
  const { simulation, removeEvent } = useFinancialDashboard();
  const events = [...simulation.events].sort((a, b) => b.created_at.localeCompare(a.created_at));

  if(events.length === 0) return (<div className="text-gray-500 text-center mt-6 mb-6">Nenhum evento cadastrado.</div>);

  return (
    <section className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Eventos Cadastrados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map(event => (
          <div key={event.id} className={`rounded-lg p-4 shadow flex flex-col gap-2 border-l-4 ${event.type === 'renda' ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
            <div className="flex items-center gap-2 text-lg font-bold">
              {event.type === 'renda' ? <FaPlusCircle className="w-5 h-5 text-green-500" /> : <FaMinusCircle className="w-5 h-5 text-red-500" />}
              <span>{event.description}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCalendar className="w-4 h-4" />
              {event.frequency === 'unica'
                ? <>Ano: <b>{event.year}</b></>
                : (
                    <>
                      Anos: <b>{event.start_year} - {event.end_year}</b>
                    </>
                  )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">Valor: {formatToCurrency(event.value)}</span>
            </div>
            <button
              type="button"
              onClick={() => removeEvent(event.id)}
              className="mt-2 py-1 px-3 bg-red-200 hover:bg-red-400 text-red-900 rounded transition-colors text-xs flex items-center gap-1 self-end"
              title="Remover evento"
            >
              <FaTrash className="w-4 h-4" /> Remover
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
