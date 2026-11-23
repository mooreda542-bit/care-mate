import { Link } from 'react-router-dom';
import { HelpCircle, LayoutDashboard, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { t, isRtl } = useLanguage();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-lg mx-auto py-8 sm:py-12 px-4">
      <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border-line shadow-sm text-center space-y-6">
        {/* Visual Badge & Icon */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary">
            <HelpCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-surface-alt border border-border-subtle text-xs font-bold text-primary tracking-wider">
            {t('notFound.badge')}
          </div>
        </div>

        {/* Title & Helpful Explanation */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            {t('notFound.title')}
          </h1>
          <p className="text-sm sm:text-base text-body leading-relaxed max-w-md mx-auto">
            {t('notFound.desc')}
          </p>
        </div>

        {/* Dual Navigation Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {/* Primary Action: Go to Dashboard */}
          <Link
            to="/dashboard"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{t('notFound.btnDashboard')}</span>
            <ArrowIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>

          {/* Secondary Action: Back to Home */}
          <Link
            to="/"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-alt border border-border-line text-charcoal text-sm sm:text-base font-semibold rounded-xl hover:bg-border-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            <Home className="w-5 h-5 shrink-0 text-body" aria-hidden="true" />
            <span>{t('notFound.btnHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
