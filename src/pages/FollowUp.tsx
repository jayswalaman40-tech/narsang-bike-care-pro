import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

const FollowUp: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const pendingVehicles = vehicles.filter(v => 
    v.status === 'done' && v.total_paid < (v.estimate || 0)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkSend = () => {
    if (selectedIds.length === 0) return;
    alert(`Sending bulk WhatsApp to ${selectedIds.length} customers...`);
  };

  return (
    <div className="screen active" id="s-followup">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8590C,#ff7c35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, fontFamily: "'Bebas Neue',cursive" }}>SN</div>
        <div className="hdr-t">{t('nav.followup')}</div>
      </div>

      <div style={{ padding: '16px', background: 'var(--orl)', borderBottom: '1px solid var(--orm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>🔔</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--or)' }}>{t('followup.bulk')}</div>
          <div style={{ fontSize: '11px', color: 'var(--sl)', fontWeight: 600 }}>{t('followup.tip')}</div>
        </div>
      </div>

      <div className="cnt">
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : pendingVehicles.length === 0 ? (
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>🎉</div>
             <div style={{ color: 'var(--sl)', fontSize: '14px', fontWeight: 600 }}>All payments cleared!</div>
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {pendingVehicles.map(v => {
              const remaining = (v.estimate || 0) - (v.total_paid || 0);
              const isSel = selectedIds.includes(v.id);
              
              return (
                <div key={v.id} style={{ padding: '16px', borderBottom: '1px solid var(--of)', display: 'flex', alignItems: 'center', gap: '14px', background: isSel ? 'var(--of)' : '#fff' }}>
                  <div className="tgl" onClick={() => toggleSelect(v.id)}>
                    <input type="checkbox" checked={isSel} readOnly />
                    <span className="tgl-s"></span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dk)', fontFamily: "'Share Tech Mono',monospace" }}>{v.number_plate}</div>
                    <div style={{ fontSize: '11px', color: 'var(--sl)', marginTop: '2px' }}>{v.customer_name} • {v.customer_whatsapp}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--rd)' }}>₹{remaining}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--sl)', textTransform: 'uppercase' }}>pending</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
          <button className="btn wa-btn" onClick={handleBulkSend}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            <span>Send WhatsApp to {selectedIds.length} Selected</span>
          </button>
        </div>
      )}

      <div className="bnav">
        <button className="ni" onClick={() => navigate('/intake')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{t('nav.intake')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/dashboard')}>
           <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span>{t('nav.jobs')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/report')}>
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          <span>{t('nav.report')}</span>
        </button>
        <button className="ni on">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" /></svg>
          <span>{t('nav.followup')}</span>
        </button>
      </div>
    </div>
  );
};

export default FollowUp;
