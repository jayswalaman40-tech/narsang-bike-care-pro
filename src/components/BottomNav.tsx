import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { id: 'intake', label: t('nav.intake'), path: '/intake', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
    { id: 'dashboard', label: t('nav.jobs'), path: '/dashboard', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></> },
    { id: 'report', label: t('nav.report'), path: '/report', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
    { id: 'followup', label: t('nav.followup'), path: '/follow-up', icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></> },
  ];

  return (
    <div className="bnav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname.startsWith('/vehicle'));
        return (
          <button
            key={item.id}
            className={`ni ${isActive ? 'on' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <svg viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
