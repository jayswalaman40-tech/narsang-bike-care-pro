import { supabase } from '../lib/supabase';
import type { Vehicle, Payment, VehicleWithPayment, VehicleStatus } from '../types';

export const vehicleService = {
  // Get all vehicles with their payment summary view
  getAll: async () => {
    const { data, error } = await supabase
      .from('vehicle_payment_summary')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as VehicleWithPayment[];
  },

  // Get a single vehicle by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('vehicle_payment_summary')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as VehicleWithPayment;
  },

  // Create a new vehicle
  create: async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ ...vehicle, status: 'in_repair' }])
      .select()
      .single();
      
    if (error) throw error;
    return data as Vehicle;
  },

  // Update a vehicle
  update: async (id: string, updates: Partial<Vehicle>) => {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Vehicle;
  },

  // Update vehicle status
  updateStatus: async (id: string, status: VehicleStatus) => {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Vehicle;
  }
};

export const paymentService = {
  // Get all payments for a vehicle
  getByVehicleId: async (vehicleId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('paid_at', { ascending: true });
      
    if (error) throw error;
    return data as Payment[];
  },

  // Record a new payment
  create: async (payment: Omit<Payment, 'id' | 'paid_at'>) => {
    // Start a simple transaction-like flow via rpc or separate calls
    // First insert payment
    const { data: newPayment, error: paymentError } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();
      
    if (paymentError) throw paymentError;

    // We don't need to manually update tracking since we have a view,
    // but if it's the full amount or final partial, we update vehicle status to 'paid'
    
    // Check total paid using the view
    const { data: summary } = await supabase
      .from('vehicle_payment_summary')
      .select('payment_status')
      .eq('id', payment.vehicle_id)
      .single();
      
    if (summary?.payment_status === 'paid_full') {
      await supabase
        .from('vehicles')
        .update({ status: 'paid' })
        .eq('id', payment.vehicle_id);
    }
    
    return newPayment as Payment;
  }
};

export const whatsappService = {
  // Log a WhatsApp message locally
  logMessage: async (vehicleId: string, recipient: string, phone: string, messageType: string) => {
    const { data, error } = await supabase
      .from('wa_log')
      .insert([{ 
        vehicle_id: vehicleId, 
        recipient, 
        phone, 
        message_type: messageType 
      }])
      .select()
      .single();
      
    if (error) console.error("Could not log WA message", error);
    return data;
  }
};

export const settingsService = {
  get: async () => {
    const { data, error } = await supabase
      .from('garage_settings')
      .select('*')
      .limit(1)
      .single();
      
    // If table is empty, just catch the error and return default but since we seeded, it's fine.
    if (error) console.error("Error fetching settings", error);
    return data;
  }
};
