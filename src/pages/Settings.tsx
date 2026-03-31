import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, Languages, User, Lock, Store } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store/uiStore';
import type { Language } from '../types';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const { t, i18n } = useTranslation();
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
        garage_name: settings.garage_name,
        mechanic_name: settings.mechanic_name,
        mechanic_whatsapp: mechanicWhatsapp,
        primary_language: language
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
      // Very naive implementation for "Settings" - updating state locally for wa/lang
      // and pushing to supabase for garage/mechanic name
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
    <div className="min-h-screen bg-[var(--app-bg)] pb-24">
      <Header />
      
      <div className="p-4 mt-4 animate-fade-in">
         <h1 className="text-3xl font-display tracking-widest text-primary-500 mb-6 flex items-center gap-2">
           <Store /> {t('nav.settings', 'SETTINGS')}
         </h1>

         <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="card p-4 flex flex-col gap-4 border-l-4 border-l-primary-500">
               <h2 className="font-sans font-bold text-gray-400 tracking-widest uppercase text-xs mb-1">General</h2>
               
               <div>
                 <label className="input-label flex items-center gap-2"><Store size={14}/> Garage Name</label>
                 <input name="garage_name" value={formData.garage_name} onChange={handleChange} className="input-base" />
               </div>

               <div>
                 <label className="input-label flex items-center gap-2"><User size={14}/> Mechanic Name</label>
                 <input name="mechanic_name" value={formData.mechanic_name} onChange={handleChange} className="input-base" />
               </div>
               
               <div>
                 <label className="input-label flex items-center gap-2"><User size={14}/> My WhatsApp</label>
                 <input type="tel" name="mechanic_whatsapp" value={formData.mechanic_whatsapp} onChange={handleChange} className="input-base font-mono" />
               </div>

               <div>
                 <label className="input-label flex items-center gap-2"><Languages size={14}/> App Language</label>
                 <select name="primary_language" value={formData.primary_language} onChange={handleChange} className="input-base appearance-none">
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                 </select>
               </div>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-lg text-sm text-center font-bold font-sans ${msg.type === 'error' ? 'bg-red-500/20 text-red-500 border border-red-500' : 'bg-green-500/20 text-green-500 border border-green-500'}`}>
                {msg.text}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary shadow-glow">
               {isLoading ? (
                 <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
               ) : (
                 <><Save size={20} /> SAVE SETTINGS</>
               )}
            </button>
            <button type="button" onClick={handleLogout} className="btn-secondary mt-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white">
               <Lock size={20} /> LOGOUT
            </button>
         </form>
      </div>

      <BottomNav />
    </div>
  );
}
