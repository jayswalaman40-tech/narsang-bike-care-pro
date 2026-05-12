import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import BottomNav from '../components/BottomNav';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, isLoading } = useVehicleStore();

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id, getVehicleById]);

  if (isLoading || !selectedVehicle) {
    return <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const v = selectedVehicle;
  const isDone = v.status === 'done' || v.status === 'paid';
  const isPaid = v.status === 'paid' || v.total_paid >= (v.estimate || 0);

  const handleMarkDone = async () => {
    if (id) {
      navigate(`/confirm-done/${id}`);
    }
  };

  return (
    <div className="screen active" id="s-card-detail">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('detail.title')}</div>
        <button className="sm bo" onClick={() => navigate(`/vehicle/${v.id}/edit`)}>
          {t('btn.edit')}
        </button>
      </div>

      <div className="cnt">
        <div className="ir hi">
          <div className="il">{t('lbl.vehicle', 'Vehicle')}</div>
          <div className="iv">
            <div style={{ fontWeight: 700 }}>{v.number_plate}</div>
            <div style={{ fontSize: '12px', color: 'var(--sl)' }}>{v.vehicle_type}</div>
          </div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.customer')}</div>
          <div className="iv">
            <div style={{ fontWeight: 700 }}>{v.customer_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--sl)' }}>+91 {v.customer_whatsapp}</div>
          </div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.problem')}</div>
          <div className="iv">{v.problem}</div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.estimate')}</div>
          <div className="iv">
            <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--dk)' }}>₹{v.estimate}</div>
            {v.total_paid > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--sl)', marginTop: '4px' }}>
                Paid: ₹{v.total_paid} • <span style={{ color: 'var(--or)', fontWeight: 600 }}>Remaining: ₹{v.remaining}</span>
              </div>
            )}
          </div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.delivery')}</div>
          <div className="iv">{v.delivery_by}</div>
        </div>

        <div style={{ padding: '24px 16px' }}>
          <div className="wam wam-o">
            <div className="waf waf-o">{t('wa.sent', 'WhatsApp Sent Confirmation')}</div>
            <div className="wab">
              Vehicle: {v.number_plate} registered. Problem: {v.problem}. Est: ₹{v.estimate}. Team Nursing Bike Care.
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        {!isDone ? (
          <button className="btn bo" onClick={handleMarkDone}>
            {t('btn.markdone')}
          </button>
        ) : !isPaid ? (
          <button className="btn bo" style={{ background: '#25D366' }} onClick={() => navigate(`/vehicle/${v.id}/payment`)}>
            {t('btn.payment')} 💰
          </button>
        ) : (
          <button className="btn bw" style={{ opacity: 0.5 }} disabled>
            {t('btn.success')}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CardDetail;
