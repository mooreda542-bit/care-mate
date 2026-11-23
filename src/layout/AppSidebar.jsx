import { NavLink } from 'react-router-dom';
import { Home, Pill, CalendarClock, Settings, HeartPulse } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AppSidebar() {
  const { t, isRTL } = useLanguage();

  const navItemClass = ({ isActive }) =>
    `min-h-[56px] px-4 py-3 rounded-2xl text-base font-bold transition-all flex items-center gap-3.5 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-charcoal hover:text-primary hover:bg-surface-alt'
    }`;

  return (
    <aside
      className="hidden lg:flex flex-col w-72 bg-surface border-e border-border-line p-6 shrink-0 min-h-screen justify-between"
      aria-label="Desktop Sidebar"
    >
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
            <HeartPulse className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="flex flex-col text-start">
            <span className="text-2xl font-extrabold text-charcoal tracking-tight leading-none">
              Care<span className="text-primary">Mate</span>
            </span>
            <span className="text-xs font-bold text-muted mt-1">
              {isRTL ? 'رفيق الرعاية' : 'Senior Medication Care'}
            </span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="space-y-2.5" aria-label="Sidebar Navigation">
          <NavLink to="/dashboard" className={navItemClass}>
            <Home className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>{t('nav.dashboard')}</span>
          </NavLink>

          <NavLink to="/medications" className={navItemClass}>
            <Pill className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>{t('nav.medications')}</span>
          </NavLink>

          <NavLink to="/schedule" className={navItemClass}>
            <CalendarClock className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>{t('nav.schedule')}</span>
          </NavLink>

          <NavLink to="/settings" className={navItemClass}>
            <Settings className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span>{t('nav.settings')}</span>
          </NavLink>
        </nav>
      </div>

      {/* Helpful Senior Note at Bottom */}
      <div className="bg-primary-light/60 border border-primary/20 rounded-2xl p-4 text-start space-y-1">
        <p className="text-xs font-bold text-primary">
          {isRTL ? 'بياناتك بأمان' : 'Safe & Private'}
        </p>
        <p className="text-xs text-body leading-relaxed">
          {isRTL
            ? 'أدويتك ومواعيدك مسجلة على جهازك هذا فقط دون أي خوادم خارجية.'
            : 'Your routine stays safely on this device only without cloud servers.'}
        </p>
      </div>
    </aside>
  );
}
