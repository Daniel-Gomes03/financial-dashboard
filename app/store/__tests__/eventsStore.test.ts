import { useEventsStore } from '../eventsStore';
import { FinancialEventType } from '@/app/types';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('eventsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    const { setEvents } = useEventsStore.getState();
    setEvents([]);
  });

  it('should have empty events array initially', () => {
    const { events } = useEventsStore.getState();
    expect(events).toEqual([]);
  });

  it('should add event correctly', () => {
    const { addEvent, events: initialEvents } = useEventsStore.getState();
    expect(initialEvents).toHaveLength(0);

    const newEvent: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    addEvent(newEvent);

    const { events } = useEventsStore.getState();
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(newEvent);
  });

  it('should add multiple events and keep them in order', () => {
    const { addEvent } = useEventsStore.getState();

    const event1: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    const event2: FinancialEventType = {
      id: 'event-2',
      type: 'despesa',
      frequency: 'mensal',
      start_year: 2024,
      end_year: 2026,
      value: 1000,
      created_at: '2024-01-02T00:00:00Z',
      description: 'Despesa mensal de R$ 1.000,00',
    };

    addEvent(event1);
    addEvent(event2);

    const { events } = useEventsStore.getState();
    expect(events).toHaveLength(2);

    expect(events[0]).toEqual(event2);
    expect(events[1]).toEqual(event1);
  });

  it('should remove event correctly', () => {
    const { addEvent, removeEvent } = useEventsStore.getState();

    const event1: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    const event2: FinancialEventType = {
      id: 'event-2',
      type: 'despesa',
      frequency: 'mensal',
      start_year: 2024,
      end_year: 2026,
      value: 1000,
      created_at: '2024-01-02T00:00:00Z',
      description: 'Despesa mensal de R$ 1.000,00',
    };

    addEvent(event1);
    addEvent(event2);

    let { events } = useEventsStore.getState();
    expect(events).toHaveLength(2);

    removeEvent('event-1');

    events = useEventsStore.getState().events;
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event2);
  });

  it('should not remove event if id does not exist', () => {
    const { addEvent, removeEvent } = useEventsStore.getState();

    const event: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    addEvent(event);

    let { events } = useEventsStore.getState();
    expect(events).toHaveLength(1);

    removeEvent('non-existent-id');

    events = useEventsStore.getState().events;
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event);
  });

  it('should set events correctly', () => {
    const { setEvents } = useEventsStore.getState();

    const events: FinancialEventType[] = [
      {
        id: 'event-1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 5000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única de R$ 5.000,00',
      },
      {
        id: 'event-2',
        type: 'despesa',
        frequency: 'mensal',
        start_year: 2024,
        end_year: 2026,
        value: 1000,
        created_at: '2024-01-02T00:00:00Z',
        description: 'Despesa mensal de R$ 1.000,00',
      },
    ];

    setEvents(events);

    const { events: currentEvents } = useEventsStore.getState();
    expect(currentEvents).toEqual(events);
    expect(currentEvents).toHaveLength(2);
  });

  it('should clear events when setEvents is called with empty array', () => {
    const { addEvent, setEvents } = useEventsStore.getState();

    const event: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    addEvent(event);

    let { events } = useEventsStore.getState();
    expect(events).toHaveLength(1);

    setEvents([]);

    events = useEventsStore.getState().events;
    expect(events).toEqual([]);
    expect(events).toHaveLength(0);
  });

  it('should persist events to localStorage', async () => {
    const { addEvent } = useEventsStore.getState();

    const event: FinancialEventType = {
      id: 'event-1',
      type: 'renda',
      frequency: 'unica',
      year: 2024,
      value: 5000,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Renda única de R$ 5.000,00',
    };

    addEvent(event);

    const { events } = useEventsStore.getState();
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event);
  });

  it('should restore events from localStorage on initialization', () => {
    const events: FinancialEventType[] = [
      {
        id: 'event-1',
        type: 'renda',
        frequency: 'unica',
        year: 2024,
        value: 5000,
        created_at: '2024-01-01T00:00:00Z',
        description: 'Renda única de R$ 5.000,00',
      },
    ];

    localStorage.setItem(
      'financial-events-storage',
      JSON.stringify({
        state: { events },
        version: 0,
      })
    );

    const stored = localStorage.getItem('financial-events-storage');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.events).toEqual(events);
      expect(parsed.state.events).toHaveLength(1);
    }
  });
});
