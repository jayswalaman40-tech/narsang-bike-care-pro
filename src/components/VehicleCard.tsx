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
    <div className={`card ${borderColorClass}`} onClick={() => onClick(vehicle.id)}>
      <div className="ch">
        <div style={{ flex: 1 }}>
          <div className="vn">{vehicle.vehicle_type === 'Bike' ? '🏍️' : '🛵'} {vehicle.number_plate}</div>
          <div className="cn">{vehicle.customer_name} • {vehicle.customer_whatsapp}</div>
        </div>
        <div className={`badge ${badgeClass}`}>{badgeText}</div>
      </div>
      <div className="cb">
        <div className="cp">{vehicle.problem}</div>
        <div className="cm">
          <div className="mi">💰 {t('lbl.estimate')}: ₹{vehicle.estimate}</div>
          <div className="mi">🕒 {vehicle.delivery_by}</div>
        </div>
      </div>
      <div className="ca">
        {!isDone && (
          <button className="sm bo" onClick={handleAction}>
            <span>{t('btn.markdone')}</span>
          </button>
        )}
        {isDone && !isPaid && (
          <button className="sm bo" onClick={handleAction} style={{ background: '#25D366' }}>
            <span>{t('btn.payment')}</span>
          </button>
        )}
        {isDone && isPaid && (
          <button className="sm bw" style={{ opacity: 0.7 }}>
            <span>{t('btn.success')}</span>
          </button>
        )}
        <button className="sm bw">
          <span>{t('btn.edit')}</span>
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
