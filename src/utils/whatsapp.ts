export const sendWhatsAppMessage = async (phone: string | undefined | null, message: string) => {
  if (!phone) return false;
  
  // Remove spaces, dashes, or non-numeric characters from the phone number
  const cleanPhone = phone.replace(/\D/g, '');
  // Prefix with 91 if it's a 10 digit Indian number
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  const apiUrl = import.meta.env.VITE_EVO_API_URL;
  const instance = import.meta.env.VITE_EVO_INSTANCE;
  const apikey = import.meta.env.VITE_EVO_API_KEY;

  if (!apiUrl || !instance || !apikey) {
    console.error("Evolution API credentials missing in .env");
    alert("Evolution API is not configured! Please add VITE_EVO_API_URL and VITE_EVO_INSTANCE in Vercel.");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey
      },
      body: JSON.stringify({
        number: fullPhone,
        textMessage: {
          text: message
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Evolution API Error: ${errText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message via Evolution API:", error);
    alert("Failed to send WhatsApp message. Check console for details.");
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
