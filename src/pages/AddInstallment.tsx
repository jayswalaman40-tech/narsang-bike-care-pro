import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, IndianRupee, Banknote } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { usePaymentStore } from '../store/paymentStore';
import { formatCurrency } from '../utils/formatters';
import type { PaymentMethod } from '../types';

export default function AddInstallment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  
  if (remaining <= 0) {
    navigate(`/vehicle/${id}/tracker`, { replace: true });
    return null;
  }
  
  const amountObj = parseInt(amountStr, 10) || 0;
  const clampedAmount = Math.min(Math.max(amountObj, 0), remaining);

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
          ADD INSTALLMENT
        </h1>
      </header>

      <div className="w-full max-w-md p-4 animate-fade-in flex flex-col gap-6">
        
        {/* Remaining Warning Label */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-xs uppercase tracking-widest font-sans font-bold text-red-500 mb-1">Current Pending Balance</p>
            <p className="text-3xl font-mono text-white text-shadow-sm font-bold">{formatCurrency(remaining)}</p>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
           <label className="input-label ml-0">Paying Now (₹)</label>
           <div className="relative">
             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
             <input 
               type="number" 
               className="input-base pl-12 text-3xl font-mono py-4 bg-gray-950 border-gray-800 focus:border-green-500 focus:ring-green-500 shadow-inner"
               value={amountStr}
               onChange={(e) => setAmountStr(e.target.value)}
               placeholder="0"
               autoFocus
             />
           </div>
           
           <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setAmountStr(remaining.toString())}
                className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-500 font-sans text-sm font-bold py-3 rounded-lg border border-green-800 transition-colors tracking-widest uppercase shadow-[0_0_10px_rgba(43,138,62,0.2)]"
              >
                Clear Full Balance
              </button>
           </div>
        </div>

        {/* Payment Method */}
        <div className="flex gap-3 mt-4">
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
          className={`w-full font-display text-xl tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase shadow-inner-glow disabled:opacity-50 disabled:cursor-not-allowed text-white ${
            isFullPayment ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(43,138,62,0.4)]' : 'bg-primary-500 hover:bg-primary-600 shadow-glow'
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
             <><CheckCircle2 size={24} /> {isFullPayment ? 'CLEAR BALANCE' : 'SAVE INSTALLMENT'}</>
          )}
        </button>
      </div>
    </div>
  );
}
