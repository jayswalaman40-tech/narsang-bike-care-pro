import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUIStore } from './store/uiStore';
import Layout from './components/Layout';

// We'll import pages as we build them.
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import IntakeForm from './pages/IntakeForm';
import CardDetail from './pages/CardDetail';
import ConfirmDone from './pages/ConfirmDone';
import EditVehicle from './pages/EditVehicle';
import WASent from './pages/WASent';
import Payment from './pages/Payment';
import WAPartial from './pages/WAPartial';
import PartialTracker from './pages/PartialTracker';
import AddInstallment from './pages/AddInstallment';
import PaidSuccess from './pages/PaidSuccess';
import Report from './pages/Report';
import FollowUp from './pages/FollowUp';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

function App() {
  const fetchSettings = useUIStore(state => state.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route path="/vehicle/:id" element={<CardDetail />} />
        <Route path="/confirm-done/:id" element={<ConfirmDone />} />
        <Route path="/vehicle/:id/edit" element={<EditVehicle />} />
        <Route path="/wa-sent" element={<WASent />} />
        <Route path="/vehicle/:id/payment" element={<Payment />} />
        <Route path="/wa-partial" element={<WAPartial />} />
        <Route path="/wa-full" element={<PaidSuccess />} />
        <Route path="/vehicle/:id/tracker" element={<PartialTracker />} />
        <Route path="/vehicle/:id/add-installment" element={<AddInstallment />} />
        <Route path="/report" element={<Report />} />
        <Route path="/follow-up" element={<FollowUp />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
