import { Home, Users, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('nav.home', 'Home'), path: '/dashboard' },
    { id: 'followup', icon: Users, label: t('nav.followup', 'Follow-up'), path: '/report' }, // Routing to report for now
    { id: 'settings', icon: Settings, label: t('nav.settings', 'Settings'), path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center p-3 pb-8">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-primary-500 scale-110 drop-shadow-[0_0_8px_rgba(232,89,12,0.8)]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-sans font-semibold tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
