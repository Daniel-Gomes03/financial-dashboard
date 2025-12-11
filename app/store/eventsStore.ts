import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EventsStateType } from '../types';

export const useEventsStore = create<EventsStateType>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [event, ...state.events],
        })),
      removeEvent: (eventId) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== eventId),
        })),
      setEvents: (events) =>
        set(() => ({
          events,
        })),
    }),
    {
      name: 'financial-events-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
