import { supabase } from '../lib/supabase';

// Helper to clean and format phone number for Evolution API
const formatWhatsAppNumber = (number: string) => {
  if (!number) return '';
  let clean = number.replace(/\D/g, '');
  // If it's a 10-digit Indian number, add 91 prefix
  if (clean.length === 10) {
    clean = '91' + clean;
  }
  return clean;
};

/**
 * Sends a WhatsApp notification via Evolution API.
 * This centralizes message generation and sending, contacting the Evolution API directly.
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

    // 3. Evolution API Config from .env
    const baseUrl = import.meta.env.VITE_EVO_API_URL;
    const apiKey = import.meta.env.VITE_EVO_API_KEY;
    const instance = import.meta.env.VITE_EVO_INSTANCE;
    const mechanicNumber = import.meta.env.VITE_MECHANIC_WHATSAPP;
    
    // Numbers from the vehicle record
    const customerNumber = v.customer_whatsapp;
    const ownerNumber = v.owner_whatsapp;

    if (!baseUrl || !apiKey || !instance) {
      console.error("Evolution API configuration missing in .env. Please check VITE_EVO_API_URL, VITE_EVO_API_KEY, and VITE_EVO_INSTANCE.");
      return false;
    }

    const sendMessage = async (number: string, text: string, label: string) => {
      const cleanNumber = formatWhatsAppNumber(number);
      if (!cleanNumber) return false;

      const url = `${baseUrl}/message/sendText/${instance}`;
      console.log(`Sending WhatsApp to ${label} (${cleanNumber})...`);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            number: cleanNumber,
            text: text,
            linkPreview: true
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error(`Evolution API Error for ${label}:`, response.status, errData);
          return false;
        }

        console.log(`WhatsApp sent to ${label} successfully.`);
        return true;
      } catch (err) {
        console.error(`Fetch error sending to ${label}:`, err);
        return false;
      }
    };

    // Track if at least one message was sent successfully
    let overallSuccess = false;

    // A. Send to Customer
    if (customerNumber) {
      const ok = await sendMessage(customerNumber, messageText, "Customer");
      if (ok) overallSuccess = true;
    }

    // B. Send to Vehicle Owner (if different)
    if (ownerNumber && ownerNumber !== customerNumber) {
      const ok = await sendMessage(ownerNumber, messageText, "Vehicle Owner");
      if (ok) overallSuccess = true;
    }

    // C. Send to Mechanic (Shop Owner)
    if (mechanicNumber) {
      const mechanicMsg = `📌 *Update for ${v.number_plate}*\n${messageText}`;
      const ok = await sendMessage(mechanicNumber, mechanicMsg, "Mechanic/Shop");
      if (ok) overallSuccess = true;
    }

    return overallSuccess;
  } catch (error: any) {
    console.error("Critical failure calling Evolution API:", error);
    return false;
  }
};

// --- Message Generators (for UI previews and sending) ---

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

