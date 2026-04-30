import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import { sendWhatsAppNotification } from '../utils/whatsapp';

const IntakeForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const addVehicle = useVehicleStore(state => state.addVehicle);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_whatsapp: '',
    vehicle_type: '' as 'Bike' | 'Scooter' | '',
    number_plate: '',
    owner_name: '',
    owner_whatsapp: '',
    problem: '',
    estimate: '',
    delivery_by: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const updateDots = () => {
    const fields = [
      formData.customer_name.trim(),
      formData.customer_whatsapp.trim(),
      formData.vehicle_type,
      formData.number_plate.trim(),
      formData.owner_name.trim(),
      formData.owner_whatsapp.trim(),
      formData.problem.trim(),
      formData.estimate.toString().trim(),
      formData.delivery_by.trim(),
    ];
    return fields.map((v, i) => ({ id: `pd${i}`, filled: !!v }));
  };

  const dots = updateDots();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selVtype = (vehicle_type: 'Bike' | 'Scooter') => {
    setFormData(prev => ({ ...prev, vehicle_type }));
  };

  const handleSubmit = async () => {
    if (isSaving) return;
    
    if (!formData.customer_name || !formData.customer_whatsapp || !formData.vehicle_type || !formData.number_plate || !formData.problem || !formData.estimate) {
      setError(t('intake.err'));
      return;
    }
    setError('');
    setIsSaving(true);

    try {
      const ownerName = formData.owner_name || formData.customer_name;
      const ownerWhatsapp = formData.owner_whatsapp || formData.customer_whatsapp;

      const newVehicle = await addVehicle({
        customer_name: formData.customer_name,
        customer_whatsapp: formData.customer_whatsapp,
        vehicle_type: formData.vehicle_type as 'Bike' | 'Scooter',
        number_plate: formData.number_plate.toUpperCase(),
        owner_name: ownerName,
        owner_whatsapp: ownerWhatsapp,
        problem: formData.problem,
        estimate: Number(formData.estimate),
        delivery_by: formData.delivery_by,
      });

      // Send WhatsApp registration confirmation via Edge Function
      if (newVehicle && newVehicle.id) {
        await sendWhatsAppNotification(newVehicle.id, 'registration');
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error saving vehicle');
      setIsSaving(false);
    }
  };

  return (
    <div className="screen active" id="s-intake">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('intake.title')}</div>
        <button className="sm bo" onClick={() => navigate('/dashboard')} style={{ marginLeft: 'auto' }}>
          {t('nav.jobs')}
        </button>
      </div>

      {/* Progress dots */}
      <div className="form-progress">
        {dots.map(dot => (
          <div key={dot.id} className={`fp-dot ${dot.filled ? 'filled' : ''}`} />
        ))}
      </div>

      <div className="cnt" style={{ paddingBottom: '160px' }}>
        {/* SECTION 1: Customer Info */}
        <div className="form-section">
          <div className="form-section-title">{t('intake.sec1')}</div>
          <div className="ig">
            <label>{t('intake.customer')}</label>
            <input 
              className="inp" 
              placeholder="e.g. Ramesh Kumar" 
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
            />
          </div>
          <div className="ig">
            <label>{t('intake.whatsapp')}</label>
            <div className="inp-prefix">
              <span className="pfx">+91</span>
              <input 
                className="inp" 
                placeholder="9876543210" 
                type="tel" 
                maxLength={10} 
                value={formData.customer_whatsapp}
                onChange={(e) => handleInputChange('customer_whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Vehicle Info */}
        <div className="form-section" style={{ marginTop: '6px' }}>
          <div className="form-section-title">{t('intake.sec2')}</div>
          <div className="ig">
            <label>{t('intake.vtype')}</label>
            <div className="vtype-grid">
              <button 
                className={`vtype-btn ${formData.vehicle_type === 'Scooter' ? 'sel' : ''}`}
                onClick={() => selVtype('Scooter')}
              >
                🛵 <span>{t('vtype.scooter')}</span>
              </button>
              <button 
                className={`vtype-btn ${formData.vehicle_type === 'Bike' ? 'sel' : ''}`}
                onClick={() => selVtype('Bike')}
              >
                🏍️ <span>{t('vtype.bike')}</span>
              </button>
            </div>
          </div>
          <div className="ig">
            <label>{t('intake.plate')}</label>
            <input 
              className="inp" 
              placeholder="e.g. GJ-01-AB-1234" 
              style={{ textTransform: 'uppercase', fontFamily: "'Share Tech Mono',monospace", fontWeight: 600, letterSpacing: '1px' }}
              value={formData.number_plate}
              onChange={(e) => handleInputChange('number_plate', e.target.value.toUpperCase())}
            />
          </div>
          <div className="ig">
            <label>{t('intake.owner')}</label>
            <input 
              className="inp" 
              placeholder="e.g. Suresh Bhai" 
              value={formData.owner_name}
              onChange={(e) => handleInputChange('owner_name', e.target.value)}
            />
          </div>
          <div className="ig">
            <label>{t('intake.ownernum')}</label>
            <div className="inp-prefix">
              <span className="pfx">+91</span>
              <input 
                className="inp" 
                placeholder="9123456780" 
                type="tel" 
                maxLength={10} 
                value={formData.owner_whatsapp}
                onChange={(e) => handleInputChange('owner_whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Job Info */}
        <div className="form-section" style={{ marginTop: '6px' }}>
          <div className="form-section-title">{t('intake.sec3')}</div>
          <div className="ig">
            <label>{t('intake.problem')}</label>
            <textarea 
              className="inp" 
              placeholder="e.g. Front brake se awaaz aati hai, engine thoda smoke karta hai..." 
              value={formData.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
            />
          </div>
          <div className="ig">
            <label>{t('intake.estimate')}</label>
            <div className="inp-prefix">
              <span className="pfx">₹</span>
              <input 
                className="inp" 
                placeholder="2500" 
                type="number" 
                value={formData.estimate}
                onChange={(e) => handleInputChange('estimate', e.target.value)}
              />
            </div>
          </div>
          <div className="ig">
            <label>{t('intake.delivery')}</label>
            <input 
              className="inp" 
              placeholder="e.g. Kal tak, 2 din mein..." 
              value={formData.delivery_by}
              onChange={(e) => handleInputChange('delivery_by', e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ margin: '0 16px 10px', background: 'var(--rdb)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: 'var(--rdt)' }}>
            ⚠️ <span>{error}</span>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        <button className="btn bo" onClick={handleSubmit} disabled={isSaving}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>{isSaving ? 'Saving...' : t('intake.save')}</span>
        </button>
      </div>

      <div className="bnav">
        <button className="ni on">
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
        <button className="ni" onClick={() => navigate('/follow-up')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" /></svg>
          <span>{t('nav.followup')}</span>
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
