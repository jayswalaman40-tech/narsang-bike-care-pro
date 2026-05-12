import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import { sendWhatsAppNotification } from '../utils/whatsapp';

const generateDoneMessage = (name: string, plate: string, cost: number) => {
  return `✅ *Gaadi Tayaar Hai!*\nNamaste ${name} ji! 🙏\n${plate} tayyaar ho gayi!\n💰 Total: ₹${cost}\n\n— *Shri Narsang Bike Care* 🛵`;
};

const ConfirmDone: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, markAsDone } = useVehicleStore();
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id, getVehicleById]);

  if (!selectedVehicle) {
    return <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const v = selectedVehicle;

  const handleSendAndMarkDone = async () => {
    if (isSending) return;
    setIsSending(true);
    setError(null);
    try {
      if (id) {
        await markAsDone(id);
        await sendWhatsAppNotification(id, 'mark as done');
        navigate('/wa-sent');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error marking as done');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="screen active" id="s-confirm-done">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('nav.jobs', 'Complete Job')}</div>
      </div>
      
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

          {error && (
            <div style={{ margin: '0 20px 10px', background: 'var(--rdb)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: 'var(--rdt)' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="wam" style={{ margin: '0 20px 16px' }}>
            <div className="waf">Preview — Shri Narsang Bike Care</div>
            <div className="wab" style={{ whiteSpace: 'pre-wrap' }}>
              {generateDoneMessage(v.customer_name, v.number_plate, v.estimate || 0)}
            </div>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn bo" onClick={handleSendAndMarkDone} disabled={isSending}>
              {isSending ? 'Saving...' : t('done.send')}
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
