import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import { usePaymentStore } from '../store/paymentStore';
import { sendWhatsAppMessage, generatePaymentConfirmationMessage } from '../utils/whatsapp';

const Payment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, isLoading } = useVehicleStore();
  const { addPayment } = usePaymentStore();

  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [error, setError] = useState('');

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
  const alreadyPaid = v.total_paid || 0;
  const remaining = estimate - alreadyPaid;

  const handleSave = async () => {
    const amount = Number(receivedAmount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await addPayment({
        vehicle_id: v.id,
        amount_paid: amount,
        payment_method: paymentMethod,
        note: `Payment for ${v.number_plate}`,
        total_amount: estimate,
        payment_type: amount >= remaining ? 'full' : 'partial'
      });

      const newTotalPaid = alreadyPaid + amount;
      const newRemaining = estimate - newTotalPaid;

      // Send payment confirmation to owner
      const ownerPhone = v.owner_whatsapp || v.customer_whatsapp;
      const ownerName = v.owner_name || v.customer_name;
      const confirmMsg = generatePaymentConfirmationMessage(
        ownerName,
        v.number_plate,
        amount,
        newTotalPaid,
        newRemaining
      );
      await sendWhatsAppMessage(ownerPhone, confirmMsg);

      if (amount >= remaining) {
        navigate('/wa-full');
      } else {
        navigate('/wa-partial');
      }
    } catch (err: any) {
      setError(err.message || 'Error recording payment');
    }
  };

  return (
    <div className="screen active" id="s-payment">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${v.id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('pay.title')}</div>
      </div>

      <div className="cnt" style={{ padding: '24px 16px' }}>
        <div style={{ background: 'var(--orl)', borderRadius: '16px', padding: '20px', border: '1.5px solid var(--orm)', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--or)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{t('pay.total')}</div>
          <div style={{ fontSize: '36px', fontFamily: "'Bebas Neue',cursive", color: 'var(--or)', letterSpacing: '2px' }}>₹{estimate}</div>
          <div style={{ height: '1px', background: 'var(--orm)', margin: '12px 20px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--sl)' }}>
            <span>Received: ₹{alreadyPaid}</span>
            <span style={{ color: 'var(--rd)' }}>Pending: ₹{remaining}</span>
          </div>
        </div>

        <div className="ig">
          <label>{t('pay.howmuch')}</label>
          <div className="inp-prefix">
            <span className="pfx">₹</span>
            <input 
              className="inp" 
              readOnly
              type="number" 
              value={remaining}
              style={{ fontSize: '20px', fontWeight: 700, background: 'var(--of)', color: 'var(--sl)' }}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sl)', marginTop: '4px' }}>
            ℹ️ This is the exact pending balance.
          </div>
        </div>

        <div className="ig">
          <label>{t('install.method')}</label>
          <div className="vtype-grid">
            <button 
              className={`vtype-btn ${paymentMethod === 'cash' ? 'sel' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              💵 <span>{t('install.cash')}</span>
            </button>
            <button 
              className={`vtype-btn ${paymentMethod === 'bank' ? 'sel' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              🏦 <span>{t('install.bank')}</span>
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--rdb)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: 'var(--rdt)', marginBottom: '16px' }}>
            ⚠️ <span>{error}</span>
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '16px', background: 'var(--of)', borderRadius: '12px', fontSize: '12px', color: 'var(--sl)', lineHeight: 1.6 }}>
          💡 <strong>{t('pay.warn')} ₹0</strong> {t('pay.warn2')}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '88px', left: 0, right: 0, padding: '16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        <button className="btn bo" onClick={handleSave} style={{ background: 'var(--gn)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>{t('pay.full')} (₹{remaining})</span>
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

export default Payment;
