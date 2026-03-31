import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send, IndianRupee, BellRing, Check } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { formatCurrency, generateWALink } from '../utils/formatters';

export default function FollowUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Only show vehicles that are done/paid but still have remaining balance > 0
  const debtors = vehicles.filter(v => v.remaining > 0);
  const totalPending = debtors.reduce((sum, v) => sum + v.remaining, 0);

  const handleRemind = (vehicle: any) => {
    const phone = vehicle.owner_whatsapp || vehicle.customer_whatsapp;
    const text = `Hello ${vehicle.owner_name || vehicle.customer_name},\nThis is a friendly reminder from Shri Narsang Bike Care that a balance of ${formatCurrency(vehicle.remaining)} is pending for your vehicle ${vehicle.number_plate}.\nPlease arrange for payment soon.\nThank you!`;
    
    window.open(generateWALink(phone, text), '_blank');
    setRemindedIds(prev => new Set(prev).add(vehicle.id));
  };

  const handleRemindAll = () => {
    if (debtors.length === 0) return;
    alert("In a normal WhatsApp setup, bulk sending requires API.\nClicking OK will open the first one. Please use individual remind buttons for best results.");
    handleRemind(debtors[0]);
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-24">
      <header className="flex w-full items-center gap-4 p-4 border-b border-gray-900 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display tracking-widest text-primary-500 m-0 leading-none">
          {t('nav.followup', 'FOLLOW UP')}
        </h1>
      </header>

      <div className="p-4">
         {/* Summary Banner */}
         <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-[50px] pointer-events-none"></div>
            <p className="text-xs text-red-500 uppercase font-sans tracking-widest font-bold mb-1 flex justify-center items-center gap-1">
              <IndianRupee size={12}/> Total Market Pending
            </p>
            <p className="text-4xl font-mono font-bold text-red-500 text-shadow-sm">{formatCurrency(totalPending)}</p>
            <p className="text-sm font-sans text-gray-400 mt-2 tracking-wide font-bold">{debtors.length} customers to remind</p>
            
            <button 
              onClick={handleRemindAll}
              disabled={debtors.length === 0}
              className="mt-4 bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-sans font-bold uppercase tracking-widest text-sm py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(224,49,49,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              <BellRing size={16} /> Remind All
            </button>
         </div>

         <div className="space-y-3">
            {isLoading ? (
               <div className="flex justify-center p-8"><div className="w-6 h-6 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div></div>
            ) : debtors.length > 0 ? (
               debtors.map(v => (
                 <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                       <div>
                         <p className="font-display tracking-widest text-white text-xl">{v.number_plate}</p>
                         <p className="text-sm font-sans text-gray-400 font-bold">{v.customer_name}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-mono text-lg font-bold text-red-500">{formatCurrency(v.remaining)}</p>
                         <p className="text-[10px] text-gray-500 tracking-widest uppercase font-sans">Pending</p>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-gray-950 p-2 rounded-lg border border-gray-800/50">
                       <p className="text-xs font-mono text-gray-500 flex items-center gap-2">
                          <IndianRupee size={12}/> Estimate: {formatCurrency(v.estimate)}
                       </p>
                       <button
                         onClick={() => handleRemind(v)}
                         className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                           remindedIds.has(v.id) 
                             ? 'bg-green-500/20 text-green-500 border border-green-500/50' 
                             : 'bg-primary-500/20 text-primary-500 border border-primary-500/50 hover:bg-primary-500 hover:text-white'
                         }`}
                       >
                         {remindedIds.has(v.id) ? <><Check size={14}/> Sent</> : <><Send size={14}/> Remind</>}
                       </button>
                    </div>
                 </div>
               ))
            ) : (
               <div className="text-center p-8 border border-dashed border-gray-800 rounded-xl bg-gray-900/50">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-white font-display tracking-widest text-xl mb-1">ALL CLEAR!</h3>
                  <p className="text-gray-500 font-sans text-sm">No pending payments to collect.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
