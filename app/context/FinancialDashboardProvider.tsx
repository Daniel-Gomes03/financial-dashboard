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
import { EVENT_TYPE_LABELS, EventType, FREQUENCY_LABELS, FrequencyType } from "../constants/form.constants";
import { useEventsStore } from "../store/eventsStore";

export const FinancialDashboardContext = createContext<FinancialDashboardContextType | undefined>(undefined);

function findDataset(projection: ProjectionType, name: string) {
  return projection.cash_flow.datasets.find((d) => d.name === name);
}

function getDatasetByType(projection: ProjectionType, type: EventType) {
  const datasetName = type === EventType.RENDA ? "Renda" : "Despesas";
  return findDataset(projection, datasetName);
}

function applyValueToDataset(
  dataset: { data: number[] } | undefined,
  index: number,
  value: number
): void {
  if (dataset && index !== -1) {
    dataset.data[index] += value;
  }
}

function getYearIndex(labels: number[], year: number): number {
  return labels.indexOf(year);
}

function processUniqueEvent(
  projection: ProjectionType,
  type: EventType,
  value: number,
  year: number
): void {
  const dataset = getDatasetByType(projection, type);
  const index = getYearIndex(projection.cash_flow.labels, year);
  applyValueToDataset(dataset, index, value);
}

function processMonthlyEvent(
  projection: ProjectionType,
  type: EventType,
  value: number,
  startYear: number,
  endYear: number
): void {
  const dataset = getDatasetByType(projection, type);
  const monthlyValue = value * 12;
  
  for (let year = startYear; year <= endYear; year++) {
    const index = getYearIndex(projection.cash_flow.labels, year);
    applyValueToDataset(dataset, index, monthlyValue);
  }
}

function processEventOnProjection(projection: ProjectionType, event: FinancialEventType): ProjectionType {
  const { type, frequency, value, year, start_year, end_year } = event;
  const newProjection = JSON.parse(JSON.stringify(projection)) as ProjectionType;

  if (frequency === FrequencyType.UNICA && typeof year === "number") {
    processUniqueEvent(newProjection, type as EventType, value, year);
  } else if (
    frequency === FrequencyType.MENSAL &&
    typeof start_year === "number" &&
    typeof end_year === "number"
  ) {
    processMonthlyEvent(newProjection, type as EventType, value, start_year, end_year);
  }

  return newProjection;
}

export const FinancialDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [simulation, setSimulation] = useState<SimulationDataType["simulation"] | undefined>();
  const [projection, setProjection] = useState<SimulationDataType["projection"] | undefined>();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<SimulationDataType | null>(null);
  const { events: savedEvents, addEvent: addEventToStore, removeEvent: removeEventFromStore } = useEventsStore();

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/api/simulation-data");
        if (!res.ok) throw new Error("Erro ao carregar dados iniciais");
        const data: SimulationDataType = await res.json();
        setInitialData(data);
      } catch {
        setInitialData(null);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!initialData) return;

    const eventsToUse = savedEvents.length > 0 ? savedEvents : initialData.simulation.events;
    
    setSimulation({ ...initialData.simulation, events: eventsToUse });
    
    let updatedProjection = initialData.projection;
    for (const evento of eventsToUse) {
      updatedProjection = processEventOnProjection(updatedProjection, evento);
    }
    setProjection(updatedProjection);
    setLoading(false);
  }, [initialData, savedEvents]);

  const addEvent = React.useCallback((event: Omit<FinancialEventType, "id" | "created_at" | "description">) => {
    const newEvent: FinancialEventType = {
      ...event,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      description: `${EVENT_TYPE_LABELS[event.type as EventType]} ${FREQUENCY_LABELS[event.frequency as FrequencyType]} de R$ ${formatToCurrency(event.value)}`
    };

    addEventToStore(newEvent);

    setSimulation(prev => prev ? { ...prev, events: [newEvent, ...prev.events] } : prev);
    setProjection(prev => prev ? processEventOnProjection(prev, newEvent) : prev);
  }, [addEventToStore]);

  const removeEvent = React.useCallback(async (eventId: string) => {
    removeEventFromStore(eventId);
    
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
  }, [simulation, removeEventFromStore]);

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
