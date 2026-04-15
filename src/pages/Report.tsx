import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

const Report: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filtered = vehicles.filter(v => 
    v.number_plate.toLowerCase().includes(search.toLowerCase()) ||
    v.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalEarned = vehicles.reduce((acc, v) => acc + (v.total_paid || 0), 0);
  const totalJobs = vehicles.length;

  return (
    <div className="screen active" id="s-report">
      <div className="sbar"></div>
      <div className="hdr">
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8590C,#ff7c35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, fontFamily: "'Bebas Neue',cursive" }}>SN</div>
        <div className="hdr-t">{t('nav.report')}</div>
        <button className="sm bo" onClick={() => navigate('/intake')}>
          <span>{t('dash.new')}</span>
        </button>
      </div>

      <div className="stats">
        <div className="st">
          <div className="sv" style={{ color: 'var(--or)' }}>₹{totalEarned}</div>
          <div className="sl2">{t('report.earned')}</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: 'var(--bl)' }}>{totalJobs}</div>
          <div className="sl2">{t('report.jobs')}</div>
        </div>
      </div>

      <div style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--of)', borderRadius: '12px', padding: '10px 14px', border: '1.5px solid var(--lg)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sl)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            className="cinp" 
            placeholder={t('report.search')} 
            style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '13px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cnt">
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {filtered.map(v => (
              <div key={v.id} onClick={() => navigate(`/vehicle/${v.id}`)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--of)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dk)', fontFamily: "'Share Tech Mono',monospace" }}>{v.number_plate}</div>
                  <div style={{ fontSize: '11px', color: 'var(--sl)', marginTop: '2px' }}>{v.customer_name} • {new Date(v.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gn)' }}>₹{v.total_paid}</div>
                  <div className={`badge ${v.status === 'done' ? 'bd' : v.status === 'paid' ? 'bp' : 'br'}`} style={{ marginTop: '4px', fontSize: '10px' }}>{v.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bnav">
        <button className="ni" onClick={() => navigate('/intake')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{t('nav.intake')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/dashboard')}>
           <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span>{t('nav.jobs')}</span>
        </button>
        <button className="ni on">
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

export default Report;
