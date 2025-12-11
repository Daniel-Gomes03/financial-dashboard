"use client";

import { useState } from 'react';
import { FinancialDashboardProvider } from './context/FinancialDashboardProvider';
import { CashFlowChart } from './components/CashFlowChart';
import { MembersPanel } from './components/MembersPanel';
import { EventList } from './components/EventList';
import { AddEventButton } from './components/AddEventButton';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewType } from './types';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <FinancialDashboardProvider>
      <NavigationMenu currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto p-4 pt-20 md:pt-4 flex flex-col gap-6">
        {currentView === 'dashboard' ? (
          <>
            <h1 className="text-2xl font-bold text-center pr-16 md:pr-0">Dashboard de Projeção Financeira</h1>
            <section>
              <CashFlowChart />
            </section>
            <section className="flex flex-col gap-6">
              <div className="flex justify-end">
                <AddEventButton />
              </div>
              <div>
                <EventList />
              </div>
            </section>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center pr-16 md:pr-0">Membros Ativos</h1>
            <section>
              <MembersPanel />
            </section>
          </>
        )}
      </main>
    </FinancialDashboardProvider>
  );
}
