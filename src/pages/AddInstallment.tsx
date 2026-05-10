import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import { usePaymentStore } from '../store/paymentStore';
import { sendWhatsAppNotification } from '../utils/whatsapp';
import BottomNav from '../components/BottomNav';

const AddInstallment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById } = useVehicleStore();
  const { addPayment } = usePaymentStore();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'bank'>('cash');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) getVehicleById(id);
  }, [id, getVehicleById]);

  if (!selectedVehicle) return <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  const v = selectedVehicle;
  const estimate = v.estimate || 0;
  const alreadyPaid = v.total_paid || 0;
  const remaining = estimate - alreadyPaid;

  const handleSave = async () => {
    if (isSaving) return;
    const val = Number(amount);
    if (!val || val <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setIsSaving(true);
    try {
      if (!v.id) throw new Error("Vehicle ID missing");

      await addPayment({
        vehicle_id: v.id,
        amount_paid: val,
        payment_method: method,
        note: `Installment for ${v.number_plate}`,
        total_amount: estimate,
        payment_type: val >= remaining ? 'full' : 'partial'
      });

      const paymentEvent = val >= remaining ? 'full_payment' : 'partial_payment';
      await sendWhatsAppNotification(v.id, paymentEvent, { amount: val });

      if (val >= remaining) {
        navigate('/wa-full');
      } else {
        navigate('/wa-partial');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving installment');
      setIsSaving(false);
    }
  };

  return (
    <div className="screen active" id="s-installment">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${v.id}/tracker`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('install.title', 'Add Installment')}</div>
      </div>

      <div className="cnt" style={{ paddingBottom: '160px' }}>
        <div style={{ padding: '16px' }}>
          <div className="form-section">
            <div className="ig">
              <label>{t('install.method')}</label>
              <div className="vtype-grid">
                <button className={`vtype-btn ${method === 'cash' ? 'sel' : ''}`} onClick={() => setMethod('cash')}>
                  💵 <span>{t('install.cash')}</span>
                </button>
                <button className={`vtype-btn ${method === 'bank' ? 'sel' : ''}`} onClick={() => setMethod('bank')}>
                  🏦 <span>{t('install.bank')}</span>
                </button>
              </div>
            </div>

            <div className="ig">
              <label>{t('pay.howmuch')}</label>
              <div className="inp-prefix">
                <span className="pfx">₹</span>
                <input 
                  className="inp" 
                  placeholder={remaining.toString()}
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ fontSize: '20px', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--of)', borderRadius: '12px', border: '1.5px solid var(--lg)', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--sl)', fontWeight: 600 }}>{t('install.prev')}</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>₹{v.total_paid}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--lg)', marginBottom: '8px' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--rd)', fontWeight: 700 }}>{t('install.rem')}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--rd)' }}>₹{remaining - (Number(amount) || 0)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ margin: '16px 0', background: 'var(--rdb)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: 'var(--rdt)' }}>
              ⚠️ <span>{error}</span>
            </div>
          )}

          <div style={{ marginTop: '10px' }}>
            {Number(amount) >= remaining && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gn)', fontSize: '13px', fontWeight: 700 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="var(--gn)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('install.complete')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        <button className="btn bo" onClick={handleSave} disabled={isSaving} style={{ background: Number(amount) >= remaining ? 'var(--gn)' : 'var(--or)' }}>
          <span>{isSaving ? 'Saving...' : t('install.confirm')}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default AddInstallment;
