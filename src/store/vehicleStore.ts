import { create } from 'zustand';
import { vehicleService } from '../services/api';
import type { VehicleWithPayment, Vehicle } from '../types';

interface VehicleState {
  vehicles: VehicleWithPayment[];
  selectedVehicle: VehicleWithPayment | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVehicles: () => Promise<void>;
  getVehicleById: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  markAsDone: (id: string) => Promise<void>;
  setSelectedVehicle: (vehicle: VehicleWithPayment | null) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await vehicleService.getAll();
      set({ vehicles: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getVehicleById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await vehicleService.getById(id);
      set({ selectedVehicle: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.create(vehicle);
      await get().fetchVehicles(); // Refresh list to get view data
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateVehicle: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.update(id, updates);
      await get().getVehicleById(id); // Refresh selected
      await get().fetchVehicles(); // Refresh list
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  markAsDone: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.updateStatus(id, 'done');
      await get().getVehicleById(id); // Refresh
      await get().fetchVehicles(); // Refresh list
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
}));
