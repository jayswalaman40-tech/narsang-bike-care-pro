import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import VehicleCard from '../components/VehicleCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehicles, fetchVehicles, isLoading, markAsDone } = useVehicleStore();
  const [activeTab, setActiveTab] = useState<'in_repair' | 'done'>('in_repair');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter(v => 
    activeTab === 'in_repair' ? v.status === 'in_repair' : v.status === 'done'
  );

  const repairCount = vehicles.filter(v => v.status === 'in_repair').length;
  const doneCount = vehicles.filter(v => v.status === 'done').length;

  const handleAction = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle?.status === 'in_repair') {
      await markAsDone(id);
      navigate('/wa-sent');
    } else if (vehicle?.status === 'done') {
      navigate(`/vehicle/${id}/payment`);
    }
  };

  return (
    <div className="screen active" id="s-dash">
      <div className="sbar"></div>
      <div className="hdr">
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8590C,#ff7c35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, fontFamily: "'Bebas Neue',cursive" }}>SN</div>
        <div className="hdr-t">{t('dash.title')}</div>
        <button className="sm bo" onClick={() => navigate('/intake')}>
          <span>{t('dash.new')}</span>
        </button>
      </div>

      <div className="stats">
        <div className="st">
          <div className="sv" style={{ color: 'var(--or)' }}>{repairCount}</div>
          <div className="sl2">{t('dash.repair')}</div>
        </div>
        <div className="st">
          <div className="sv" style={{ color: 'var(--gn)' }}>{doneCount}</div>
          <div className="sl2">{t('dash.done')}</div>
        </div>
        <div className="st" onClick={() => navigate('/report')} style={{ cursor: 'pointer' }}>
          <div className="sv" style={{ color: 'var(--bl)' }}>₹{vehicles.reduce((acc, v) => acc + (v.total_paid || 0), 0)}</div>
          <div className="sl2">{t('report.earned')}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'in_repair' ? 'on' : ''}`}
          onClick={() => setActiveTab('in_repair')}
        >
          {t('dash.tab.repair')} ({repairCount})
        </button>
        <button 
          className={`tab ${activeTab === 'done' ? 'on' : ''}`}
          onClick={() => setActiveTab('done')}
        >
          {t('dash.tab.done')} ({doneCount})
        </button>
      </div>

      <div className="cnt">
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--sl)' }}>Loading...</div>
        ) : filteredVehicles.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>🛵</div>
            <div style={{ color: 'var(--sl)', fontSize: '14px', fontWeight: 600 }}>No vehicles found</div>
          </div>
        ) : (
          <div style={{ paddingTop: '16px' }}>
            {filteredVehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onClick={(id) => navigate(`/vehicle/${id}`)}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bnav">
        <button className="ni" onClick={() => navigate('/intake')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{t('nav.intake')}</span>
        </button>
        <button className="ni on">
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

export default Dashboard;
