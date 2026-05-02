import { supabase } from '../lib/supabase';

/**
 * Triggers an n8n webhook with full vehicle and event details.
 */
export const triggerN8nWebhook = async (
  vehicleId: string,
  type: 'registration' | 'done' | 'payment' | 'reminder',
  extraData?: any
) => {
  try {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes('your-n8n-instance')) {
      console.warn("n8n Webhook URL not configured in .env");
      return false;
    }

    // 1. Fetch full vehicle details and garage settings
    const [vehicleRes, settingsRes] = await Promise.all([
      supabase.from('vehicles').select('*').eq('id', vehicleId).single(),
      supabase.from('garage_settings').select('*').single()
    ]);

    const { data: vehicle, error: fetchErr } = vehicleRes;
    const { data: settings } = settingsRes;

    if (fetchErr || !vehicle) {
      console.error("Error fetching vehicle for n8n:", fetchErr);
      return false;
    }

    // 2. Prepare payload to match user's specific requirements
    const payload = {
      event: type,
      timestamp: new Date().toISOString(),
      amount: extraData?.amount || vehicle.estimate || 0,
      time_to_done: vehicle.delivery_by || 'Not specified',
      
      vehicle_details: {
        number_plate: vehicle.number_plate,
        vehicle_type: vehicle.vehicle_type,
        problem: vehicle.problem,
        status: vehicle.status
      },
      
      owner_details: {
        name: vehicle.owner_name || vehicle.customer_name,
        whatsapp: vehicle.owner_whatsapp || vehicle.customer_whatsapp
      },
      
      customer_details: {
        name: vehicle.customer_name,
        whatsapp: vehicle.customer_whatsapp
      },
      
      mechanic_details: {
        name: settings?.mechanic_name || 'Not specified',
        whatsapp: settings?.mechanic_whatsapp || 'Not specified',
        garage_name: settings?.garage_name || 'Shri Narsang Bike Care'
      },

      // Full raw data for backup
      raw_vehicle: vehicle,
      raw_settings: settings || {},
      extra_data: extraData || {}
    };

    console.log(`Triggering n8n webhook for event: ${type}...`);

    // 3. Send to n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`n8n Webhook Error: ${response.status}`);
      return false;
    }

    console.log(`n8n Webhook triggered successfully for ${type}.`);
    return true;
  } catch (err) {
    console.error("Critical error triggering n8n webhook:", err);
    return false;
  }
};
