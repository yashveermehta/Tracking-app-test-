import { create } from 'zustand';
import { Truck, Route, Alert, Schedule, TouchPointEvent } from '../types';

interface TelematicsState {
  trucks: Truck[];
  routes: Route[];
  alerts: Alert[];
  schedules: Schedule[];
  touchPointEvents: TouchPointEvent[];
  
  // Actions
  setTrucks: (trucks: Truck[]) => void;
  updateTruck: (id: string, partial: Partial<Truck>) => void;
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
  setRoutes: (routes: Route[]) => void;
  setSchedules: (schedules: Schedule[]) => void;
  addTouchPointEvent: (event: TouchPointEvent) => void;
}

export const useStore = create<TelematicsState>((set) => ({
  trucks: [],
  routes: [],
  alerts: [],
  schedules: [],
  touchPointEvents: [],

  setTrucks: (trucks) => set({ trucks }),
  updateTruck: (id, partial) =>
    set((state) => ({
      trucks: state.trucks.map((truck) =>
        truck.id === id ? { ...truck, ...partial } : truck
      ),
    })),
  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, resolved: true } : alert
      ),
    })),
  setRoutes: (routes) => set({ routes }),
  setSchedules: (schedules) => set({ schedules }),
  addTouchPointEvent: (event) =>
    set((state) => ({ touchPointEvents: [event, ...state.touchPointEvents] })),
}));
