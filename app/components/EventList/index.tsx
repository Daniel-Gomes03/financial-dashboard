"use client";

import { useFinancialDashboard } from '../../context/FinancialDashboardProvider';
import { FaTrash, FaPlusCircle, FaMinusCircle, FaCalendar } from 'react-icons/fa';
import { BsCash } from "react-icons/bs";
import { formatToCurrency } from '@/app/utils/formatCurrency';
import { EventType, FrequencyType } from '@/app/constants/form.constants';

export function EventList() {
  const { simulation, removeEvent } = useFinancialDashboard();
  const events = [...simulation.events].sort((firstEvent, secondEvent) => secondEvent.created_at.localeCompare(firstEvent.created_at));

  if(events.length === 0) return (<div className="text-gray-500 text-center mt-6 mb-6">Nenhum evento cadastrado.</div>);

  return (
    <section className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-navy-100">Eventos Cadastrados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map(event => (
          <div key={event.id} className={`rounded-lg p-4 shadow flex flex-col gap-2 border-l-4 ${event.type === EventType.RENDA ? 'border-primary-500 bg-primary-50' : 'border-red-400 bg-red-50'}`}>
            <div className="flex items-center gap-2 text-lg font-bold">
              {event.type === EventType.RENDA ? <FaPlusCircle className="w-5 h-5 text-navy-100" /> : <FaMinusCircle className="w-5 h-5 text-red-500" />}
              <span className='text-navy-100'>{event.description}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy-100">
              <FaCalendar className="w-4 h-4 text-navy-100" />
              {event.frequency === FrequencyType.UNICA
                ? <>Ano: <b>{event.year}</b></>
                : (
                    <>
                      Anos: <b>{event.start_year} - {event.end_year}</b>
                    </>
                  )}
            </div>
            <div className="flex items-center gap-2 text-navy-100">
              <BsCash className="w-4 h-4" />
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
