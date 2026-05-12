import { create } from 'zustand';
import { vehicleService, paymentService } from '../services/api';
import type { VehicleWithPayment, Vehicle, Payment } from '../types';

interface VehicleState {
  vehicles: VehicleWithPayment[];
  selectedVehicle: VehicleWithPayment | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchVehicles: () => Promise<void>;
  getVehicleById: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<Vehicle>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  markAsDone: (id: string) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'paid_at'>) => Promise<void>;
  setSelectedVehicle: (vehicle: VehicleWithPayment | null) => void;
  refreshAll: (id?: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,

  refreshAll: async (id?: string) => {
    // Helper to refresh everything
    await get().fetchVehicles();
    if (id) {
      await get().getVehicleById(id);
    } else if (get().selectedVehicle?.id) {
      await get().getVehicleById(get().selectedVehicle!.id);
    }
  },

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
    // If we don't have it or it's a different one, show loading
    if (!get().selectedVehicle || get().selectedVehicle?.id !== id) {
      set({ isLoading: true, error: null });
    }
    
    try {
      const data = await vehicleService.getById(id);
      const payments = await paymentService.getByVehicleId(id);
      
      const paymentsWithCompat = payments.map(p => ({
        ...p,
        amount: p.amount_paid,
        created_at: p.paid_at
      }));

      set({ 
        selectedVehicle: { ...data, payments: paymentsWithCompat }, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicle = await vehicleService.create(vehicle);
      await get().fetchVehicles();
      set({ isLoading: false });
      return newVehicle;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateVehicle: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.update(id, updates);
      await get().refreshAll(id);
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
      await get().refreshAll(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addPayment: async (payment) => {
    set({ isLoading: true, error: null });
    try {
      await paymentService.create(payment);
      await get().refreshAll(payment.vehicle_id);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
}));
