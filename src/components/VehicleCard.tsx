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

  const isDone = vehicle.status === 'done';
  const isPaid = vehicle.total_paid >= (vehicle.estimate || 0);
  const isPartial = vehicle.total_paid > 0 && !isPaid;

  let borderColorClass = 'rl'; // Default to Red for 'In Repair'
  let badgeClass = 'br';
  let badgeText = t('badge.repair');

  if (isDone) {
    if (isPaid) {
      borderColorClass = 'gl';
      badgeClass = 'bp';
      badgeText = t('dash.done');
    } else if (isPartial) {
      borderColorClass = 'yl';
      badgeClass = 'by';
      badgeText = t('badge.partial');
    } else {
      borderColorClass = 'rl';
      badgeClass = 'br';
      badgeText = t('dash.done'); // Done but not paid
    }
  }

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) onAction(e, vehicle.id);
  };

  return (
    <div className={`card ${borderColorClass}`} onClick={() => onClick(vehicle.id)} style={{ position: 'relative' }}>
      <div className="ch">
        <div style={{ flex: 1 }}>
          <div className="vn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{vehicle.vehicle_type === 'Bike' ? '🏍️' : '🛵'}</span>
            <span style={{ borderBottom: '2px solid var(--orm)' }}>{vehicle.number_plate}</span>
          </div>
          <div className="cn">
            <span style={{ color: 'var(--dk2)' }}>{vehicle.customer_name}</span>
            <span style={{ margin: '0 6px', opacity: 0.3 }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--sl)' }}>{vehicle.customer_whatsapp}</span>
          </div>
        </div>
        <div className={`badge ${badgeClass}`} style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}>{badgeText}</div>
      </div>
      <div className="cb" style={{ background: 'var(--of)', margin: '0 12px 12px', borderRadius: '12px', padding: '12px' }}>
        <div className="cp" style={{ fontWeight: 600, color: 'var(--dk2)', marginBottom: '10px', fontSize: '13px' }}>
           {vehicle.problem}
        </div>
        <div className="cm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mi" style={{ fontWeight: 700, color: 'var(--sl)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px' }}>💰</span> ₹{vehicle.estimate}
          </div>
          <div className="mi" style={{ fontWeight: 700, color: 'var(--or)', fontSize: '11px', background: 'var(--orl)', padding: '3px 8px', borderRadius: '6px' }}>
            🕒 {vehicle.delivery_by}
          </div>
        </div>
      </div>
      <div className="ca" style={{ padding: '0 16px 16px', gap: '10px' }}>
        {!isDone && (
          <button className="sm bo" onClick={handleAction} style={{ flex: 1, padding: '12px' }}>
            <span>{t('btn.markdone')}</span>
          </button>
        )}
        {isDone && !isPaid && (
          <button className="sm bo" onClick={handleAction} style={{ flex: 1, padding: '12px', background: '#25D366', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)' }}>
            <span>{t('btn.payment')}</span>
          </button>
        )}
        {isDone && isPaid && (
          <button className="sm bw" style={{ flex: 1, padding: '12px', opacity: 0.6, background: 'var(--of)' }}>
            <span>{t('btn.success')}</span>
          </button>
        )}
        <button className="sm bw" style={{ width: '44px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
