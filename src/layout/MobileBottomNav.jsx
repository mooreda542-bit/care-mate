import { NavLink } from 'react-router-dom';
import { Home, Pill, CalendarClock, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 min-h-[60px] py-2 transition-all relative ${
      isActive
        ? 'text-primary font-bold bg-primary-light/50'
        : 'text-body hover:text-charcoal'
    }`;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 bg-surface/98 backdrop-blur-md border-t-2 border-border-line z-40 shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Dashboard (Home) */}
        <NavLink to="/dashboard" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Home className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-body'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {t('nav.dashboard')}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-1 bg-primary rounded-b-full" />
              )}
            </>
          )}
        </NavLink>

        {/* 2. Medications */}
        <NavLink to="/medications" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Pill className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-body'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {t('nav.medications')}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-1 bg-primary rounded-b-full" />
              )}
            </>
          )}
        </NavLink>

        {/* 3. Schedule */}
        <NavLink to="/schedule" className={navItemClass}>
          {({ isActive }) => (
            <>
              <CalendarClock className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-body'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {t('nav.schedule')}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-1 bg-primary rounded-b-full" />
              )}
            </>
          )}
        </NavLink>

        {/* 4. Settings */}
        <NavLink to="/settings" className={navItemClass}>
          {({ isActive }) => (
            <>
              <Settings className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-body'}`} aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                {t('nav.settings')}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-1 bg-primary rounded-b-full" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
