import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReminderProvider } from './context/ReminderContext';
import AppLayout from './layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import SchedulePage from './pages/SchedulePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ReminderProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/medications" element={<MedicationsPage />} />

            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ReminderProvider>
    </BrowserRouter>
  );
}
