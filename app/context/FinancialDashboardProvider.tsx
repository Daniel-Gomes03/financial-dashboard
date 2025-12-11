"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  SimulationDataType,
  FinancialEventType,
  ProjectionType,
  FinancialDashboardContextType,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { formatToCurrency } from "../utils/formatCurrency";

export const FinancialDashboardContext = createContext<FinancialDashboardContextType | undefined>(undefined);

function processEventOnProjection(projection: ProjectionType, event: FinancialEventType): ProjectionType {
  const { type, frequency, value, year, start_year, end_year } = event;
  const newProjection = JSON.parse(JSON.stringify(projection)) as ProjectionType;
  const renda = newProjection.cash_flow.datasets.find((d) => d.name === "Renda");
  const despesas = newProjection.cash_flow.datasets.find((d) => d.name === "Despesas");

  if (frequency === "unica" && typeof year === "number") {
    const idx = newProjection.cash_flow.labels.indexOf(year);
    if (idx !== -1) {
      if (type === "renda") renda && (renda.data[idx] += value);
      if (type === "despesa") despesas && (despesas.data[idx] += value);
    }
  } else if (
    frequency === "mensal" && typeof start_year === "number" && typeof end_year === "number"
  ) {
    for (let year = start_year; year <= end_year; ++year) {
      const idx = newProjection.cash_flow.labels.indexOf(year);
      if (idx !== -1) {
        if (type === "renda") renda && (renda.data[idx] += value * 12);
        if (type === "despesa") despesas && (despesas.data[idx] += value * 12);
      }
    }
  }
  return newProjection;
}

export const FinancialDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [simulation, setSimulation] = useState<SimulationDataType["simulation"] | undefined>();
  const [projection, setProjection] = useState<SimulationDataType["projection"] | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const res = await fetch("/api/simulation-data");
        if (!res.ok) throw new Error("Erro ao carregar dados iniciais");
        const data: SimulationDataType = await res.json();
        setSimulation(data.simulation);
        setProjection(data.projection);
      } catch (e) {
        setSimulation(undefined);
        setProjection(undefined);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const addEvent = React.useCallback((event: Omit<FinancialEventType, "id" | "created_at" | "description">) => {
    const newEvent: FinancialEventType = {
      ...event,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      description: `${event.type === 'renda' ? 'Renda' : 'Despesa'} ${event.frequency === 'unica' ? 'única' : 'mensal'} de R$ ${formatToCurrency(event.value)}`
    };
    setSimulation(prev => prev ? { ...prev, events: [newEvent, ...prev.events] } : prev);
    setProjection(prev => prev ? processEventOnProjection(prev, newEvent) : prev);
  }, []);

  const removeEvent = React.useCallback(async (eventId: string) => {

    setSimulation(prev => prev ? { ...prev, events: prev.events.filter(e => e.id !== eventId) } : prev);

    if (!simulation) return;
    try {
      const res = await fetch("/api/simulation-data");
      if (!res.ok) throw new Error("Erro ao recarregar dados iniciais");
      const data: SimulationDataType = await res.json();
      const eventosRestantes = simulation.events.filter(e => e.id !== eventId);
      let novaProjection = data.projection;
      for (const evento of eventosRestantes) {
        novaProjection = processEventOnProjection(novaProjection, evento);
      }
      setProjection(novaProjection);
    } catch {
    }
  }, [simulation]);

  const value = useMemo(
    () => ({
      simulation: simulation!,
      projection: projection!,
      addEvent,
      removeEvent
    }),
    [simulation, projection, addEvent, removeEvent]
  );

  if (loading || !simulation || !projection) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '200px', gap: '1rem'
      }}>
        <span
          style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #555',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
          }}
        />
        <span>Carregando...</span>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
        </style>
      </div>
    );
  }

  return (
    <FinancialDashboardContext.Provider value={value}>
      {children}
    </FinancialDashboardContext.Provider>
  );
};

export function useFinancialDashboard() {
  const ctx = useContext(FinancialDashboardContext);
  if (!ctx) throw new Error('useFinancialDashboard must be used within FinancialDashboardProvider');
  return ctx;
}
