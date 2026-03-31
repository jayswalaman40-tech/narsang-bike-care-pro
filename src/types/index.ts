export type VehicleStatus = 'in_repair' | 'done' | 'paid';
export type PaymentType = 'full' | 'partial';
export type PaymentMethod = 'upi' | 'cash' | 'bank';
export type VehicleType = 'Scooter' | 'Bike';
export type Language = 'en' | 'hi' | 'gu';

export interface Vehicle {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  vehicle_type: VehicleType;
  number_plate: string;
  owner_name: string | null;
  owner_whatsapp: string | null;
  problem: string;
  estimate: number;
  delivery_by: string | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface VehicleWithPayment extends Vehicle {
  total_paid: number;
  remaining: number;
  payment_status: 'unpaid' | 'paid_full' | 'paid_partial';
}

export interface Payment {
  id: string;
  vehicle_id: string;
  amount_paid: number;
  total_amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  note: string | null;
  paid_at: string;
}

export interface GarageSettings {
  id: string;
  garage_name: string;
  mechanic_name: string;
  mechanic_whatsapp: string;
  upi_id: string | null;
}
