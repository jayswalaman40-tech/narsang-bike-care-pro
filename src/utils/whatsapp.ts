import { supabase } from '../lib/supabase';

/**
 * Sends a WhatsApp notification via Supabase Edge Function.
 * This centralizes message generation and sending.
 */
export const sendWhatsAppNotification = async (
  vehicleId: string, 
  type: 'registration' | 'done' | 'payment' | 'reminder', 
  extraData?: any
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-owner-customer-text', {
      body: { 
        vehicle_id: vehicleId, 
        type, 
        extra_data: extraData 
      }
    });

    if (error) {
      console.error("Supabase Function Error:", error);
      return false;
    }

    console.log(`WhatsApp (${type}) notification triggered:`, data);
    return true;
  } catch (error: any) {
    console.error("Critical failure calling WhatsApp Edge Function:", error);
    return false;
  }
};

// --- Message Generators (for UI previews) ---

export const generateVehicleRegistrationMessage = (
  ownerName: string,
  vehiclePlate: string,
  problem: string,
  estimate: number,
  deliveryBy: string
) => {
  const deliveryLine = deliveryBy ? `\n📅 Delivery: ${deliveryBy}` : '';
  return `🛵 *Vehicle Registered!*\nNamaste ${ownerName} ji! 🙏\nAapki gaadi ${vehiclePlate} register ho gayi hai.\n🔧 Problem: ${problem}\n💰 Estimate: ₹${estimate}${deliveryLine}\n\n— *Shri Narsang Bike Care* 🛵`;
};

export const generateDoneMessage = (
  customerName: string, 
  vehiclePlate: string, 
  estimate: number
) => {
  return `✅ *Gaadi Tayaar Hai!*\nNamaste ${customerName} ji! 🙏\n${vehiclePlate} tayyaar ho gayi!\n💰 Total: ₹${estimate}\n\n— *Shri Narsang Bike Care* 🛵`;
};

export const generatePaymentConfirmationMessage = (
  customerName: string,
  amount: number,
  remaining: number
) => {
  const remainingLine = remaining > 0 ? `\n📉 Pending: ₹${remaining}` : '\n🎉 Full payment received!';
  return `💰 *Payment Received!*\nNamaste ${customerName} ji! 🙏\nHumne ₹${amount} prapt kiye hain.${remainingLine}\n\n— *Shri Narsang Bike Care* 🛵`;
};

export const generateFollowUpMessage = (
  customerName: string,
  vehiclePlate: string,
  pendingAmount: number
) => {
  return `🔔 *Payment Reminder*\nNamaste ${customerName} ji! 🙏\nAapki gaadi ${vehiclePlate} ka ₹${pendingAmount} baaki hai. Kripya jald jama karayein.\n\n— *Shri Narsang Bike Care* 🛵`;
};
