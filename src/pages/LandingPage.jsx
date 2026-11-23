import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HeartPulse,
  Clock,
  Bell,
  Eye,
  Languages,
  Search,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Pill,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';

export default function LandingPage() {
  const { t, isRTL, language, toggleLanguage } = useLanguage();
  const [demoDoseTaken, setDemoDoseTaken] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 md:space-y-24 pb-12 overflow-x-hidden">
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section id="hero" className="pt-4 md:pt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left/Start Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
              {/* Trust & Scope Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-xs">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal tracking-tight leading-[1.2]">
                {t('hero.headline')}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-body leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('hero.subheadline')}
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto min-h-[58px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  <span>{t('hero.ctaPrimary')}</span>
                  <ArrowIcon className="w-5 h-5 shrink-0" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto min-h-[58px] inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border-2 border-border-line hover:border-primary/50 bg-surface hover:bg-surface-alt text-charcoal font-bold text-base transition-all"
                >
                  <span>{t('hero.ctaSecondary')}</span>
                  <ChevronDown className="w-5 h-5 text-muted shrink-0" />
                </a>
              </div>

              {/* Verified Honest Scope Notes */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t('hero.heroSubNotePrototype')}
                </span>
                <span className="text-border-line hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {t('hero.heroSubNoteStorage')}
                </span>
              </div>
            </div>

            {/* Right/End Column: Interactive App Preview Card (Fictional Data Only) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Decorative background glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-light to-surface-alt rounded-3xl blur-md -z-10 opacity-70" />

                {/* Main Interactive Card */}
                <div className="bg-surface rounded-2xl border border-border-line p-5 sm:p-6 shadow-md space-y-4">
                  {/* Card Header & Clear Demo Indicator */}
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-charcoal tracking-wide uppercase">
                        {t('hero.previewTag')}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary-light">
                      {isRTL ? 'معاينة تجريبية' : 'Demo Preview'}
                    </span>
                  </div>

                  {/* Progress Bar Widget (Fictional Demo) */}
                  <div className="bg-surface-alt p-3.5 rounded-xl border border-border-subtle space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-body">{t('hero.previewProgressLabel')}</span>
                      <span className="text-primary font-bold">
                        {demoDoseTaken ? (isRTL ? '4 من 4 (تمت التجربة)' : '4 of 4 (Completed)') : t('hero.previewProgressRatio')}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-border-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: demoDoseTaken ? '100%' : '75%' }}
                      />
                    </div>
                  </div>

                  {/* Prominent Next Reminder Card (Fictional Medicine A) */}
                  <div className="bg-status-warning-bg/60 border border-status-warning/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-status-warning uppercase">
                        {t('hero.previewNextReminder')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          demoDoseTaken
                            ? 'bg-status-success-bg text-status-success border border-status-success/30'
                            : 'bg-status-warning-bg text-status-warning border border-status-warning/40'
                        }`}
                      >
                        {demoDoseTaken ? t('hero.previewTakenBadge') : t('hero.previewUpcomingBadge')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`text-base font-bold text-charcoal ${demoDoseTaken ? 'line-through text-muted' : ''}`}>
                            {t('hero.previewMedName')}
                          </p>
                          <p className="text-xs text-body">{t('hero.previewMedDose')}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-charcoal bg-surface px-2.5 py-1 rounded-lg border border-border-subtle">
                        {t('hero.previewTime')}
                      </span>
                    </div>

                    {/* Interactive Button */}
                    <button
                      type="button"
                      onClick={() => setDemoDoseTaken((prev) => !prev)}
                      className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        demoDoseTaken
                          ? 'bg-status-success-bg text-status-success border border-status-success/30 hover:bg-status-success-bg/80'
                          : 'bg-primary hover:bg-primary-dark text-white shadow-xs'
                      }`}
                    >
                      {demoDoseTaken ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isRTL ? 'تم التحديد (انقر للإلغاء)' : 'Marked (Click to reset)'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('hero.previewMarkTaken')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Past & Later Fictional Doses */}
                  <div className="space-y-2 pt-1 text-xs text-body">
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-alt/70">
                      <span className="flex items-center gap-2">
                        <span className="text-status-success font-bold">✓</span>
                        <span className="line-through text-muted">{t('hero.previewPastMed')}</span>
                      </span>
                      <span className="text-muted">08:00 {isRTL ? 'ص' : 'AM'}</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="text-muted">○</span>
                        <span>{t('hero.previewLaterMed')}</span>
                      </span>
                      <span className="text-muted">08:00 {isRTL ? 'م' : 'PM'}</span>
                    </div>
                  </div>

                  {/* Explicit Medical Safety & Demo Notice */}
                  <div className="pt-2 border-t border-border-subtle flex items-start gap-2 text-[11px] text-muted leading-relaxed">
                    <Info className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" />
                    <span>{t('hero.previewNote')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TRUST STRIP                                            */}
      {/* ========================================================= */}
      <section className="border-y border-border-line bg-surface py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trust Item 1: Local Storage */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-charcoal">{t('trust.item1.title')}</h3>
                <p className="text-xs text-body leading-relaxed">{t('trust.item1.desc')}</p>
              </div>
            </div>

            {/* Trust Item 2: Senior-Oriented Design */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-charcoal">{t('trust.item2.title')}</h3>
                <p className="text-xs text-body leading-relaxed">{t('trust.item2.desc')}</p>
              </div>
            </div>

            {/* Trust Item 3: Helpful Schedule Reminders */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-charcoal">{t('trust.item3.title')}</h3>
                <p className="text-xs text-body leading-relaxed">{t('trust.item3.desc')}</p>
              </div>
            </div>

            {/* Trust Item 4: Student Project Scope */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-charcoal">{t('trust.item4.title')}</h3>
                <p className="text-xs text-body leading-relaxed">{t('trust.item4.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FEATURES OVERVIEW                                      */}
      {/* ========================================================= */}
      <section id="features" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary tracking-wider uppercase bg-primary-light px-3 py-1 rounded-full border border-primary/20">
              {t('features.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              {t('features.title')}
            </h2>
            <p className="text-sm sm:text-base text-body leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          {/* Features 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Schedule Timeline */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f1.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f1.desc')}</p>
            </div>

            {/* Feature 2: Browser Reminders */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f2.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f2.desc')}</p>
            </div>

            {/* Feature 3: Senior Easy Mode Concept */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f3.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f3.desc')}</p>
            </div>

            {/* Feature 4: Arabic RTL & English */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f4.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f4.desc')}</p>
            </div>

            {/* Feature 5: Fast Search */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f5.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f5.desc')}</p>
            </div>

            {/* Feature 6: OCR Scanner (Marked Coming Soon) */}
            <div className="bg-surface p-6 rounded-2xl border border-border-line hover:border-primary/50 transition-all hover:shadow-sm space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-status-info-bg text-status-info flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-status-info-bg text-status-info border border-status-info/30">
                  {t('features.f6.badge')}
                </span>
              </div>
              <h3 className="text-base font-bold text-charcoal">{t('features.f6.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('features.f6.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. HOW IT WORKS                                           */}
      {/* ========================================================= */}
      <section id="how-it-works" className="bg-surface-alt/70 border-y border-border-line py-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary tracking-wider uppercase bg-surface px-3 py-1 rounded-full border border-border-line">
              {t('howItWorks.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              {t('howItWorks.title')}
            </h2>
            <p className="text-sm sm:text-base text-body leading-relaxed">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-surface p-7 rounded-2xl border border-border-line shadow-xs space-y-4 text-center md:text-start">
              <div className="w-12 h-12 rounded-xl bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-xs">
                {t('howItWorks.step1.num')}
              </div>
              <h3 className="text-lg font-bold text-charcoal">{t('howItWorks.step1.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('howItWorks.step1.desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface p-7 rounded-2xl border border-border-line shadow-xs space-y-4 text-center md:text-start">
              <div className="w-12 h-12 rounded-xl bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-xs">
                {t('howItWorks.step2.num')}
              </div>
              <h3 className="text-lg font-bold text-charcoal">{t('howItWorks.step2.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('howItWorks.step2.desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface p-7 rounded-2xl border border-border-line shadow-xs space-y-4 text-center md:text-start">
              <div className="w-12 h-12 rounded-xl bg-primary text-white font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-xs">
                {t('howItWorks.step3.num')}
              </div>
              <h3 className="text-lg font-bold text-charcoal">{t('howItWorks.step3.title')}</h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">{t('howItWorks.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SENIOR EASY MODE DESIGN CONCEPT HIGHLIGHT              */}
      {/* ========================================================= */}
      <section id="easy-mode" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-10 md:p-14 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Text Side: Principles of Easy Mode */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-start">
                <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
                  {t('easyMode.tag')}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug">
                  {t('easyMode.title')}
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t('easyMode.desc')}
                </p>

                {/* Accessibility Principles */}
                <div className="space-y-3 pt-2 text-xs sm:text-sm text-start max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>{t('easyMode.bullet1')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>{t('easyMode.bullet2')}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span>{t('easyMode.bullet3')}</span>
                  </div>
                </div>
              </div>

              {/* Design Concept Preview Card (Fictional Medicine A) */}
              <div className="lg:col-span-5">
                <div className="bg-surface text-charcoal rounded-2xl p-6 sm:p-8 shadow-lg space-y-5 border-2 border-white/40">
                  <div className="flex items-center justify-between pb-3 border-b border-border-line">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      {t('easyMode.previewBadge')}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-status-success" />
                  </div>

                  <div className="space-y-2 text-center sm:text-start">
                    <p className="text-2xl sm:text-3xl font-extrabold text-charcoal">
                      {t('easyMode.previewCardText')}
                    </p>
                    <p className="text-base sm:text-lg font-medium text-body">
                      {t('easyMode.previewCardSub')}
                    </p>
                  </div>

                  {/* High-visibility senior touch button demonstration */}
                  <div className="w-full h-14 sm:h-16 rounded-xl bg-status-success text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-sm text-center px-4">
                    <span>{t('easyMode.previewButton')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. MEDICAL SAFETY & DISCLAIMER SECTION                    */}
      {/* ========================================================= */}
      <section id="safety" className="scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-surface rounded-2xl border-2 border-status-warning/40 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-warning-bg text-status-warning flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-status-warning tracking-wider uppercase">
                  {t('safety.tag')}
                </span>
                <h3 className="text-lg font-bold text-charcoal">{t('safety.title')}</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-body leading-relaxed">
              {t('safety.desc')}
            </p>

            <div className="bg-status-warning-bg/40 p-4 rounded-xl border border-status-warning/30 text-xs sm:text-sm text-charcoal space-y-1.5">
              <p className="font-bold text-status-warning">{t('safety.boxTitle')}</p>
              <p className="leading-relaxed">{t('safety.boxContent')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FINAL CALL TO ACTION (CTA)                              */}
      {/* ========================================================= */}
      <section className="pt-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-surface-alt/90 border border-border-line rounded-3xl p-8 sm:p-12 space-y-6 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-xs">
              <HeartPulse className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                {t('ctaSection.title')}
              </h2>
              <p className="text-sm sm:text-base text-body leading-relaxed">
                {t('ctaSection.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto min-h-[58px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-md hover:shadow-lg"
              >
                <span>{t('ctaSection.buttonPrimary')}</span>
                <ArrowIcon className="w-5 h-5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="bg-surface-dark text-white/80 pt-14 pb-8 mt-16 border-t border-border-line">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Care<span className="text-primary-muted">Mate</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
                {t('footer.brandDesc')}
              </p>
            </div>

            {/* Quick Links column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                {t('footer.quickLinks')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    {t('nav.features')}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    {t('nav.howItWorks')}
                  </a>
                </li>
                <li>
                  <a href="#easy-mode" className="hover:text-white transition-colors">
                    {t('nav.accessibility')}
                  </a>
                </li>
                <li>
                  <a href="#safety" className="hover:text-white transition-colors">
                    {t('nav.safety')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Language & Academic Project column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wider uppercase">
                {t('footer.aboutApp')}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {t('footer.disclaimerSummary')}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
                >
                  <Languages className="w-3.5 h-3.5 text-primary-muted" />
                  <span>{language === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Copyright strip */}
          <div className="pt-6 border-t border-white/10 text-center text-xs text-muted">
            <p>{t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
