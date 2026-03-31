import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Banknote, Navigation, Info, CheckCircle2 } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { usePaymentStore } from '../store/paymentStore';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';

export default function PartialTracker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { getVehicleById, selectedVehicle } = useVehicleStore();
  const { fetchPaymentsForVehicle, payments, isLoading } = usePaymentStore();

  useEffect(() => {
    if (id) {
      getVehicleById(id);
      fetchPaymentsForVehicle(id);
    }
  }, [id, getVehicleById, fetchPaymentsForVehicle]);

  if (!selectedVehicle || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-800 border-t-primary-500 animate-spin"></div>
      </div>
    );
  }

  const estimate = selectedVehicle.estimate;
  const remaining = selectedVehicle.remaining;
  const totalPaid = selectedVehicle.total_paid;
  
  // Progress bar calculation
  const fillPercentage = estimate > 0 ? (totalPaid / estimate) * 100 : 100;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-24">
      <header className="flex w-full items-center gap-4 p-4 border-b border-gray-900 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display tracking-widest text-primary-500 m-0 leading-none">
          PAYMENT TRACKER
        </h1>
      </header>

      <div className="p-4 space-y-6 animate-fade-in">
        
        {/* Core Vehicle Header */}
        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
           <div>
             <h2 className="text-3xl font-display tracking-widest text-white">{selectedVehicle.number_plate}</h2>
             <p className="text-gray-400 font-sans font-bold text-sm tracking-wide">{selectedVehicle.customer_name}</p>
           </div>
           
           <div className="text-right">
             <p className="font-sans text-xs tracking-widest uppercase text-gray-500 mb-1">{t('intake.estimate', 'Estimate')}</p>
             <p className="font-mono text-2xl font-bold text-white">{formatCurrency(estimate)}</p>
           </div>
        </div>

        {/* Big Progress Bar */}
        <div className="card p-5 relative overflow-hidden">
           <div className="w-full bg-gray-900 h-8 rounded-full overflow-hidden border border-gray-800 relative shadow-inner mb-4">
               <div 
                 className={`h-full transition-all duration-[1s] rounded-full flex items-center justify-end pr-3 bg-gradient-to-r from-primary-600 to-primary-500 shadow-glow`}
                 style={{ width: `${Math.min(fillPercentage, 100)}%` }}
               >
                 {fillPercentage >= 15 && <span className="font-sans text-[10px] font-bold text-white/80">{Math.round(fillPercentage)}%</span>}
               </div>
               
               {/* Marker for remaining */}
               {remaining > 0 && (
                 <div className="absolute top-0 right-0 h-full w-2 bg-red-500 shadow-[0_0_10px_rgba(224,49,49,0.8)] opacity-50 z-10"></div>
               )}
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-3 text-center border border-gray-800/50">
                <p className="text-[10px] text-gray-500 font-sans tracking-widest uppercase mb-1">{t('payment.received', 'Received')}</p>
                <p className="font-mono text-xl text-primary-500 font-bold">{formatCurrency(totalPaid)}</p>
              </div>
              <div className={`rounded-lg p-3 text-center border ${remaining > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                <p className={`text-[10px] font-sans tracking-widest uppercase mb-1 ${remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>{t('payment.remaining', 'Remaining')}</p>
                <p className={`font-mono text-xl font-bold ${remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(remaining)}</p>
              </div>
           </div>
        </div>

        {/* Timeline Log */}
        <div>
           <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-gray-500" />
              <h3 className="font-sans font-bold text-gray-400 tracking-widest uppercase text-sm">Payment History</h3>
           </div>
           
           <div className="relative pl-6 space-y-6">
              {/* Timeline line */}
              <div className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-gray-800"></div>
              
              {payments.map((payment, index) => {
                 const isFirst = index === 0;
                 return (
                   <div key={payment.id} className="relative">
                     {/* Timeline node */}
                     <div className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 bg-gray-950 flex items-center justify-center z-10 ${isFirst && fillPercentage >= 100 ? 'border-green-500 shadow-[0_0_10px_rgba(43,138,62,0.6)]' : 'border-primary-500 shadow-[0_0_10px_rgba(232,89,12,0.4)]'}`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${isFirst && fillPercentage >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}></div>
                     </div>
                     
                     <div className="card p-3 border-gray-800 bg-gray-900/40">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                           <Banknote size={16} className={payment.payment_method === 'cash' ? 'text-green-500' : 'text-blue-400'} />
                           <span className="font-sans text-xs tracking-wider uppercase font-bold text-gray-300">
                             {payment.payment_method}
                           </span>
                         </div>
                         <span className="text-xs text-gray-500 font-mono">
                           {formatRelativeDate(payment.paid_at)}
                         </span>
                       </div>
                       
                       <p className="font-mono text-xl font-bold text-white">
                         {formatCurrency(payment.amount_paid)}
                       </p>
                     </div>
                   </div>
                 );
              })}
              
              {payments.length === 0 && (
                <div className="text-center text-gray-500 font-sans p-6 italic flex flex-col items-center gap-2">
                   <Info size={24} />
                   No payments logged yet
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gray-950/90 backdrop-blur border-t border-gray-900 z-50">
        <button 
          onClick={() => navigate(`/vehicle/${selectedVehicle.id}/add-installment`)} 
          disabled={remaining <= 0}
          className={`btn-primary w-full shadow-glow ${remaining <= 0 ? 'opacity-50 grayscale cursor-not-allowed border-gray-700 bg-gray-800' : ''}`}
        >
          {remaining <= 0 ? (
             <><CheckCircle2 size={24} className="text-green-500"/> FULLY PAID</>
          ) : (
             <><Navigation size={20} /> RECORD INSTALLMENT</>
          )}
        </button>
      </div>
    </div>
  );
}
