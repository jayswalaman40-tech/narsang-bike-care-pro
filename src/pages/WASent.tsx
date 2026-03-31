import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Navigation } from 'lucide-react';
import type { VehicleWithPayment } from '../types';

export default function WASent() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle as VehicleWithPayment;

  // Security redirect
  useEffect(() => {
    if (!vehicle) navigate('/dashboard', { replace: true });
  }, [vehicle, navigate]);

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center p-6 text-center">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-32 h-32 rounded-full border-4 border-green-500/30 flex items-center justify-center bg-gray-900 mb-8 shadow-[0_0_30px_rgba(43,138,62,0.4)] animate-slide-up">
        <CheckCircle2 size={64} className="text-green-500" />
      </div>

      <h1 className="text-4xl font-display tracking-widest text-white mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {t('dashboard.done_today', 'DONE')}
      </h1>
      
      <p className="font-sans text-xl text-gray-400 mb-8 animate-slide-up max-w-[280px]" style={{ animationDelay: '0.2s' }}>
        <strong>{vehicle.number_plate}</strong> marked as ready. WhatsApp messages sent locally.
      </p>

      {/* Undo Button */}
      <div className="animate-slide-up w-full max-w-xs mb-8 flex items-center justify-center relative" style={{ animationDelay: '0.3s' }}>
         <div className="absolute inset-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
             <div className="bg-gray-700 h-full w-0 animate-[fillRight_8s_linear_forwards]"></div>
         </div>
         <span className="relative z-10 text-gray-300 font-sans tracking-widest font-bold py-3">UNDO ACTIONS (8s)</span>
         
         <style>{`
           @keyframes fillRight {
             from { width: 0%; }
             to { width: 100%; }
           }
         `}</style>
      </div>

      <button 
        onClick={() => navigate(`/vehicle/${vehicle.id}/payment`, { replace: true })}
        className="btn-primary w-full max-w-xs animate-slide-up shadow-glow"
        style={{ animationDelay: '0.4s' }}
      >
        <Navigation size={20} /> {t('common.payment', 'RECORD PAYMENT')}
      </button>

      <button 
        onClick={() => navigate('/dashboard', { replace: true })}
        className="mt-6 text-gray-500 font-sans uppercase tracking-widest font-bold hover:text-white transition-colors animate-slide-up"
        style={{ animationDelay: '0.5s' }}
      >
        {t('nav.home', 'BACK TO HOME')}
      </button>

    </div>
  );
}
