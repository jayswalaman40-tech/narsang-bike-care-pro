import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wrench, CheckCircle2, Search, Plus } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import VehicleCard from '../components/VehicleCard';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [activeTab, setActiveTab] = useState<'in_repair' | 'done'>('in_repair');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter(v => {
    const matchesTab = v.status === activeTab; // Note: 'paid' vehicles usually go to 'done' or fall off
    const matchesSearch = v.number_plate.toLowerCase().includes(search.toLowerCase()) || 
                          v.customer_name.toLowerCase().includes(search.toLowerCase());
    return (matchesTab || (activeTab === 'done' && v.status === 'paid')) && matchesSearch;
  });

  const repairCount = vehicles.filter(v => v.status === 'in_repair').length;
  const doneCount = vehicles.filter(v => ['done', 'paid'].includes(v.status)).length;

  return (
    <div className="page-scroll">
      <Header />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
        <div 
          onClick={() => setActiveTab('in_repair')}
          className={`card p-4 flex flex-col items-center justify-center transition-all ${
            activeTab === 'in_repair' ? 'border-primary-500 bg-gray-900 shadow-glow' : 'opacity-70'
          }`}
        >
          <Wrench className={activeTab === 'in_repair' ? 'text-primary-500' : 'text-gray-500'} size={28} />
          <span className="text-3xl font-display mt-2">{repairCount}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{t('dashboard.in_repair', 'IN REPAIR')}</span>
        </div>
        
        <div 
          onClick={() => setActiveTab('done')}
          className={`card p-4 flex flex-col items-center justify-center transition-all ${
            activeTab === 'done' ? 'border-primary-500 bg-gray-900 shadow-glow' : 'opacity-70'
          }`}
        >
          <CheckCircle2 className={activeTab === 'done' ? 'text-green-500' : 'text-gray-500'} size={28} />
          <span className="text-3xl font-display mt-2">{doneCount}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{t('dashboard.done_today', 'DONE TODAY')}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder={t('dashboard.search', 'Search vehicles...')} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-12"
        />
      </div>

      {/* Vehicle List */}
      <div className="flex flex-col gap-4 mb-8">
        {isLoading && filteredVehicles.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-gray-800 border-t-primary-500 animate-spin"></div>
          </div>
        ) : filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => navigate(`/vehicle/${vehicle.id}`)} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 font-sans">
            {search ? 'No vehicles match your search' : 'No vehicles found in this category'}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/intake')}
        className="fixed bottom-24 right-4 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-glow z-40 active:scale-95 transition-transform"
      >
        <Plus size={32} />
      </button>

      <BottomNav />
    </div>
  );
}
