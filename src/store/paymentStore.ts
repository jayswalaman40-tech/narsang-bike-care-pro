import { create } from 'zustand';
import { paymentService } from '../services/api';
import type { Payment } from '../types';

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPaymentsForVehicle: (vehicleId: string) => Promise<void>;
  addPayment: (
    payment: Omit<Payment, 'id' | 'paid_at'>
  ) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPaymentsForVehicle: async (vehicleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await paymentService.getByVehicleId(vehicleId);
      set({ payments: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addPayment: async (payment) => {
    set({ isLoading: true, error: null });
    try {
      await paymentService.create(payment);
      // Refresh the local payment list
      await get().fetchPaymentsForVehicle(payment.vehicle_id);
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
