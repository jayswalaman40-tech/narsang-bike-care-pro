import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, AlertCircle, Eye } from 'lucide-react';
import type { VehicleWithPayment } from '../types';
import { formatCurrency, generateWALink } from '../utils/formatters';
import { useUIStore } from '../store/uiStore';
import { whatsappService } from '../services/api';

export default function WAPartial() {
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

  const remaining = vehicle.estimate - (vehicle.total_paid + amount); // Since vehicle state might not be updated locally yet
  const mechanicName = settings?.mechanic_name || 'Aman Bhai';

  const sendWA = async (type: 'customer' | 'owner' | 'mechanic') => {
     let phone = '';
     let text = '';
     
     if (type === 'customer') {
       phone = vehicle.customer_whatsapp;
       text = `${t('wa.hello')} ${vehicle.customer_name},\n${t('wa.partial_payment_customer', { amount, remaining, number_plate: vehicle.number_plate })}\n${t('wa.thank_you')}`;
     } else if (type === 'owner') {
       phone = vehicle.owner_whatsapp || vehicle.customer_whatsapp;
       text = `${t('wa.hello')} ${vehicle.owner_name || vehicle.customer_name},\n${t('wa.partial_payment_customer', { amount, remaining, number_plate: vehicle.number_plate })}\n${t('wa.thank_you')}`;
     } else {
       phone = mechanicWhatsapp;
       text = `⚠️ PARTIAL PAYMENT\nVehicle: ${vehicle.number_plate}\nPaid: ${amount}\nRemaining: ${remaining}\nFrom: ${vehicle.customer_name}`;
     }

     window.open(generateWALink(phone, text), '_blank');
     await whatsappService.logMessage(vehicle.id, type, phone, 'partial_payment');
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col p-6">
      
      {/* Top Graphic */}
      <div className="w-full flex flex-col items-center mt-8 mb-8">
         <div className="w-24 h-24 rounded-full border-4 border-primary-500/30 flex items-center justify-center bg-gray-900 shadow-glow animate-slide-up">
           <AlertCircle size={48} className="text-primary-500" />
         </div>
         <h1 className="text-3xl font-display tracking-widest text-white mt-6 mb-2 animate-slide-up text-center" style={{ animationDelay: '0.1s' }}>
           {t('payment.partial', 'PARTIAL PAYMENT LOGGED')}
         </h1>
         <p className="font-mono text-2xl font-bold text-primary-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
           +{formatCurrency(amount)}
         </p>
         <p className="font-sans text-sm text-red-500 font-bold tracking-widest uppercase mt-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
           Still pending: {formatCurrency(remaining)}
         </p>
      </div>

      <p className="text-center font-sans text-gray-400 mb-6 uppercase tracking-widest text-sm font-bold animate-slide-up" style={{ animationDelay: '0.4s' }}>
        Send WhatsApp Alerts
      </p>

      {/* WA Card Grid */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 flex-1 animate-slide-up" style={{ animationDelay: '0.5s' }}>
         <button onClick={() => sendWA('customer')} className="flex items-center justify-between p-4 bg-gray-900 border border-primary-500/30 rounded-xl hover:border-primary-500 transition-colors shadow-sm">
            <div className="text-left">
              <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">{t('intake.customer_name', 'Customer')}</span>
              <span className="block text-white font-bold text-shadow-sm">{vehicle.customer_name}</span>
            </div>
            <div className="bg-primary-500/10 p-3 rounded-full"><Send size={20} className="text-primary-500" /></div>
         </button>
         
         {vehicle.owner_name && (
           <button onClick={() => sendWA('owner')} className="flex items-center justify-between p-4 bg-gray-900 border border-primary-500/30 rounded-xl hover:border-primary-500 transition-colors shadow-sm">
              <div className="text-left">
                <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">{t('intake.owner_name', 'Owner')}</span>
                <span className="block text-white font-bold text-shadow-sm">{vehicle.owner_name}</span>
              </div>
              <div className="bg-primary-500/10 p-3 rounded-full"><Send size={20} className="text-primary-500" /></div>
           </button>
         )}

         <button onClick={() => sendWA('mechanic')} className="flex items-center justify-between p-4 bg-gray-900 border border-primary-500/30 rounded-xl hover:border-primary-500 transition-colors shadow-sm">
            <div className="text-left">
              <span className="block text-xs text-gray-500 uppercase font-sans tracking-widest">Self Copy</span>
              <span className="block text-white font-bold text-shadow-sm">{mechanicName} (Me)</span>
            </div>
            <div className="bg-primary-500/10 p-3 rounded-full"><Send size={20} className="text-primary-500" /></div>
         </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 mt-6 animate-slide-up mb-8" style={{ animationDelay: '0.6s' }}>
         <button 
           onClick={() => navigate(`/vehicle/${vehicle.id}/tracker`, { replace: true })}
           className="btn-secondary w-full"
         >
           <Eye size={20} /> VIEW TRACKER
         </button>
         <button 
           onClick={() => navigate('/dashboard', { replace: true })}
           className="text-gray-500 font-sans uppercase tracking-widest font-bold hover:text-white transition-colors py-4 text-center cursor-pointer"
         >
           {t('nav.home', 'BACK TO HOME')}
         </button>
      </div>

    </div>
  );
}
