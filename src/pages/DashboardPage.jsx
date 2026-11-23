import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { parseTimeStringToMinutes } from '../utils/timeParser';
import {
  Clock,
  CalendarClock,
  Pill,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY_MEDS = 'caremate_medications';
const STORAGE_KEY_TAKEN = 'caremate_doses_taken_today';

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function DashboardPage() {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // 1. Read real user medications from LocalStorage
  const savedMedications = useMemo(() => {
    const stored = getStorageItem(STORAGE_KEY_MEDS, []);
    return Array.isArray(stored) ? stored : [];
  }, []);

  // 2. Read taken status for today (keyed by date string YYYY-MM-DD)
  const todayKey = useMemo(() => getTodayString(), []);
  const [takenMap, setTakenMap] = useState(() => {
    const raw = getStorageItem(STORAGE_KEY_TAKEN, {});
    return raw && typeof raw === 'object' && raw[todayKey] ? raw[todayKey] : {};
  });

  const toggleDoseTaken = (doseId) => {
    setTakenMap((prev) => {
      const updated = { ...prev, [doseId]: !prev[doseId] };
      const fullStorage = getStorageItem(STORAGE_KEY_TAKEN, {});
      setStorageItem(STORAGE_KEY_TAKEN, {
        ...fullStorage,
        [todayKey]: updated,
      });
      return updated;
    });
  };

  // 3. Extract and chronologically sort all daily scheduled doses from user's medications
  const { dailyDoses, unscheduledCount } = useMemo(() => {
    const doses = [];
    let unscheduled = 0;

    savedMedications.forEach((med) => {
      const rawTimes = med.times ? med.times.trim() : '';
      if (!rawTimes) {
        unscheduled += 1;
        return;
      }

      const chunks = rawTimes
        .split(/[,،;|\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      let parsedAny = false;
      chunks.forEach((chunk, idx) => {
        const minutes = parseTimeStringToMinutes(chunk);
        if (minutes !== null) {
          parsedAny = true;
          doses.push({
            id: `${med.id}_${minutes}_${idx}`,
            medId: med.id,
            name: med.name,
            instructions: med.instructions,
            timeDisplay: chunk,
            minutes,
          });
        }
      });

      if (!parsedAny) {
        unscheduled += 1;
      }
    });

    // Sort ascending by time (minute of day)
    doses.sort((a, b) => a.minutes - b.minutes);

    return { dailyDoses: doses, unscheduledCount: unscheduled };
  }, [savedMedications]);

  const totalDosesCount = dailyDoses.length;
  const completedDosesCount = dailyDoses.filter((d) => takenMap[d.id]).length;
  const remainingDosesCount = totalDosesCount - completedDosesCount;
  const nextUpcomingDose = dailyDoses.find((d) => !takenMap[d.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. WELCOME & QUICK REASSURANCE BANNER                     */}
      {/* ========================================================= */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-border-line shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 text-start">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
            {t('dashboard.greeting')}
          </h1>
          <p className="text-base sm:text-lg text-body font-medium leading-relaxed">
            {t('dashboard.subgreeting')}
          </p>
        </div>

        {/* Big Add Medication Button */}
        <Link
          to="/medications"
          className="min-h-[56px] w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-sm hover:shadow-md active:scale-[0.99] shrink-0"
        >
          <Plus className="w-6 h-6 shrink-0" />
          <span>{t('dashboard.actionAddMed')}</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 2. NEXT DOSE CARD (HIGHEST PRIORITY FOR SENIORS)         */}
      {/* ========================================================= */}
      {totalDosesCount > 0 && nextUpcomingDose && (
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-start">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm sm:text-base font-bold backdrop-blur-xs">
              <Clock className="w-5 h-5" />
              <span>{t('dashboard.nextReminderTag')}</span>
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-wide text-white/90">
              {nextUpcomingDose.timeDisplay}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {nextUpcomingDose.name}
            </h2>
            {nextUpcomingDose.instructions && (
              <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed">
                {nextUpcomingDose.instructions}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => toggleDoseTaken(nextUpcomingDose.id)}
              className="w-full sm:w-auto min-h-[58px] inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-white hover:bg-surface-alt text-primary font-black text-lg sm:text-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>{t('dashboard.nextReminderAction')}</span>
            </button>
          </div>
        </div>
      )}

      {/* All doses done celebration banner */}
      {totalDosesCount > 0 && !nextUpcomingDose && (
        <div className="bg-status-success-bg border-2 border-status-success/30 rounded-3xl p-6 sm:p-8 text-start flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-status-success shrink-0 mt-1" />
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-status-success">
              {t('dashboard.allCompletedTitle')}
            </h2>
            <p className="text-base text-body font-medium leading-relaxed">
              {t('dashboard.allCompletedDesc')}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TODAY'S PROGRESS SUMMARY STATS                         */}
      {/* ========================================================= */}
      {totalDosesCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Total */}
          <div className="bg-surface rounded-2xl p-6 border-2 border-border-line text-start space-y-1">
            <p className="text-sm sm:text-base font-bold text-muted">{t('dashboard.totalScheduled')}</p>
            <p className="text-3xl sm:text-4xl font-black text-charcoal">{totalDosesCount}</p>
            <p className="text-xs sm:text-sm text-body">{t('dashboard.totalScheduledSub')}</p>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-surface rounded-2xl p-6 border-2 border-border-line text-start space-y-1">
            <p className="text-sm sm:text-base font-bold text-status-success">{t('dashboard.completedDoses')}</p>
            <p className="text-3xl sm:text-4xl font-black text-status-success">{completedDosesCount}</p>
            <p className="text-xs sm:text-sm text-body">{t('dashboard.completedDosesSub')}</p>
          </div>

          {/* Card 3: Remaining */}
          <div className="bg-surface rounded-2xl p-6 border-2 border-border-line text-start space-y-1">
            <p className="text-sm sm:text-base font-bold text-primary">{t('dashboard.remainingDoses')}</p>
            <p className="text-3xl sm:text-4xl font-black text-primary">{remainingDosesCount}</p>
            <p className="text-xs sm:text-sm text-body">{t('dashboard.remainingDosesSub')}</p>
          </div>
        </div>
      ) : (
        /* Empty State: Clear, Kind, Senior-Friendly guidance */
        <div className="bg-surface rounded-3xl p-8 sm:p-14 border-2 border-dashed border-border-line text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto shadow-xs">
            <Pill className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
              {t('dashboard.emptyTitle')}
            </h2>
            <p className="text-base sm:text-lg text-body max-w-md mx-auto leading-relaxed">
              {t('dashboard.emptyDesc')}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/medications"
              className="w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-sm"
            >
              <Plus className="w-6 h-6" />
              <span>{t('dashboard.emptyAction')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TODAY'S DOSE LIST (EASY SCANNING & ONE-TAP ACTION)    */}
      {/* ========================================================= */}
      {totalDosesCount > 0 && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-border-line space-y-6 text-start">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-line pb-4">
            <h3 className="text-2xl font-extrabold text-charcoal">
              {t('dashboard.timelineTitle')}
            </h3>
            <p className="text-sm text-muted font-medium">
              {t('dashboard.timelineSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {dailyDoses.map((dose) => {
              const isTaken = Boolean(takenMap[dose.id]);
              return (
                <div
                  key={dose.id}
                  className={`p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isTaken
                      ? 'bg-surface-alt/60 border-border-subtle opacity-75'
                      : 'bg-surface border-border-line hover:border-primary/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isTaken
                          ? 'bg-status-success-bg text-status-success'
                          : 'bg-primary-light text-primary'
                      }`}
                    >
                      <Clock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xl sm:text-2xl font-extrabold text-charcoal">
                          {dose.name}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-surface-alt border border-border-subtle text-sm font-black text-primary">
                          {dose.timeDisplay}
                        </span>
                      </div>
                      {dose.instructions && (
                        <p className="text-sm sm:text-base text-body font-medium">
                          {dose.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleDoseTaken(dose.id)}
                    className={`min-h-[52px] px-6 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                      isTaken
                        ? 'bg-status-success-bg text-status-success hover:bg-status-success/20'
                        : 'bg-primary hover:bg-primary-dark text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    <span>{isTaken ? t('dashboard.statusTaken') : t('dashboard.nextReminderAction')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unscheduled notification if any exist */}
      {unscheduledCount > 0 && (
        <div className="bg-surface-alt border-2 border-border-line rounded-2xl p-5 text-start flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
            <p className="text-base text-body font-semibold">
              {isRTL
                ? `لديك ${unscheduledCount} دواء مسجل بدون موعد محدد بالساعة.`
                : `You have ${unscheduledCount} medication(s) without a specific clock time.`}
            </p>
          </div>
          <Link
            to="/schedule"
            className="text-base font-bold text-primary hover:underline flex items-center gap-1.5"
          >
            <span>{t('schedule.reviewMedsAction')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. QUICK SHORTCUTS                                        */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
        <Link
          to="/medications"
          className="bg-surface hover:bg-surface-alt rounded-2xl p-6 border-2 border-border-line transition-all flex items-center justify-between gap-4 group shadow-xs"
        >
          <div className="flex items-center gap-4 text-start">
            <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-charcoal group-hover:text-primary transition-colors">
                {t('nav.medications')}
              </h4>
              <p className="text-sm text-body font-medium">
                {t('dashboard.savedMedsCountSub')}
              </p>
            </div>
          </div>
          <ArrowIcon className="w-6 h-6 text-muted group-hover:text-primary transition-colors shrink-0" />
        </Link>

        <Link
          to="/schedule"
          className="bg-surface hover:bg-surface-alt rounded-2xl p-6 border-2 border-border-line transition-all flex items-center justify-between gap-4 group shadow-xs"
        >
          <div className="flex items-center gap-4 text-start">
            <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <CalendarClock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-charcoal group-hover:text-primary transition-colors">
                {t('nav.schedule')}
              </h4>
              <p className="text-sm text-body font-medium">
                {t('dashboard.actionViewScheduleDesc')}
              </p>
            </div>
          </div>
          <ArrowIcon className="w-6 h-6 text-muted group-hover:text-primary transition-colors shrink-0" />
        </Link>
      </div>
    </div>
  );
}
