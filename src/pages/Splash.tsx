import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // In a real app we might pre-load data here. We'll just fake a delay or wait for auth
  useEffect(() => {
    // Just for demo purposes, we don't auto-redirect so the user can see the beautiful splash
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-between p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      {/* Top section: Title and subtitle */}
      <div className="w-full mt-12 animate-slide-up z-10 flex flex-col items-center text-center">
        <h1 className="text-6xl font-display text-white tracking-widest text-shadow-sm">
          SHRI NARSANG
        </h1>
        <h2 className="text-3xl font-display text-primary-500 tracking-wider mt-2">
          BIKE CARE
        </h2>
        
        {/* Placeholder for SVG tools - we would use a real SVG illustration here */}
        <div className="mt-16 w-48 h-48 rounded-full border border-gray-800 bg-gray-900/50 flex items-center justify-center shadow-glow animate-pulse">
           <Settings size={80} className="text-primary-500 animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      {/* Bottom section: Loading and Buttons */}
      <div className="w-full mb-8 z-10">
        <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden mb-8 border border-gray-800">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 h-full w-2/3 rounded-full shadow-glow"></div>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full"
          >
            {t('common.open_app', 'OPEN GARAGE')}
          </button>
        </div>
      </div>
    </div>
  );
}
