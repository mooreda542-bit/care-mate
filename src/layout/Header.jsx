import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HeartPulse, Globe, Menu, X, ArrowLeft, ArrowRight, Home, Pill, CalendarClock, Settings } from 'lucide-react';

export default function Header() {
  const { t, toggleLanguage, isRTL } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const appNavLinkClass = ({ isActive }) =>
    `min-h-[48px] px-4 py-2.5 rounded-xl text-base font-bold transition-all flex items-center gap-2 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-charcoal hover:text-primary hover:bg-surface-alt'
    }`;

  const landingAnchorClass =
    'min-h-[48px] px-3.5 py-2 rounded-xl text-base font-semibold text-charcoal hover:text-primary hover:bg-surface-alt transition-colors inline-flex items-center';

  return (
    <header className="bg-surface border-b border-border-line sticky top-0 z-50 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Big, Clear & Senior-Friendly */}
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
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
        </Link>

        {/* Desktop Navigation Links */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            <a href="#features" className={landingAnchorClass}>
              {t('nav.features')}
            </a>
            <a href="#how-it-works" className={landingAnchorClass}>
              {t('nav.howItWorks')}
            </a>
            <a href="#easy-mode" className={landingAnchorClass}>
              {t('nav.accessibility')}
            </a>
            <a href="#safety" className={landingAnchorClass}>
              {t('nav.safety')}
            </a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-2" aria-label="App Navigation">
            <NavLink to="/dashboard" className={appNavLinkClass}>
              <Home className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t('nav.dashboard')}</span>
            </NavLink>
            <NavLink to="/medications" className={appNavLinkClass}>
              <Pill className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t('nav.medications')}</span>
            </NavLink>
            <NavLink to="/schedule" className={appNavLinkClass}>
              <CalendarClock className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t('nav.schedule')}</span>
            </NavLink>
            <NavLink to="/settings" className={appNavLinkClass}>
              <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{t('nav.settings')}</span>
            </NavLink>
          </nav>
        )}

        {/* Action Controls: Language Switcher, Primary CTA, Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button - High Visibility */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 border-border-line text-sm font-bold text-charcoal hover:border-primary hover:text-primary bg-surface-alt transition-colors flex items-center gap-2"
            title={t('lang.switchTo')}
            aria-label={t('lang.switchTo')}
          >
            <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
            <span>{t('lang.toggle')}</span>
          </button>

          {/* Direct App Entry CTA (Instant access - No fake auth walls) */}
          {isLanding ? (
            <Link
              to="/dashboard"
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>{t('hero.ctaPrimary')}</span>
              <ArrowIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to="/"
              className="hidden lg:inline-flex min-h-[48px] px-4 py-2.5 rounded-xl border border-border-line text-sm font-semibold text-body hover:bg-surface-alt transition-colors items-center"
            >
              {t('nav.backToHome')}
            </Link>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden min-h-[48px] min-w-[48px] p-2.5 rounded-xl text-charcoal hover:bg-surface-alt focus:outline-none flex items-center justify-center border border-border-line"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-line bg-surface px-4 py-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-md">
          {isLanding ? (
            <div className="flex flex-col space-y-2">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center"
              >
                {t('nav.features')}
              </a>
              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center"
              >
                {t('nav.howItWorks')}
              </a>
              <a
                href="#easy-mode"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center"
              >
                {t('nav.accessibility')}
              </a>
              <a
                href="#safety"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center"
              >
                {t('nav.safety')}
              </a>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{t('hero.ctaPrimary')}</span>
                  <ArrowIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center gap-3"
              >
                <Home className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>{t('nav.dashboard')}</span>
              </NavLink>
              <NavLink
                to="/medications"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center gap-3"
              >
                <Pill className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>{t('nav.medications')}</span>
              </NavLink>
              <NavLink
                to="/schedule"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center gap-3"
              >
                <CalendarClock className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>{t('nav.schedule')}</span>
              </NavLink>
              <NavLink
                to="/settings"
                onClick={closeMobileMenu}
                className="min-h-[48px] text-base font-bold text-charcoal hover:text-primary py-3 px-4 rounded-xl hover:bg-surface-alt flex items-center gap-3"
              >
                <Settings className="w-5 h-5 text-primary" aria-hidden="true" />
                <span>{t('nav.settings')}</span>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
