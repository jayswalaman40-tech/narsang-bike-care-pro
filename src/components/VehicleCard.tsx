import { Banknote, AlertCircle, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import type { VehicleWithPayment } from '../types';

interface VehicleCardProps {
  vehicle: VehicleWithPayment;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const { t } = useTranslation();

  const isDone = vehicle.status === 'done' || vehicle.status === 'paid';
  
  return (
    <div 
      onClick={onClick}
      className={`card relative overflow-hidden transition-transform active:scale-[0.98] cursor-pointer
        ${isDone ? 'border-gray-800' : 'border-gray-700'}`
      }
    >
      {/* Accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDone ? 'bg-green-500' : 'bg-primary-500 shadow-glow'}`}></div>
      
      <div className="p-4 pl-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-2xl tracking-wider text-white">
            {vehicle.number_plate}
          </h3>
          <span className="text-xs font-mono text-gray-500">
            {formatRelativeDate(vehicle.created_at)}
          </span>
        </div>
        
        <p className="font-sans text-gray-400 text-sm mb-3 font-semibold tracking-wide">
          {vehicle.customer_name} • {vehicle.vehicle_type}
        </p>

        {/* Info pills */}
        <div className="flex gap-2 mb-2">
          <div className="bg-gray-900 border border-gray-800 rounded px-2 py-1 flex items-center gap-1.5">
            <Wrench size={14} className="text-gray-500" />
            <span className="text-xs font-mono text-gray-300 truncate max-w-[120px]">
              {vehicle.problem}
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded px-2 py-1 flex items-center gap-1.5 ml-auto">
            <Banknote size={14} className={isDone ? 'text-green-500' : 'text-primary-500'} />
            <span className={`text-xs font-mono font-bold ${isDone ? 'text-green-500' : 'text-primary-500'}`}>
              {formatCurrency(vehicle.estimate)}
            </span>
          </div>
        </div>

        {/* Payment Warning (if done but not fully paid) */}
        {vehicle.status === 'done' && vehicle.remaining > 0 && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded px-2 py-1.5 flex flex-row items-center gap-2">
             <AlertCircle size={14} className="text-red-500 shrink-0" />
             <span className="text-xs font-sans font-bold text-red-500 uppercase tracking-widest">
               {t('dashboard.pending', 'Pending')}: {formatCurrency(vehicle.remaining)}
             </span>
          </div>
        )}
      </div>
    </div>
  );
}
