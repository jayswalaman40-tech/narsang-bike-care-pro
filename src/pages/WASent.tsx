import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import BottomNav from '../components/BottomNav';

const WASent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, updateVehicle } = useVehicleStore();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUndo = async () => {
    if (selectedVehicle) {
      await updateVehicle(selectedVehicle.id, { status: 'in_repair' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="screen active" id="s-wa-sent">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
           <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('wasent.title', 'Message Sent')}</div>
      </div>

      <div className="cnt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dk)', marginBottom: '12px' }}>{t('wasent.heading')}</h2>
        <p style={{ fontSize: '14px', color: 'var(--sl)', lineHeight: 1.6, marginBottom: '32px' }}>
          {t('wasent.sub', { name: selectedVehicle?.customer_name || 'Customer' })}
        </p>

        <div style={{ width: '100%', padding: '24px 0' }}>
          <button className="btn bo" onClick={() => navigate('/dashboard')}>
            {t('btn.backdash')}
          </button>
          
          <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--sl)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--or)' }}>
              {countdown}
            </div>
            <span onClick={handleUndo} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{t('wasent.undo')}</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WASent;
