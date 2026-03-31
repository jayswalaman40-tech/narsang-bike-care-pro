import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, IndianRupee, Banknote, Droplet } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { usePaymentStore } from '../store/paymentStore';
import { formatCurrency } from '../utils/formatters';
import type { PaymentMethod } from '../types';

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { getVehicleById, selectedVehicle } = useVehicleStore();
  const { addPayment, isLoading } = usePaymentStore();

  const [amountStr, setAmountStr] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) getVehicleById(id);
  }, [id, getVehicleById]);

  if (!selectedVehicle) {
     return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  const estimate = selectedVehicle.estimate;
  const remaining = selectedVehicle.remaining;
  
  // If no params, default remaining is estimate
  const amountObj = parseInt(amountStr, 10) || 0;
  
  // Progress bar logic
  const clampedAmount = Math.min(Math.max(amountObj, 0), remaining);
  const fillPercentage = remaining > 0 ? (clampedAmount / remaining) * 100 : 100;

  const isFullPayment = clampedAmount >= remaining;

  const handleSave = async () => {
    if (clampedAmount <= 0) {
      setErrorMsg("Please enter a valid amount");
      return;
    }

    try {
      await addPayment({
        vehicle_id: selectedVehicle.id,
        amount_paid: clampedAmount,
        total_amount: estimate,
        payment_type: isFullPayment ? 'full' : 'partial',
        payment_method: method,
        note: null
      });

      if (isFullPayment) {
        navigate(`/wa-full`, { state: { vehicle: selectedVehicle, amount: clampedAmount } });
      } else {
        navigate(`/wa-partial`, { state: { vehicle: selectedVehicle, amount: clampedAmount } });
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to save payment");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-24 flex flex-col items-center">
      <header className="flex w-full items-center gap-4 p-4 border-b border-gray-900 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display tracking-widest text-primary-500 m-0 leading-none">
          {t('common.payment', 'RECORD PAYMENT')}
        </h1>
      </header>

      <div className="w-full max-w-md p-4 animate-fade-in flex flex-col gap-6">
        {/* Summary Card */}
        <div className="card p-5 text-center shadow-card border-t border-t-gray-800">
           <h2 className="font-display text-4xl text-white tracking-wider mb-1">{selectedVehicle.number_plate}</h2>
           <p className="font-sans text-gray-400 font-bold mb-4">{selectedVehicle.customer_name}</p>
           
           <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
             <div>
               <p className="text-xs text-gray-500 uppercase tracking-widest font-sans mb-1">{t('intake.estimate', 'Estimate')}</p>
               <p className="font-mono text-xl text-white">{formatCurrency(estimate)}</p>
             </div>
             <div>
               <p className="text-xs text-red-500 uppercase tracking-widest font-sans font-bold mb-1">{t('payment.remaining', 'Remaining')}</p>
               <p className="font-mono text-xl text-red-500">{formatCurrency(remaining)}</p>
             </div>
           </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
           <label className="input-label ml-0">{t('payment.amount_received', 'Amount Received (₹)')}</label>
           <div className="relative">
             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
             <input 
               type="number" 
               className="input-base pl-12 text-3xl font-mono py-4 bg-gray-950 border-gray-800 shadow-inner"
               value={amountStr}
               onChange={(e) => setAmountStr(e.target.value)}
               placeholder="0"
               autoFocus
             />
           </div>
           
           {/* Quick Fill Buttons */}
           <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setAmountStr(remaining.toString())}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-sans text-sm py-2 rounded-lg border border-gray-700 transition-colors"
              >
                {t('payment.full', 'Full Amount')}
              </button>
              <button 
                onClick={() => setAmountStr(Math.round(remaining / 2).toString())}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-sans text-sm py-2 rounded-lg border border-gray-700 transition-colors"
              >
                50%
              </button>
           </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-900 h-6 rounded-full overflow-hidden border border-gray-800 relative shadow-inner">
           <div 
             className={`h-full transition-all duration-500 rounded-full flex items-center justify-end pr-2 ${
               isFullPayment ? 'bg-green-500 shadow-[0_0_15px_rgba(43,138,62,0.8)]' : 'bg-primary-500 shadow-glow'
             }`}
             style={{ width: `${Math.min(fillPercentage, 100)}%` }}
           >
             {fillPercentage > 15 && <Droplet size={12} className="text-white/50" fill="currentColor" />}
           </div>
        </div>
        
        <p className="text-center font-sans font-bold uppercase tracking-widest text-sm text-gray-400 -mt-3">
          {isFullPayment ? <span className="text-green-500">{t('payment.full_payment', 'FULL PAYMENT')}</span> : <span className="text-primary-500">{t('payment.partial', 'PARTIAL PAYMENT')}</span>}
        </p>

        {/* Payment Method */}
        <div className="flex gap-3 mt-2">
           <button 
             onClick={() => setMethod('upi')}
             className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
               method === 'upi' ? 'bg-primary-500/20 border-primary-500 text-primary-500' : 'bg-gray-900 border-gray-800 text-gray-500'
             }`}
           >
              <span className="font-display text-xl mb-1 tracking-widest">UPI</span>
              <span className="text-xs uppercase font-sans tracking-wider">Online</span>
           </button>
           <button 
             onClick={() => setMethod('cash')}
             className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
               method === 'cash' ? 'bg-primary-500/20 border-primary-500 text-primary-500' : 'bg-gray-900 border-gray-800 text-gray-500'
             }`}
           >
              <Banknote size={24} className="mb-1" />
              <span className="text-xs uppercase font-sans tracking-wider">Cash</span>
           </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center font-bold font-sans">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gray-950/90 backdrop-blur border-t border-gray-900 z-50">
        <button 
          onClick={handleSave} 
          disabled={isLoading || clampedAmount <= 0}
          className="btn-primary w-full shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
            <><CheckCircle2 size={24} /> {t('common.save', 'SAVE RECORD')}</>
          )}
        </button>
      </div>
    </div>
  );
}
