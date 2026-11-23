import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useReminders } from '../context/ReminderContext';
import { HeartPulse, Globe, Bell } from 'lucide-react';

export default function AppHeader() {
  const { t, toggleLanguage, isRTL } = useLanguage();
  const { permission, requestPermission } = useReminders();
  const location = useLocation();

  // Determine current page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return t('nav.dashboard');
      case '/medications':
        return t('nav.medications');
      case '/schedule':
        return t('nav.schedule');
      case '/settings':
        return t('nav.settings');
      default:
        return t('nav.dashboard');
    }
  };

  // Formatted date string for senior-friendly clarity
  const currentDateDisplay = isRTL ? 'الإثنين، 23 نوفمبر 2026' : 'Monday, 23 Nov 2026';

  return (
    <header className="bg-surface/95 backdrop-blur-md border-b border-border-line sticky top-0 z-20 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Start: Mobile Brand Logo / Desktop Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile brand logo (visible only when sidebar is hidden) */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-charcoal tracking-tight">
            Care<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop Page Title & Context */}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xl font-bold text-charcoal leading-none">
            {getPageTitle()}
          </h1>
          <span className="text-xs sm:text-sm text-muted mt-1">{currentDateDisplay}</span>
        </div>
      </div>

      {/* End: Language Toggle & User Snapshot */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Permission Request Prompt if not decided yet */}
        {permission === 'default' && (
          <button
            type="button"
            onClick={requestPermission}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-status-warning-bg border border-status-warning/40 text-status-warning text-xs font-bold hover:bg-status-warning hover:text-white transition-all shadow-xs cursor-pointer"
            title={isRTL ? 'تفعيل تنبيهات المتصفح' : 'Enable Notifications'}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{isRTL ? 'تفعيل التنبيهات' : 'Enable Alerts'}</span>
          </button>
        )}

        {/* Mobile Date Stamp (readable text-xs) */}
        <span className="text-xs text-muted font-medium hidden sm:inline-block lg:hidden">
          {currentDateDisplay}
        </span>

        {/* Language Switcher Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-line text-xs sm:text-sm font-semibold text-primary hover:bg-primary-light transition-colors shadow-xs"
          title={t('lang.switchTo')}
          aria-label={t('lang.switchTo')}
        >
          <Globe className="w-4 h-4" />
          <span>{t('lang.toggle')}</span>
        </button>

        {/* User Avatar Circle */}
        <Link
          to="/settings"
          className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center border border-primary/20 shadow-xs hover:scale-105 transition-transform"
          title={t('nav.settings')}
        >
          {isRTL ? 'ف' : 'F'}
        </Link>
      </div>
    </header>
  );
}
