export const sendWhatsAppMessage = async (phone: string | undefined | null, message: string) => {
  if (!phone) return false;
  
  // Normalize: 10 digits -> 91 prefix
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  const apiUrl = import.meta.env.VITE_EVO_API_URL;
  const instance = import.meta.env.VITE_EVO_INSTANCE;
  const apikey = import.meta.env.VITE_EVO_API_KEY;

  if (!apiUrl || !instance || !apikey) {
    console.error("Evolution API credentials missing in .env");
    return false;
  }

  // Ensure instance is URL encoded
  const encodedInstance = encodeURIComponent(instance);

  try {
    const payload = {
      number: fullPhone,
      text: message,
      delay: 1200,
      linkPreview: false
    };

    const response = await fetch(`${apiUrl}/message/sendText/${encodedInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Evolution API Error Response:", data);
      return false;
    }

    console.log("WhatsApp sent successfully:", data);
    return true;
  } catch (error: any) {
    console.error("Critical failure calling Evolution API:", error);
    return false;
  }
};

export const generateDoneMessage = (
  customerName: string, 
  vehiclePlate: string, 
  estimate: number
) => {
  return `✅ *Gaadi Tayaar Hai!*\nNamaste ${customerName} ji! 🙏\n${vehiclePlate} tayyaar ho gayi!\n💰 Total: ₹${estimate}\n\n— *Shri Narsang Bike Care* 🛵`;
};

export const generatePartialPaymentMessage = (
  customerName: string,
  vehiclePlate: string,
  received: number,
  remaining: number
) => {
  return `💰 *Payment Update*\n${customerName} ji — ${vehiclePlate}:\n✅ Mila: ₹${received}\n⚠️ Balance: ₹${remaining}\n\n— *Shri Narsang Bike Care* 🛵`;
};

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

export const generatePaymentConfirmationMessage = (
  ownerName: string,
  vehiclePlate: string,
  amountPaid: number,
  totalPaid: number,
  remaining: number
) => {
  const statusLine = remaining <= 0
    ? '✅ Full payment complete! Shukriya! 🙏'
    : `⚠️ Remaining: ₹${remaining}`;
  return `💰 *Payment Received!*\nNamaste ${ownerName} ji! 🙏\n${vehiclePlate} ke liye ₹${amountPaid} mila.\n✅ Total Paid: ₹${totalPaid}\n${statusLine}\n\n— *Shri Narsang Bike Care* 🛵`;
};

export const generateFollowUpMessage = (
  customerName: string,
  vehiclePlate: string,
  remaining: number
) => {
  return `🔔 *Payment Reminder*\nNamaste ${customerName} ji.\n${vehiclePlate} ka pending balance: ₹${remaining}.\nKripya jaldi payment clear karein. 🙏\n\n— *Shri Narsang Bike Care* 🛵`;
};
