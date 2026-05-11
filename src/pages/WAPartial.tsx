import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import BottomNav from '../components/BottomNav';

const WAPartial: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle } = useVehicleStore();

  const v = selectedVehicle;
  const estimate = v?.estimate || 0;
  const paid = v?.total_paid || 0;
  const remaining = estimate - paid;

  return (
    <div className="screen active" id="s-wapartial">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
           <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('wa.sent', 'WhatsApp Sent')}</div>
      </div>

      <div className="cnt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center', paddingBottom: '200px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--orl)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="var(--or)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dk)', marginBottom: '12px' }}>Partial Payment Saved!</h2>
        <p style={{ fontSize: '14px', color: 'var(--sl)', lineHeight: 1.6, marginBottom: '32px' }}>
           Payment recorded. <strong>₹{remaining}</strong> is still pending.
        </p>

        <div style={{ padding: '20px', background: 'var(--of)', borderRadius: '16px', border: '1.5px solid var(--lg)', width: '100%', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sl)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>WhatsApp Preview</div>
          <div className="wam wam-o" style={{ textAlign: 'left', marginBottom: 0 }}>
            <div className="waf waf-o">WhatsApp to {v?.customer_name}</div>
            <div className="wab">
              Payment Received: ₹{paid}<br/>
              Remaining: ₹{remaining}<br/>
              Vehicle: {v?.number_plate}<br/>
              Thank you!
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '24px 16px', background: '#fff', borderTop: '1px solid var(--of)' }}>
        <button className="btn bo" onClick={() => navigate(`/vehicle/${v?.id}/tracker`)}>
          <span>{t('btn.tracker')}</span>
        </button>
        <button className="btn bw" style={{ marginTop: '12px' }} onClick={() => navigate('/dashboard')}>
          <span>{t('btn.backdash')}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default WAPartial;
