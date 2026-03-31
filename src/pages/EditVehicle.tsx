import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Bike, User, Phone, Wrench, IndianRupee } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import type { VehicleType } from '../types';

export default function EditVehicle() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { getVehicleById, selectedVehicle, updateVehicle, isLoading } = useVehicleStore();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_whatsapp: '',
    vehicle_type: 'Bike' as VehicleType,
    number_plate: '',
    problem: '',
    estimate: '',
    owner_name: '',
    owner_whatsapp: '',
  });

  const [hasOwner, setHasOwner] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch on mount
  useEffect(() => {
    if (id) getVehicleById(id);
  }, [id, getVehicleById]);

  // Populate form when vehicle is loaded
  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        customer_name: selectedVehicle.customer_name,
        customer_whatsapp: selectedVehicle.customer_whatsapp,
        vehicle_type: selectedVehicle.vehicle_type,
        number_plate: selectedVehicle.number_plate,
        problem: selectedVehicle.problem,
        estimate: selectedVehicle.estimate.toString(),
        owner_name: selectedVehicle.owner_name || '',
        owner_whatsapp: selectedVehicle.owner_whatsapp || '',
      });
      setHasOwner(!!selectedVehicle.owner_name);
    }
  }, [selectedVehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name || !formData.customer_whatsapp || !formData.number_plate || !formData.problem || !formData.estimate) {
      setErrorMsg(t('form.required_fields', 'Please fill all required fields'));
      return;
    }

    if (!id) return;

    try {
      await updateVehicle(id, {
        customer_name: formData.customer_name,
        customer_whatsapp: formData.customer_whatsapp,
        vehicle_type: formData.vehicle_type,
        number_plate: formData.number_plate.toUpperCase(),
        problem: formData.problem,
        estimate: parseInt(formData.estimate, 10),
        owner_name: hasOwner ? formData.owner_name || null : null,
        owner_whatsapp: hasOwner ? formData.owner_whatsapp || null : null,
      });
      navigate(`/vehicle/${id}`, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating vehicle');
    }
  };

  if (isLoading && !selectedVehicle) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-800 border-t-primary-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] pb-24">
      <header className="flex items-center gap-4 p-4 border-b border-gray-900 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display tracking-widest text-primary-500 m-0">
          {t('common.edit', 'EDIT')} VEHICLE
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-5 mt-2 animate-fade-in">
        
        {/* Same layout as Intake Form but prefilled */}
        <div className="card p-4 flex flex-col gap-4 border-l-4 border-l-primary-500">
          <h2 className="font-display tracking-widest text-xl text-white">{t('intake.customer_details', 'CUSTOMER')}</h2>
          <div>
            <label className="input-label flex items-center gap-2"><User size={14}/> {t('intake.customer_name', 'Customer Name')} *</label>
            <input name="customer_name" value={formData.customer_name} onChange={handleChange} className="input-base" />
          </div>
          <div>
            <label className="input-label flex items-center gap-2"><Phone size={14}/> {t('intake.customer_wa', 'WhatsApp Number')} *</label>
            <input type="tel" name="customer_whatsapp" value={formData.customer_whatsapp} onChange={handleChange} className="input-base font-mono" />
          </div>
        </div>

        <div className="flex items-center justify-between p-2 pl-1">
          <span className="text-sm font-sans font-bold text-gray-400 tracking-wider">
            {t('intake.has_owner', 'Different Owner?')}
          </span>
          <div 
            onClick={() => setHasOwner(!hasOwner)}
            className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${hasOwner ? 'bg-primary-500 shadow-glow' : 'bg-gray-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${hasOwner ? 'left-8' : 'left-1'}`}></div>
          </div>
        </div>

        {hasOwner && (
          <div className="card p-4 flex flex-col gap-4 border-l-4 border-l-gray-500 animate-slide-up">
             <div>
              <label className="input-label">{t('intake.owner_name', 'Owner Name')}</label>
              <input name="owner_name" value={formData.owner_name} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="input-label">{t('intake.owner_wa', 'Owner WhatsApp')}</label>
              <input type="tel" name="owner_whatsapp" value={formData.owner_whatsapp} onChange={handleChange} className="input-base font-mono" />
            </div>
          </div>
        )}

        <div className="card p-4 flex flex-col gap-4 mt-2">
          <h2 className="font-display tracking-widest text-xl text-white">{t('intake.vehicle_details', 'VEHICLE')}</h2>
          
          <div className="grid grid-cols-2 gap-3">
             <button 
                type="button" 
                onClick={() => setFormData({...formData, vehicle_type: 'Bike'})}
                className={`py-3 rounded-lg font-sans font-bold tracking-wider uppercase border transition-all ${
                  formData.vehicle_type === 'Bike' 
                    ? 'bg-primary-500/20 border-primary-500 text-primary-500' 
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
               <Bike className="mx-auto mb-1" size={20}/> BIKE
             </button>
             <button 
                type="button" 
                onClick={() => setFormData({...formData, vehicle_type: 'Scooter'})}
                className={`py-3 rounded-lg font-sans font-bold tracking-wider uppercase border transition-all ${
                  formData.vehicle_type === 'Scooter' 
                    ? 'bg-primary-500/20 border-primary-500 text-primary-500' 
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
               <span className="block mx-auto mb-1 text-xl leading-none">🛵</span> SCOOTER
             </button>
          </div>

          <div>
            <label className="input-label flex items-center gap-2">{t('intake.number_plate', 'Number Plate')} *</label>
            <input name="number_plate" value={formData.number_plate} onChange={handleChange} className="input-base font-mono text-xl uppercase tracking-widest" />
          </div>
          
          <div>
            <label className="input-label flex items-center gap-2"><Wrench size={14}/> {t('intake.problem', 'Problem')} *</label>
            <input name="problem" value={formData.problem} onChange={handleChange} className="input-base" />
          </div>

          <div>
            <label className="input-label flex items-center gap-2"><IndianRupee size={14}/> {t('intake.estimate', 'Estimate Amount (₹)')} *</label>
            <input type="number" name="estimate" value={formData.estimate} onChange={handleChange} className="input-base font-mono text-xl" />
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center font-bold font-sans">
            {errorMsg}
          </div>
        )}

      </form>
      
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gray-950/90 backdrop-blur border-t border-gray-900 z-50">
        <button onClick={handleSubmit} disabled={isLoading} className="btn-primary w-full shadow-glow">
          {isLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
            <><Save size={20} /> {t('common.save', 'UPDATE')}</>
          )}
        </button>
      </div>
    </div>
  );
}
