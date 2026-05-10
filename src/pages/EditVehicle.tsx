import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import BottomNav from '../components/BottomNav';

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, updateVehicle, isLoading } = useVehicleStore();

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

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id, getVehicleById]);

  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        customer_name: selectedVehicle.customer_name || '',
        customer_whatsapp: selectedVehicle.customer_whatsapp || '',
        vehicle_type: selectedVehicle.vehicle_type || '',
        number_plate: selectedVehicle.number_plate || '',
        owner_name: selectedVehicle.owner_name || '',
        owner_whatsapp: selectedVehicle.owner_whatsapp || '',
        problem: selectedVehicle.problem || '',
        estimate: selectedVehicle.estimate?.toString() || '',
        delivery_by: selectedVehicle.delivery_by || '',
      });
    }
  }, [selectedVehicle]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selVtype = (vehicle_type: 'Bike' | 'Scooter') => {
    setFormData(prev => ({ ...prev, vehicle_type }));
  };

  const handleSave = async () => {
    if (!id || isSaving) return;

    if (!formData.customer_name || !formData.number_plate || !formData.problem || !formData.estimate) {
      setError(t('intake.err', 'Please fill required fields'));
      return;
    }

    setIsSaving(true);
    try {
      await updateVehicle(id, {
        customer_name: formData.customer_name,
        customer_whatsapp: formData.customer_whatsapp,
        vehicle_type: formData.vehicle_type as 'Bike' | 'Scooter',
        number_plate: formData.number_plate.toUpperCase(),
        owner_name: formData.owner_name,
        owner_whatsapp: formData.owner_whatsapp,
        problem: formData.problem,
        estimate: Number(formData.estimate),
        delivery_by: formData.delivery_by,
      });
      navigate(`/vehicle/${id}`);
    } catch (err: any) {
      setError(err.message || 'Error updating vehicle');
      setIsSaving(false);
    }
  };

  if (isLoading || !selectedVehicle) {
    return <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div className="screen active" id="s-edit-form">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('edit.title', 'Edit Details')}</div>
      </div>

      <div className="cnt" style={{ paddingBottom: '96px' }}>
        <div className="form-section">
          <div className="form-section-title">{t('intake.sec1')}</div>
          <div className="ig">
            <label>{t('intake.customer')}</label>
            <input 
              className="inp" 
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
                type="tel" 
                maxLength={10} 
                value={formData.customer_whatsapp}
                onChange={(e) => handleInputChange('customer_whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

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
              style={{ textTransform: 'uppercase', fontFamily: "'Share Tech Mono',monospace", fontWeight: 600, letterSpacing: '1px' }}
              value={formData.number_plate}
              onChange={(e) => handleInputChange('number_plate', e.target.value.toUpperCase())}
            />
          </div>
          <div className="ig">
            <label>{t('intake.owner')}</label>
            <input 
              className="inp" 
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
                type="tel" 
                maxLength={10} 
                value={formData.owner_whatsapp}
                onChange={(e) => handleInputChange('owner_whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section" style={{ marginTop: '6px' }}>
          <div className="form-section-title">{t('intake.sec3')}</div>
          <div className="ig">
            <label>{t('intake.problem')}</label>
            <textarea 
              className="inp" 
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

      <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, padding: '12px 16px', background: '#fff', borderTop: '1px solid var(--lg)' }}>
        <button className="btn bo" onClick={handleSave} disabled={isSaving}>
          <span>{isSaving ? 'Saving...' : t('btn.save', 'Save Changes')} ✅</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default EditVehicle;
