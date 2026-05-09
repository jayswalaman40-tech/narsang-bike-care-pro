import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import { sendWhatsAppNotification, generateDoneMessage } from '../utils/whatsapp';

const ConfirmDone: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, markAsDone } = useVehicleStore();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id, getVehicleById]);

  if (!selectedVehicle) {
    return <div className="screen active">Loading...</div>;
  }

  const v = selectedVehicle;

  const handleSendAndMarkDone = async () => {
    if (isSending) return;
    setIsSending(true);
    try {
      if (id) {
        // 1. Mark as done in DB
        await markAsDone(id);
        
        // 2. Trigger WhatsApp via Edge Function
        await sendWhatsAppNotification(id, 'mark_as_done');
        
        // 3. Navigate away
        navigate('/wa-sent');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="screen active">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('nav.jobs')}</div>
      </div>
      
      {/* Background blurred card */}
      <div style={{ flex: 1, opacity: 0.4, pointerEvents: 'none', padding: '12px' }}>
        <div className="card rl" style={{ margin: 0 }}>
          <div className="ch">
            <div>
              <div className="vn">{v.number_plate}</div>
              <div className="cn">{v.customer_name}</div>
            </div>
            <span className="badge br">{t('badge.repair', 'In Repair')}</span>
          </div>
        </div>
      </div>

      {/* Overlay Modal */}
      <div className="ov show">
        <div className="dlg">
          <div className="dlg-h"></div>
          <div style={{ fontSize: '34px', textAlign: 'center', marginBottom: '8px' }}>📱</div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--dk)', padding: '0 20px 4px' }}>
            {t('done.title', 'Send WhatsApp?')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--sl)', padding: '0 20px 12px' }}>
             {v.customer_name} ko message jayega: +91 {v.customer_whatsapp}
          </div>
          <div className="wam" style={{ margin: '0 20px 16px' }}>
            <div className="waf">🔧 Preview — Shri Narsang Bike Care</div>
            <div className="wab" style={{ whiteSpace: 'pre-wrap' }}>
              {generateDoneMessage(v.customer_name, v.number_plate, v.estimate || 0)}
            </div>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn bo" onClick={handleSendAndMarkDone} disabled={isSending}>
              {isSending ? 'Saving...' : '✅ Yes Send — Mark as Done'}
            </button>
            <button className="btn bw" onClick={() => navigate(`/vehicle/${id}`)} disabled={isSending}>
              {t('btn.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDone;
