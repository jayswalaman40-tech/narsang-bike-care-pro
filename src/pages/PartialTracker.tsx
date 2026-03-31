import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

const PartialTracker: React.FC = () => {
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
  const estimate = v.estimate || 0;
  const totalPaid = v.total_paid || 0;
  const remaining = estimate - totalPaid;
  const progressPercent = estimate > 0 ? (totalPaid / estimate) * 100 : 0;

  return (
    <div className="screen active" id="s-tracker">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${v.id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('tracker.title')}</div>
        <button className="sm bo" onClick={() => navigate(`/vehicle/${v.id}/add-installment`)}>
          <span>{t('btn.addkisat')}</span>
        </button>
      </div>

      <div className="cnt">
        <div style={{ padding: '20px 16px', background: 'var(--of)', borderBottom: '1px solid var(--lg)' }}>
          <div style={{ display: 'flex', justifySelf: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sl)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{t('tracker.progress')}</div>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="60" cy="60" r="54" stroke="var(--lg)" strokeWidth="8" fill="none" />
                <circle cx="60" cy="60" r="54" stroke="var(--or)" strokeWidth="8" fill="none" strokeDasharray={`${(progressPercent * 3.39).toFixed(0)} 339`} strokeLinecap="round" />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontFamily: "'Bebas Neue',cursive", color: 'var(--dk)', lineHeight: 1 }}>{Math.round(progressPercent)}%</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--sl)' }}>PAID</div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <div className="st" style={{ borderLeft: '3px solid var(--gn)', background: '#fff' }}>
              <div style={{ fontSize: '10px', color: 'var(--sl)', fontWeight: 700 }}>RECEIVED</div>
              <div style={{ fontSize: '20px', fontFamily: "'Bebas Neue',cursive", color: 'var(--gn)' }}>₹{totalPaid}</div>
            </div>
            <div className="st" style={{ borderLeft: '3px solid var(--rd)', background: '#fff' }}>
              <div style={{ fontSize: '10px', color: 'var(--sl)', fontWeight: 700 }}>REMAINING</div>
              <div style={{ fontSize: '20px', fontFamily: "'Bebas Neue',cursive", color: 'var(--rd)' }}>₹{remaining}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '14px', fontFamily: "'Bebas Neue',cursive", color: 'var(--or)', letterSpacing: '2px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t('tracker.history')}
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,var(--orm),transparent)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(v.payments || []).map((p, idx) => (
              <div key={p.id} className="cf" style={{ background: '#fff', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--lg)', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dk)' }}>Installment #{idx + 1}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gn)' }}>₹{p.amount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--sl)' }}>
                  <div>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'} • {p.payment_method}</div>
                  <div style={{ color: 'var(--bl)', fontWeight: 700 }}>Sent 📱</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        <button className="btn bo" onClick={() => navigate(`/vehicle/${v.id}/add-installment`)}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>{t('btn.addkisat')}</span>
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

export default PartialTracker;
