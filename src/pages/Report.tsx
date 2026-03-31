import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, TrendingUp, IndianRupee, Wrench, Search, Users } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Report() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter((v) => {
    const d = new Date(v.created_at);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    // Roughly week logic
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isWeek = diffDays <= 7;
    const isMonth = diffDays <= 30;

    let timeMatch = true;
    if (dateFilter === 'today') timeMatch = isToday;
    if (dateFilter === 'week') timeMatch = isWeek;
    if (dateFilter === 'month') timeMatch = isMonth;

    const queryMatch = v.number_plate.toLowerCase().includes(search.toLowerCase()) || 
                       v.customer_name.toLowerCase().includes(search.toLowerCase());

    return timeMatch && queryMatch;
  });

  const totalEarned = filteredVehicles.reduce((sum, v) => sum + v.total_paid, 0);
  const totalRemaining = filteredVehicles.reduce((sum, v) => sum + v.remaining, 0);

  return (
    <div className="page-scroll">
      <Header />
      
      <div className="flex justify-between items-end mt-6 mb-4 px-1">
         <h1 className="text-3xl font-display tracking-widest text-primary-500">{t('nav.followup', 'REPORT')}</h1>
         <button 
           onClick={() => navigate('/follow-up')}
           className="bg-primary-500/10 text-primary-500 border border-primary-500 px-3 py-1.5 rounded-lg font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:bg-primary-500/20 active:scale-95 transition-all"
         >
           <Users size={14} /> Bulk WA
         </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder={t('dashboard.search', 'Search vehicles...')} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-12 bg-gray-900 border-gray-800"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-gray-900 rounded-xl border border-gray-800">
         {['today', 'week', 'month', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter as any)}
              className={`py-2 rounded-lg text-xs font-sans font-bold tracking-widest uppercase transition-all ${
                dateFilter === filter ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {filter}
            </button>
         ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="card p-4 border-l-4 border-l-green-500">
            <p className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-1 flex items-center gap-1"><IndianRupee size={12}/> Earned</p>
            <p className="text-2xl font-mono font-bold text-green-500">{formatCurrency(totalEarned)}</p>
         </div>
         <div className="card p-4 border-l-4 border-l-red-500">
            <p className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-1 flex items-center gap-1"><TrendingUp size={12}/> Pending</p>
            <p className="text-2xl font-mono font-bold text-red-500">{formatCurrency(totalRemaining)}</p>
         </div>
         <div className="card p-4 col-span-2 border-l-4 border-l-primary-500">
            <p className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-1 flex items-center gap-1"><Wrench size={12}/> Jobs Completed</p>
            <p className="text-2xl font-display text-white">{filteredVehicles.length}</p>
         </div>
      </div>

      <div className="space-y-3 mb-8">
         <h3 className="font-sans font-bold tracking-widest text-sm text-gray-500 uppercase flex items-center gap-2 mb-4">
           <Calendar size={16} /> Details
         </h3>
         
         {isLoading ? (
            <div className="flex justify-center p-8"><div className="w-6 h-6 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div></div>
         ) : filteredVehicles.length > 0 ? (
           filteredVehicles.map(v => (
             <div key={v.id} onClick={() => navigate(`/vehicle/${v.id}`)} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex justify-between items-center active:scale-95 transition-transform">
               <div>
                 <p className="font-display tracking-widest text-white text-lg">{v.number_plate}</p>
                 <p className="text-xs font-mono text-gray-500">{formatRelativeDate(v.created_at)}</p>
               </div>
               <div className="text-right">
                 <p className="font-mono text-sm font-bold text-green-500">{formatCurrency(v.total_paid)}</p>
                 {v.remaining > 0 && <p className="font-mono text-[10px] text-red-500 border border-red-500/30 rounded px-1 inline-block mt-1">Pending: {formatCurrency(v.remaining)}</p>}
               </div>
             </div>
           ))
         ) : (
           <div className="text-center p-6 text-gray-500 italic">No records found for this period.</div>
         )}
      </div>

      <BottomNav />
    </div>
  );
}
