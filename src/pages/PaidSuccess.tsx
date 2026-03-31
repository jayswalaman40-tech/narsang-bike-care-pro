import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2 } from 'lucide-react';
import type { VehicleWithPayment } from '../types';
import { formatCurrency } from '../utils/formatters';
import { generateWALink } from '../utils/formatters';
import { useUIStore } from '../store/uiStore';
import { whatsappService } from '../services/api';

export default function PaidSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const vehicle = location.state?.vehicle as VehicleWithPayment;
  const amount = location.state?.amount as number;

  const { mechanicWhatsapp, settings } = useUIStore();

  useEffect(() => {
    if (!vehicle) navigate('/dashboard', { replace: true });
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  // Real WhatsApp message text generation rules
  // For the final version, this logic can be grouped into a utility function `buildWAFullMessage`
  
  const mechanicName = settings?.mechanic_name || 'Aman Bhai';

  const sendWA = async (type: 'customer' | 'owner' | 'mechanic') => {
     let phone = '';
     let text = '';
     
     // Base generic messages based on translations
     if (type === 'customer') {
       phone = vehicle.customer_whatsapp;
       text = `${t('wa.hello')} ${vehicle.customer_name},\n${t('wa.full_payment_customer', { amount, number_plate: vehicle.number_plate })}\n${t('wa.thank_you')}`;
     } else if (type === 'owner') {
       phone = vehicle.owner_whatsapp || vehicle.customer_whatsapp;
       text = `${t('wa.hello')} ${vehicle.owner_name || vehicle.customer_name},\n${t('wa.full_payment_customer', { amount, number_plate: vehicle.number_plate })}\n${t('wa.thank_you')}`;
     } else {
       phone = mechanicWhatsapp;
       text = `💰 PAYMENT RECEIVED\nVehicle: ${vehicle.number_plate}\nType: Full Settlement\nAmount: ${amount}\nFrom: ${vehicle.customer_name}`;
     }

     window.open(generateWALink(phone, text), '_blank');
     await whatsappService.logMessage(vehicle.id, type, phone, 'full_payment');
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center p-6 text-center">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>

      <div className="flex gap-2 mb-8 animate-slide-up">
        <CheckCircle2 size={48} className="text-green-500 animate-slide-up" style={{ animationDelay: '0.1s' }} />
        <CheckCircle2 size={56} className="text-green-400 animate-slide-up shadow-glow rounded-full" style={{ animationDelay: '0.2s', marginTop: '-10px' }} />
        <CheckCircle2 size={48} className="text-green-500 animate-slide-up" style={{ animationDelay: '0.3s' }} />
      </div>

      <h1 className="text-4xl font-display tracking-widest text-white mb-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        {t('payment.full_payment', 'FULL PAYMENT SETTLED')}
      </h1>
      
      <p className="font-mono text-3xl font-bold text-green-500 mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        {formatCurrency(amount)}
      </p>

      {/* WA Card Grid */}
      <div className="w-full max-w-sm flex flex-col gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
         <button onClick={() => sendWA('customer')} className="flex items-center justify-between p-4 bg-gray-900 border border-green-500/30 rounded-xl hover:border-green-500 transition-colors">
            <div className="text-left">
              <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">{t('intake.customer_name', 'Customer')}</span>
              <span className="block text-white font-bold">{vehicle.customer_name}</span>
            </div>
            <Send size={20} className="text-green-500" />
         </button>
         
         {vehicle.owner_name && (
           <button onClick={() => sendWA('owner')} className="flex items-center justify-between p-4 bg-gray-900 border border-green-500/30 rounded-xl hover:border-green-500 transition-colors">
              <div className="text-left">
                <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">{t('intake.owner_name', 'Owner')}</span>
                <span className="block text-white font-bold">{vehicle.owner_name}</span>
              </div>
              <Send size={20} className="text-green-500" />
           </button>
         )}

         <button onClick={() => sendWA('mechanic')} className="flex items-center justify-between p-4 bg-gray-900 border border-green-500/30 rounded-xl hover:border-green-500 transition-colors">
            <div className="text-left">
              <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">Self Copy</span>
              <span className="block text-white font-bold">{mechanicName} (Me)</span>
            </div>
            <Send size={20} className="text-green-500" />
         </button>
      </div>

      <button 
        onClick={() => navigate('/dashboard', { replace: true })}
        className="mt-2 text-gray-500 font-sans uppercase tracking-widest font-bold hover:text-white transition-colors animate-slide-up cursor-pointer"
        style={{ animationDelay: '0.7s' }}
      >
        {t('nav.home', 'BACK TO HOME')}
      </button>

    </div>
  );
}
