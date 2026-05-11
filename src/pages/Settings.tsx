import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';
import BottomNav from '../components/BottomNav';
import type { Language } from '../types';

const Settings: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { settings, mechanicWhatsapp, setMechanicWhatsapp, language, setLanguage } = useUIStore();

  const [formData, setFormData] = useState({
    garage_name: '',
    mechanic_name: '',
    mechanic_whatsapp: '',
    primary_language: 'en'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        garage_name: settings.garage_name || '',
        mechanic_name: settings.mechanic_name || '',
        mechanic_whatsapp: mechanicWhatsapp || '',
        primary_language: language || 'en'
      });
    }
  }, [settings, mechanicWhatsapp, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ text: '', type: '' });

    try {
      setMechanicWhatsapp(formData.mechanic_whatsapp);
      setLanguage(formData.primary_language as Language);
      i18n.changeLanguage(formData.primary_language);

      if (settings?.id) {
        const { error } = await supabase
          .from('garage_settings')
          .update({
            garage_name: formData.garage_name,
            mechanic_name: formData.mechanic_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
      }
      
      setMsg({ text: 'Settings saved successfully', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="screen active" id="s-settings">
      <div className="sbar"></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">Settings</div>
      </div>

      <div className="cnt" style={{ paddingBottom: '96px' }}>
        <div style={{ padding: '24px 16px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-section-title">Workshop Config</div>
            
            <div className="ig">
              <label>Garage Name</label>
              <input name="garage_name" value={formData.garage_name} onChange={handleChange} className="inp" />
            </div>

            <div className="ig">
              <label>Mechanic Name</label>
              <input name="mechanic_name" value={formData.mechanic_name} onChange={handleChange} className="inp" />
            </div>

            <div className="ig">
              <label>My WhatsApp</label>
              <div className="inp-prefix">
                <span className="pfx">+91</span>
                <input name="mechanic_whatsapp" value={formData.mechanic_whatsapp} onChange={handleChange} className="inp" type="tel" />
              </div>
            </div>

            <div className="ig">
              <label>Default Language</label>
              <select name="primary_language" value={formData.primary_language} onChange={handleChange} className="inp">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            {msg.text && (
              <div style={{ padding: '12px', borderRadius: '8px', background: msg.type === 'error' ? 'var(--rdb)' : 'var(--gnb)', color: msg.type === 'error' ? 'var(--rdt)' : 'var(--gnt)', fontSize: '13px', textAlign: 'center', fontWeight: '700' }}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn bo">
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>

            <button type="button" onClick={handleLogout} className="btn bw" style={{ color: 'var(--rd)', borderColor: 'var(--rd)', opacity: 0.8 }}>
              Logout
            </button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
