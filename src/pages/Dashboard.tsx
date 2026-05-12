import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';
import VehicleCard from '../components/VehicleCard';
import BottomNav from '../components/BottomNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [activeTab, setActiveTab] = useState<'in_repair' | 'done'>('in_repair');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter(v => 
    activeTab === 'in_repair' 
      ? v.status === 'in_repair' 
      : (v.status === 'done' || v.status === 'paid')
  );

  const repairCount = vehicles.filter(v => v.status === 'in_repair').length;
  const doneCount = vehicles.filter(v => v.status === 'done' || v.status === 'paid').length;

  const handleAction = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle?.status === 'in_repair') {
      navigate(`/confirm-done/${id}`);
    } else if (vehicle?.status === 'done') {
      navigate(`/vehicle/${id}/payment`);
    }
  };

  return (
    <div className="screen active" id="s-dashboard">
      <div className="sbar"></div>
      
      <div style={{ padding: '12px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '26px', color: 'var(--dk)', letterSpacing: '2px' }}>
            <span>{t('dash.title')}</span> 🔧
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sl)' }}>{t('dash.sub', "Today's overview")}</div>
        </div>
        <button className="sm bo" onClick={() => navigate('/intake')}>
          {t('dash.new')}
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
        <div className="st">
          <div className="sv">₹{vehicles.reduce((acc, v) => acc + (v.total_paid || 0), 0)}</div>
          <div className="sl2">{t('report.earned')}</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'in_repair' ? 'on' : ''}`}
          onClick={() => setActiveTab('in_repair')}
        >
          🔧 {t('dash.tab.repair')} ({repairCount})
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

      <BottomNav />
    </div>
  );
};

export default Dashboard;
