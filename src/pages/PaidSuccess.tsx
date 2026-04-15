import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

const PaidSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle } = useVehicleStore();

  const v = selectedVehicle;

  return (
    <div className="screen active" id="s-paidsuccess">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
           <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('success.title')}</div>
      </div>

      <div className="cnt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--gnb)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(16,185,129,.2)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="var(--gn)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--dk)', marginBottom: '8px' }}>{t('success.heading')}</h2>
        <p style={{ fontSize: '14px', color: 'var(--sl)', lineHeight: 1.6, marginBottom: '32px' }}>
          Full bill of <strong>₹{v?.estimate}</strong> for <strong>{v?.number_plate}</strong> has been cleared.
        </p>

        <div style={{ padding: '20px', background: 'var(--of)', borderRadius: '16px', border: '1.5px solid var(--lg)', width: '100%', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sl)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--lg)', paddingBottom: '8px' }}>
             Notifications Sent 🚀
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👤</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dk2)' }}>{t('success.wa1', { name: v?.owner_name || v?.customer_name || 'Owner' })}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>👷</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dk2)' }}>{t('success.wa2', { name: v?.customer_name || 'Customer' })}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FDF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🏠</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dk2)' }}>{t('success.wa3')}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 16px', background: '#fff', borderTop: '1px solid var(--of)' }}>
        <button className="btn bo" style={{ background: 'var(--gn)' }} onClick={() => navigate('/dashboard')}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 9 9 3 15 9"/><path d="M9 21V9"/>
          </svg>
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

export default PaidSuccess;
