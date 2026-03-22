import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LiveMap, Reports } from './pages';
import { Fleet, Schedules, Alerts, Settings } from './pages/Features';
import { SimulationService } from './services/SimulationService';

function App() {
  return (
    <HashRouter>
      <SimulationService />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LiveMap />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
