import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit2, Phone, CheckCircle2, Navigation } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getVehicleById, selectedVehicle: vehicle, isLoading } = useVehicleStore();
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);

  useEffect(() => {
    if (id) getVehicleById(id);
  }, [id, getVehicleById]);

  if (isLoading || !vehicle) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-800 border-t-primary-500 animate-spin"></div>
      </div>
    );
  }

  const isDone = vehicle.status === 'done' || vehicle.status === 'paid';

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-24 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none transition-colors duration-1000 ${
        isDone ? 'bg-green-500' : 'bg-primary-500'
      }`}></div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-900 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <div className={`badge ${isDone ? 'badge-done' : 'badge-repair'} text-sm px-3 py-1.5`}>
          {isDone ? <><CheckCircle2 size={16}/> {t('dashboard.done_today', 'DONE')}</> : t('dashboard.in_repair', 'IN REPAIR')}
        </div>
      </header>

      <div className="p-4 space-y-6 animate-fade-in relative z-10">
        
        {/* Main Number Plate Header */}
        <div className="text-center">
          <div className="inline-block bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] px-6 py-4 rounded-xl border-2 border-dashed border-gray-800 shadow-card">
             <h1 className="text-4xl font-display tracking-widest text-white text-shadow-sm uppercase">
               {vehicle.number_plate}
             </h1>
          </div>
          <p className="font-sans text-gray-400 mt-2 font-bold tracking-wide">
             {vehicle.vehicle_type} • {formatRelativeDate(vehicle.created_at)}
          </p>
        </div>

        {/* Info Rows */}
        <div className="card divide-y divide-gray-800 border border-gray-800 mb-6 shadow-card overflow-hidden">
          
          <div className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
            <div>
              <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mb-1">{t('intake.customer_name', 'Customer')}</p>
              <p className="text-lg font-bold text-white">{vehicle.customer_name}</p>
              <p className="text-sm font-mono text-gray-400 mt-1 flex items-center gap-1">
                <Phone size={12}/> {vehicle.customer_whatsapp}
              </p>
            </div>
            <a href={`tel:${vehicle.customer_whatsapp}`} className="bg-gray-800 p-3 rounded-full text-primary-500 hover:bg-gray-700 active:scale-95 transition-transform"><Phone size={20}/></a>
          </div>

          {vehicle.owner_name && (
            <div className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors bg-gray-900/40">
              <div>
                <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mb-1">{t('intake.owner_name', 'Owner')}</p>
                <p className="text-lg font-bold text-white">{vehicle.owner_name}</p>
                <p className="text-sm font-mono text-gray-400 mt-1 flex items-center gap-1">
                  <Phone size={12}/> {vehicle.owner_whatsapp}
                </p>
              </div>
              <a href={`tel:${vehicle.owner_whatsapp}`} className="bg-gray-800 p-3 rounded-full text-gray-400 hover:bg-gray-700 active:scale-95 transition-transform"><Phone size={20}/></a>
            </div>
          )}

          <div className="p-4 bg-gray-900/20">
            <p className="text-xs text-gray-500 font-sans tracking-widest uppercase mb-2">{t('intake.problem', 'Problem')}</p>
            <p className="text-base text-gray-300 font-mono bg-gray-950 p-3 rounded-lg border border-gray-800/50">
              {vehicle.problem}
            </p>
          </div>

          <div className="p-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-sans tracking-widest uppercase">{t('intake.estimate', 'Estimate')}</p>
            <p className={`text-2xl font-mono font-bold ${isDone ? 'text-green-500' : 'text-primary-500'}`}>
              {formatCurrency(vehicle.estimate)}
            </p>
          </div>

          {isDone && (
            <div className={`p-4 flex items-center justify-between ${vehicle.remaining > 0 ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <p className={`text-xs font-sans tracking-widest uppercase font-bold ${vehicle.remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {t('payment.remaining', 'Remaining')}
              </p>
              <p className={`text-xl font-mono font-bold ${vehicle.remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(vehicle.remaining)}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gray-950/90 backdrop-blur border-t border-gray-900 z-30 flex gap-3">
        {!isDone ? (
          <>
            <button 
              onClick={() => navigate(`/vehicle/${vehicle.id}/edit`)} 
              className="btn-secondary flex-1 shadow-card"
            >
              <Edit2 size={20} /> <span className="hidden sm:inline">{t('common.edit', 'EDIT')}</span>
            </button>
            <button 
              onClick={() => setShowDoneConfirm(true)} 
              className="btn-primary flex-[2] bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(43,138,62,0.4)]"
            >
              <CheckCircle2 size={24} /> {t('detail.mark_done', 'MARK DONE')}
            </button>
          </>
        ) : (
           <button 
              onClick={() => navigate(`/vehicle/${vehicle.id}/payment`)} 
              className="btn-primary w-full"
            >
              <Navigation size={20} /> {t('common.payment', 'RECEIVE PAYMENT')}
            </button>
        )}
      </div>

      {/* Placeholder for Bottom Sheet component which will be added in Phase 2 */}
      {showDoneConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
             <div className="bg-gray-900 w-full max-w-md rounded-t-3xl border-t border-gray-800 p-6 animate-slide-up">
                 <h2 className="text-2xl font-display text-white tracking-widest mb-4 border-b border-gray-800 pb-4">Confirm Mark Done?</h2>
                 <p className="text-gray-400 font-sans mb-6 text-xl">
                   This will open WhatsApp and send messages to the Custom and Owner. Are you sure the vehicle {vehicle.number_plate} is ready?
                 </p>
                 <div className="flex gap-3">
                   <button onClick={() => setShowDoneConfirm(false)} className="btn-secondary flex-1">Cancel</button>
                   <button 
                     onClick={async () => {
                        await useVehicleStore.getState().markAsDone(vehicle.id);
                        navigate('/wa-sent', { state: { vehicle } });
                     }} 
                     className="btn-primary flex-1 bg-green-600 hover:bg-green-500">Confirm</button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
}
