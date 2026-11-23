import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-lg mx-auto py-6 sm:py-10">
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border-2 border-border-line shadow-sm space-y-8 text-center">
        {/* App Icon & Welcome */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-sm">
            <HeartPulse className="w-9 h-9" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-charcoal">{t('auth.loginTitle')}</h1>
          <p className="text-base text-body font-medium leading-relaxed max-w-sm mx-auto">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Clear Senior Privacy Banner */}
        <div className="bg-primary-light/80 border border-primary/30 rounded-2xl p-5 text-start flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">
              {isRTL ? 'لا حاجة لكلمة مرور أو حساب' : 'No Password or Account Needed'}
            </p>
            <p className="text-sm text-body leading-relaxed">
              {t('auth.demoNoticeLogin')}
            </p>
          </div>
        </div>

        {/* Big, Obvious, Primary Entry Button (Min height 56px) */}
        <div>
          <Link
            to="/dashboard"
            className="w-full min-h-[58px] inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            <span>{t('auth.btnGuestLogin')}</span>
            <ArrowIcon className="w-6 h-6 shrink-0" aria-hidden="true" />
          </Link>
          <p className="text-xs text-muted mt-2 font-medium">
            {t('auth.fieldDisabledHint')}
          </p>
        </div>

        {/* Quick Benefits Bullet List */}
        <div className="pt-2 border-t border-border-line text-start space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-body font-semibold">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <span>{isRTL ? 'إضافة وجدولة مواعيد جميع أدويتك' : 'Organize all your medication times'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-body font-semibold">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <span>{isRTL ? 'تنبيهات وتذكيرات مباشرة عند موعد كل جرعة' : 'Direct reminders at scheduled intake times'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-body font-semibold">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <span>{isRTL ? 'تصوير الروشتات الطبية وقراءتها بالكاميرا' : 'Camera prescription scanning tool'}</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <Link
            to="/"
            className="text-sm font-bold text-muted hover:text-primary transition-colors underline"
          >
            {t('nav.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
