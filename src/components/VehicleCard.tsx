import React from 'react';
import { useTranslation } from 'react-i18next';
import type { VehicleWithPayment } from '../types';

interface VehicleCardProps {
  vehicle: VehicleWithPayment;
  onClick: (id: string) => void;
  onAction?: (e: React.MouseEvent, id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick, onAction }) => {
  const { t } = useTranslation();

  const isDone = vehicle.status === 'done' || vehicle.status === 'paid';
  const isPaid = vehicle.status === 'paid' || vehicle.total_paid >= (vehicle.estimate || 0);
  const isPartial = vehicle.total_paid > 0 && !isPaid;

  let borderColorClass = '';
  let badgeClass = '';
  let badgeText = '';

  if (!isDone) {
    borderColorClass = 'rl';
    badgeClass = 'br';
    badgeText = t('badge.repair');
  } else if (isPaid) {
    borderColorClass = 'gl';
    badgeClass = 'bd';
    badgeText = t('dash.done');
  } else if (isPartial) {
    borderColorClass = 'yl';
    badgeClass = 'by';
    badgeText = t('badge.partial');
  } else {
    borderColorClass = 'yl';
    badgeClass = 'by';
    badgeText = 'Ready';
  }

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) onAction(e, vehicle.id);
  };

  return (
    <div className={`card ${borderColorClass}`} onClick={() => onClick(vehicle.id)}>
      <div className="ch">
        <div>
          <div className="vn">{vehicle.number_plate}</div>
          <div className="cn">{vehicle.customer_name}</div>
        </div>
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
      </div>
      
      <div className="cb">
        <div className="cp">{vehicle.problem}</div>
        <div className="cm">
          <span className="mi">🕒 {vehicle.delivery_by}</span>
          <span className="mi">
            {isPartial ? (
              <span style={{ color: 'var(--or)' }}>Pending: ₹{vehicle.remaining}</span>
            ) : (
              `₹${vehicle.estimate}`
            )}
          </span>
          {isPartial && <span className="mi" style={{ color: 'var(--rd)', fontWeight: 600 }}>⚠️ Partial</span>}
        </div>
      </div>

      <div className="ca">
        {!isDone ? (
          <button className="btn bo" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={handleAction}>
            {t('btn.markdone')}
          </button>
        ) : !isPaid ? (
          <button className="btn bo" style={{ flex: 1, padding: '10px', fontSize: '13px' }} onClick={handleAction}>
            {t('btn.payment')} 💰
          </button>
        ) : (
          <button className="sm" style={{ flex: 1, justifyContent: 'center', background: 'var(--of)', color: 'var(--sl)' }}>
            {t('btn.success')}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
