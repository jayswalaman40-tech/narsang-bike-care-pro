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
    // 1. Fetch vehicle details to generate message
    const { data: v, error: fetchErr } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (fetchErr || !v) {
      console.error("Error fetching vehicle for WhatsApp:", fetchErr);
      return false;
    }

    // 2. Generate the appropriate message text
    let messageText = "";
    switch (type) {
      case 'registration':
        messageText = generateVehicleRegistrationMessage(
          v.owner_name || v.customer_name,
          v.number_plate,
          v.problem,
          v.estimate,
          v.delivery_by
        );
        break;
      case 'done':
        messageText = generateDoneMessage(v.customer_name, v.number_plate, v.estimate);
        break;
      case 'payment':
        const remaining = (v.estimate || 0) - (v.total_paid || 0);
        messageText = generatePaymentConfirmationMessage(v.customer_name, extraData?.amount || 0, remaining);
        break;
      case 'reminder':
        const rem = (v.estimate || 0) - (v.total_paid || 0);
        messageText = generateFollowUpMessage(v.customer_name, v.number_plate, rem);
        break;
    }

    // 3. Invoke the Edge Function with the expected 'message' payload
    const { data, error } = await supabase.functions.invoke('send-owner-customer-text', {
      body: { 
        vehicle_id: vehicleId, 
        message: messageText
      }
    });

    if (error) {
      console.error("Supabase Function Error:", error);
      return false;
    }

    console.log(`WhatsApp (${type}) notification sent successfully:`, data);
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
