import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

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
    <div className="screen active" id="s-detail">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/dashboard')}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('detail.title')}</div>
        <button className="sm bo" onClick={() => navigate(`/vehicle/${v.id}/edit`)}>
          <span>{t('btn.edit')}</span>
        </button>
      </div>

      <div className="cnt">
        <div style={{ padding: '20px 16px', background: 'var(--of)', borderBottom: '1px solid var(--lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#fff', border: '1.5px solid var(--lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {v.vehicle_type === 'Bike' ? '🏍️' : '🛵'}
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dk)', fontFamily: "'Share Tech Mono',monospace", letterSpacing: '1px' }}>{v.number_plate}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--or)', textTransform: 'uppercase' }}>{v.vehicle_type}</div>
            </div>
          </div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.customer')}</div>
          <div className="iv">
            <div style={{ fontWeight: 700 }}>{v.customer_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--sl)', marginTop: '2px' }}>+91 {v.customer_whatsapp}</div>
          </div>
        </div>

        {v.owner_name && v.owner_name !== v.customer_name && (
          <div className="ir">
            <div className="il">{t('lbl.owner')}</div>
            <div className="iv">
              <div style={{ fontWeight: 700 }}>{v.owner_name}</div>
              <div style={{ fontSize: '12px', color: 'var(--sl)', marginTop: '2px' }}>+91 {v.owner_whatsapp}</div>
            </div>
          </div>
        )}

        <div className="ir hi">
          <div className="il">{t('lbl.problem')}</div>
          <div className="iv">{v.problem}</div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.estimate')}</div>
          <div className="iv" style={{ fontWeight: 800, fontSize: '16px', color: 'var(--dk)' }}>₹{v.estimate}</div>
        </div>

        <div className="ir">
          <div className="il">{t('lbl.delivery')}</div>
          <div className="iv">{v.delivery_by}</div>
        </div>

        <div style={{ padding: '24px 16px' }}>
          <div className="wam wam-o">
            <div className="waf waf-o">{t('wa.sent')}</div>
            <div className="wab">
              Vehicle Registered: {v.number_plate}<br/>
              Problem: {v.problem}<br/>
              Est cost: ₹{v.estimate}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)', display: 'flex', gap: '10px' }}>
        {!isDone ? (
          <button className="btn bo" style={{ flex: 1 }} onClick={handleMarkDone}>
            <span>{t('btn.markdone')}</span>
          </button>
        ) : !isPaid ? (
          <button className="btn bo" style={{ flex: 1, background: '#25D366' }} onClick={() => navigate(`/vehicle/${v.id}/payment`)}>
            <span>{t('btn.payment')}</span>
          </button>
        ) : (
          <button className="btn bw" style={{ flex: 1, opacity: 0.5 }}>
            <span>{t('btn.success')}</span>
          </button>
        )}
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

export default CardDetail;
