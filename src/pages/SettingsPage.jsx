import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useReminders } from '../context/ReminderContext';
import {
  Bell,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { removeStorageItem } from '../utils/storage';

export default function SettingsPage() {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { enabled, toggleEnabled, permission, requestPermission } = useReminders();
  const [clearedNotice, setClearedNotice] = useState(false);

  // Clear demo data handler
  const handleResetData = () => {
    if (window.confirm(isRTL ? 'هل تريد بالتأكيد إعادة ضبط بياناتك المسجلة؟' : 'Are you sure you want to reset your local data?')) {
      removeStorageItem('caremate_medications');
      removeStorageItem('caremate_doses_taken_today');
      setClearedNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-3xl mx-auto text-start">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b-2 border-border-line">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
          {t('settings.pageTitle')}
        </h1>
        <p className="text-base sm:text-lg text-body font-medium">
          {t('settings.pageSubtitle')}
        </p>
      </div>

      {clearedNotice && (
        <div className="bg-status-success-bg border-2 border-status-success/30 rounded-2xl p-4 text-status-success font-bold text-center">
          {isRTL ? 'تمت إعادة ضبط البيانات بنجاح جارٍ التحديث...' : 'Data reset successfully. Reloading...'}
        </div>
      )}

      {/* 1. Language Setting Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-border-line space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal">
              {t('settings.languageSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-body font-medium">
              {t('settings.languageSectionDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <span className="text-base sm:text-lg font-bold text-charcoal">
            {t('settings.currentLanguageLabel')}{' '}
            <span className="text-primary font-black underline">
              {language === 'ar' ? 'العربية' : 'English'}
            </span>
          </span>

          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[52px] px-8 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-base sm:text-lg transition-all shadow-sm cursor-pointer"
          >
            {t('settings.btnSwitchLanguage')} ({language === 'ar' ? 'English' : 'العربية'})
          </button>
        </div>
      </div>

      {/* 2. Reminders Setting Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-border-line space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal">
              {t('settings.remindersSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-body font-medium">
              {t('settings.remindersSectionDesc')}
            </p>
          </div>
        </div>

        <div className="bg-primary-light/60 border border-primary/20 rounded-2xl p-4 text-sm sm:text-base text-body leading-relaxed font-medium">
          {t('settings.remindersNotice')}
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border-subtle">
          <div>
            <p className="text-base sm:text-lg font-bold text-charcoal">
              {t('settings.enableRemindersLabel')}
            </p>
            <p className="text-xs sm:text-sm text-muted font-medium">
              {t('settings.enableRemindersDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleEnabled()}
            aria-pressed={enabled}
            className={`min-h-[48px] px-6 py-2.5 rounded-2xl font-extrabold text-base transition-all cursor-pointer ${
              enabled
                ? 'bg-status-success text-white shadow-sm'
                : 'bg-surface-alt border-2 border-border-line text-body hover:border-primary'
            }`}
          >
            {enabled ? (isRTL ? 'مفعل ✓' : 'Enabled ✓') : (isRTL ? 'معطل' : 'Disabled')}
          </button>
        </div>

        {/* Permission Request if not granted */}
        {permission !== 'granted' && (
          <div className="pt-2">
            <button
              type="button"
              onClick={requestPermission}
              className="w-full min-h-[52px] px-6 py-3 rounded-2xl bg-primary-light text-primary hover:bg-primary hover:text-white font-bold text-base transition-all border border-primary/30 cursor-pointer"
            >
              {t('settings.btnRequestPermission')}
            </button>
          </div>
        )}
      </div>

      {/* 3. Privacy & Reset Data Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-border-line space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-surface-alt text-charcoal flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal">
              {isRTL ? 'الخصوصية وإعادة الضبط' : 'Privacy & Data Reset'}
            </h2>
            <p className="text-sm sm:text-base text-body font-medium">
              {isRTL
                ? 'بياناتك محفوظة محلياً على جهازك الحالي فقط.'
                : 'All medication records are stored locally on your device only.'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle">
          <p className="text-xs sm:text-sm text-muted font-medium">
            {isRTL
              ? 'يمكنك مسح الأدوية المسجلة والبدء من جديد في أي وقت.'
              : 'You can clear your saved routine and start fresh at any time.'}
          </p>

          <button
            type="button"
            onClick={handleResetData}
            className="min-h-[48px] px-6 py-2.5 rounded-xl border-2 border-status-error/30 text-status-error hover:bg-status-error-bg font-bold text-sm sm:text-base transition-all cursor-pointer shrink-0"
          >
            {isRTL ? 'إعادة ضبط البيانات' : 'Reset Local Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
