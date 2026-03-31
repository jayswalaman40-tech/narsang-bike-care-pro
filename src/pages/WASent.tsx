import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

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
    <div className="screen active" id="s-wasent" style={{ background: '#fff' }}>
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
           <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('wasent.title')}</div>
      </div>

      <div className="cnt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dk)', marginBottom: '12px' }}>{t('wasent.heading')}</h2>
        <p style={{ fontSize: '14px', color: 'var(--sl)', lineHeight: 1.6, marginBottom: '32px' }}>
          {t('wasent.sub')}
        </p>

        <div style={{ padding: '20px', background: 'var(--of)', borderRadius: '16px', border: '1.5px solid var(--lg)', width: '100%', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sl)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Message Preview</div>
          <div className="wam wam-o" style={{ textAlign: 'left', marginBottom: 0 }}>
            <div className="waf waf-o">WhatsApp to {selectedVehicle?.customer_name}</div>
            <div className="wab">
              Vehicle Ready: {selectedVehicle?.number_plate}<br/>
              Bill: ₹{selectedVehicle?.estimate}<br/>
              Please collect from Shri Narsang Bike Care.
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--sl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--or)' }}>
            {countdown}
          </div>
          <span>{t('wasent.undo')}</span>
        </div>
      </div>

      <div style={{ padding: '24px 16px', background: '#fff', borderTop: '1px solid var(--of)' }}>
        <button className="btn bw" onClick={handleUndo}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dk)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          <span>{t('btn.undo')}</span>
        </button>
        <button className="btn bo" style={{ marginTop: '12px' }} onClick={() => navigate('/dashboard')}>
          <span>{t('btn.backdash')}</span>
        </button>
      </div>

      <div className="bnav">
        <button className="ni" onClick={() => navigate('/intake')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{t('nav.intake')}</span>
        </button>
        <button className="ni on" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span>{t('nav.jobs')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/report')}>
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          <span>{t('nav.report')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/follow-up')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" /></svg>
          <span>{t('nav.followup')}</span>
        </button>
      </div>
    </div>
  );
};

export default WASent;
