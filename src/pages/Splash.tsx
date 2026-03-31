import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(100);
    }, 200);

    // Auto-navigate to dashboard after animation
    const navTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="screen active" id="s-splash" style={{ background: '#0a0a0a', overflow: 'hidden' }}>
      {/* GARAGE BACKGROUND SVG */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.13 }} viewBox="0 0 375 812" xmlns="http://www.w3.org/2000/svg">
        {/* gear top-right */}
        <g transform="translate(310,80)" stroke="#E8590C" strokeWidth="6" fill="none">
          <circle cx="0" cy="0" r="52" />
          <circle cx="0" cy="0" r="30" />
          <line x1="-58" y1="0" x2="-30" y2="0" /><line x1="30" y1="0" x2="58" y2="0" />
          <line x1="0" y1="-58" x2="0" y2="-30" /><line x1="0" y1="30" x2="0" y2="58" />
          <line x1="-41" y1="-41" x2="-21" y2="-21" /><line x1="21" y1="21" x2="41" y2="41" />
          <line x1="41" y1="-41" x2="21" y2="-21" /><line x1="-21" y1="21" x2="-41" y2="41" />
        </g>
        {/* gear bottom-left */}
        <g transform="translate(55,680)" stroke="#E8590C" strokeWidth="5" fill="none">
          <circle cx="0" cy="0" r="42" />
          <circle cx="0" cy="0" r="22" />
          <line x1="-48" y1="0" x2="-22" y2="0" /><line x1="22" y1="0" x2="48" y2="0" />
          <line x1="0" y1="-48" x2="0" y2="-22" /><line x1="0" y1="22" x2="0" y2="48" />
          <line x1="-34" y1="-34" x2="-16" y2="-16" /><line x1="16" y1="16" x2="34" y2="34" />
          <line x1="34" y1="-34" x2="16" y2="-16" /><line x1="-16" y1="21" x2="-34" y2="41" />
        </g>
        {/* wrench left */}
        <g transform="translate(40,280) rotate(-35)" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round">
          <line x1="0" y1="-100" x2="0" y2="60" />
          <ellipse cx="0" cy="-100" rx="18" ry="22" />
          <line x1="-18" y1="-88" x2="-18" y2="-112" /><line x1="18" y1="-88" x2="18" y2="-112" />
          <ellipse cx="0" cy="60" rx="12" ry="14" />
        </g>
        {/* wrench right */}
        <g transform="translate(335,480) rotate(20)" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round">
          <line x1="0" y1="-80" x2="0" y2="50" />
          <ellipse cx="0" cy="-80" rx="14" ry="17" />
          <line x1="-14" y1="-70" x2="-14" y2="-90" /><line x1="14" y1="-70" x2="14" y2="-90" />
          <ellipse cx="0" cy="50" rx="10" ry="11" />
        </g>
        {/* screwdriver */}
        <g transform="translate(180,740) rotate(-10)" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round">
          <line x1="0" y1="-55" x2="0" y2="35" />
          <rect x="-10" y="-55" width="20" height="28" rx="4" />
          <line x1="-6" y1="35" x2="6" y2="35" />
        </g>
        {/* diagonal stripe lines (metal sheet feel) */}
        <line x1="0" y1="200" x2="150" y2="0" stroke="#fff" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="250" x2="200" y2="0" stroke="#fff" strokeWidth="1" opacity="0.2" />
        <line x1="225" y1="812" x2="375" y2="550" stroke="#E8590C" strokeWidth="1" opacity="0.4" />
        <line x1="180" y1="812" x2="375" y2="490" stroke="#E8590C" strokeWidth="1" opacity="0.25" />
        {/* bolt circles */}
        <circle cx="25" cy="25" r="6" stroke="#fff" strokeWidth="2" fill="none" />
        <circle cx="350" cy="25" r="6" stroke="#fff" strokeWidth="2" fill="none" />
        <circle cx="25" cy="787" r="6" stroke="#fff" strokeWidth="2" fill="none" />
        <circle cx="350" cy="787" r="6" stroke="#fff" strokeWidth="2" fill="none" />
        {/* center ring */}
        <circle cx="187" cy="400" r="140" stroke="#E8590C" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="8 6" />
        <circle cx="187" cy="400" r="100" stroke="#fff" strokeWidth="1" fill="none" opacity="0.15" strokeDasharray="4 8" />
      </svg>

      {/* ORANGE GLOW TOP */}
      <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '200px', background: 'radial-gradient(ellipse,rgba(232,89,12,.35) 0%,transparent 70%)', pointerEvents: 'none' }}></div>

      {/* CONTENT */}
      <div className="sbar" style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <span className="t" style={{ color: '#fff' }}>9:41</span>
        <span style={{ fontSize: '12px', color: '#fff' }}>📶 🔋</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* LOGO ICON */}
        <div style={{ width: '88px', height: '88px', borderRadius: '20px', background: 'linear-gradient(135deg,#E8590C,#ff7c35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '42px', boxShadow: '0 6px 28px rgba(232,89,12,.6),0 0 0 4px rgba(232,89,12,.2)' }}>🛵</div>

        {/* NAME — Bebas Neue garage style */}
        <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '34px', color: '#fff', letterSpacing: '3px', lineHeight: 1, marginBottom: '4px', textShadow: '0 2px 12px rgba(232,89,12,.5)' }}>
          {t('app.name')}
        </div>
        
        {/* DIVIDER LINE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0 10px', width: '70%' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(232,89,12,.8))' }}></div>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--or)' }}></div>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(232,89,12,.8),transparent)' }}></div>
        </div>

        <div 
          style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)', lineHeight: 1.7, fontFamily: "'Rajdhani',sans-serif", letterSpacing: '0.5px' }} 
          dangerouslySetInnerHTML={{ __html: t('splash.tagline') }}
        />
        <div className="ldbar" style={{ marginTop: '28px' }}>
          <div className="ldfill" style={{ width: `${loading}%` }}></div>
        </div>
      </div>

      <div style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 2 }}>
        <button className="btn bo" onClick={() => navigate('/intake')} style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '1px' }}>
          {t('splash.start')}
        </button>
        <button className="btn" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, letterSpacing: '0.5px' }} onClick={() => navigate('/dashboard')}>
          {t('splash.dashboard')}
        </button>
      </div>
    </div>
  );
};

export default Splash;
