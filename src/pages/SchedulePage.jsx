import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStorageItem } from '../utils/storage';
import { parseTimeStringToMinutes } from '../utils/timeParser';
import {
  CalendarClock,
  Pill,
  Clock,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const STORAGE_KEY = 'caremate_medications';

export default function SchedulePage() {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // 1. Read medications directly from approved LocalStorage key
  const medications = useMemo(() => {
    const stored = getStorageItem(STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  }, []);

  // 2. Classify entries into:
  //    - Scheduled timeline items (split by multiple recognized comma-separated times if user specified e.g. "08:00 ص, 02:00 م")
  //    - Unscheduled / ambiguous entries
  const { scheduledItems, unscheduledItems } = useMemo(() => {
    const scheduled = [];
    const unscheduled = [];

    medications.forEach((med) => {
      const rawTimes = med.times ? med.times.trim() : '';
      if (!rawTimes) {
        unscheduled.push({
          med,
          reason: 'empty',
          displayTime: null,
        });
        return;
      }

      // Check if user entered multiple comma/semicolon/dash separated times
      // e.g. "08:00 AM, 02:00 PM" or "8:00 ص ، 2:00 م"
      const chunks = rawTimes
        .split(/[,،;|\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      let anyParsed = false;

      chunks.forEach((chunk, chunkIdx) => {
        const minutes = parseTimeStringToMinutes(chunk);
        if (minutes !== null) {
          anyParsed = true;
          scheduled.push({
            id: `${med.id}_${minutes}_${chunkIdx}`,
            med,
            minutes,
            displayTime: chunk,
          });
        }
      });

      // If none of the chunks could be safely interpreted, keep the original in unscheduled
      if (!anyParsed) {
        unscheduled.push({
          med,
          reason: 'unrecognized',
          displayTime: rawTimes,
        });
      }
    });

    // Chronologically sort scheduled items by minute of the day (0 to 1439).
    // Tie-breaker: sort deterministically by medication name then id
    scheduled.sort((a, b) => {
      if (a.minutes !== b.minutes) {
        return a.minutes - b.minutes;
      }
      return (a.med.name || '').localeCompare(b.med.name || '') || a.id.localeCompare(b.id);
    });

    return {
      scheduledItems: scheduled,
      unscheduledItems: unscheduled,
    };
  }, [medications]);

  const totalMeds = medications.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER                                           */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0 shadow-xs">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal">
                {t('schedule.pageTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {t('schedule.pageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Link: Manage / Edit in Medications */}
        <Link
          to="/medications"
          className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md text-base sm:text-lg self-start sm:self-auto min-h-[52px]"
        >
          <Pill className="w-5 h-5 shrink-0" />
          <span>{t('schedule.reviewMedsAction')}</span>
          <ArrowIcon className="w-5 h-5 shrink-0 ms-1" />
        </Link>
      </div>

      {/* Prominent Safety & Organizer Notice */}
      <div className="bg-surface rounded-xl border border-border-line p-3 sm:p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-body leading-relaxed">
          {t('schedule.organizerNotice')}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. EMPTY STATE: NO MEDICATIONS SAVED AT ALL              */}
      {/* ========================================================= */}
      {totalMeds === 0 ? (
        <div className="bg-surface rounded-2xl border border-border-line p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-xs">
            <CalendarClock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-charcoal">
              {t('schedule.emptyNoMedsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-body leading-relaxed max-w-sm mx-auto">
              {t('schedule.emptyNoMedsDesc')}
            </p>
          </div>
          <Link
            to="/medications"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-all shadow-xs text-sm sm:text-base min-h-[48px]"
          >
            <Pill className="w-5 h-5" />
            <span>{t('schedule.emptyNoMedsAction')}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ===================================================== */}
          {/* 3. SCHEDULED TIMELINE SECTION                         */}
          {/* ===================================================== */}
          {scheduledItems.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{t('schedule.timelineTitle')}</span>
                  <span className="text-xs font-semibold text-muted bg-surface px-2.5 py-0.5 rounded-full border border-border-subtle ms-1">
                    {scheduledItems.length}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-0.5">
                  {t('schedule.timelineSubtitle')}
                </p>
              </div>

              {/* Chronological List of Cards */}
              <div className="space-y-4">
                {scheduledItems.map((item, index) => {
                  const { med, displayTime } = item;
                  return (
                    <div
                      key={item.id || index}
                      className="bg-surface rounded-3xl border-2 border-border-line p-5 sm:p-6 shadow-xs hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 text-start"
                    >
                      {/* Left: Time Badge + Medication Info */}
                      <div className="flex items-start gap-4 min-w-0">
                        {/* High-visibility user-entered clock time badge */}
                        <div className="bg-primary text-white font-black text-lg sm:text-xl px-4 py-3 rounded-2xl flex items-center gap-2.5 shrink-0 shadow-sm">
                          <Clock className="w-5 h-5" />
                          <span dir="ltr">{displayTime}</span>
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl sm:text-2xl font-black text-charcoal truncate">
                              {med.name}
                            </h3>
                          </div>

                          {med.instructions && (
                            <p className="text-base sm:text-lg text-body font-semibold leading-relaxed">
                              {med.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Edit button shortcut */}
                      <div className="shrink-0 pt-2 md:pt-0">
                        <Link
                          to="/medications"
                          className="min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-border-line hover:border-primary text-primary font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-all hover:bg-primary-light"
                        >
                          <span>{t('schedule.editInMedsAction')}</span>
                          <ArrowIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Medications exist, but none have recognized schedule times
            <div className="bg-surface rounded-2xl border border-border-line p-6 sm:p-8 text-center space-y-3 max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-status-warning-bg text-status-warning flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-charcoal">
                {t('schedule.emptyNoScheduledTimesTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {t('schedule.emptyNoScheduledTimesDesc')}
              </p>
            </div>
          )}

          {/* ===================================================== */}
          {/* 4. UNSCHEDULED / AMBIGUOUS ENTRIES SECTION            */}
          {/* ===================================================== */}
          {unscheduledItems.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border-line">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-charcoal flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-status-warning" />
                  <span>{t('schedule.unscheduledTitle')}</span>
                  <span className="text-xs font-semibold text-muted bg-surface px-2.5 py-0.5 rounded-full border border-border-subtle ms-1">
                    {unscheduledItems.length}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-0.5">
                  {t('schedule.unscheduledSubtitle')}
                </p>
              </div>

              {/* Grid of Unscheduled Medication Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {unscheduledItems.map(({ med, reason, displayTime }) => (
                  <div
                    key={med.id}
                    className="bg-surface rounded-xl border border-border-line p-4 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Pill className="w-4 h-4 text-muted flex-shrink-0" />
                          <h3 className="text-sm sm:text-base font-bold text-charcoal truncate">
                            {med.name}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-alt text-muted border border-border-subtle flex-shrink-0">
                          {reason === 'empty'
                            ? t('schedule.noTimeBadge')
                            : t('schedule.unrecognizedTimeBadge')}
                        </span>
                      </div>

                      {/* Display original user-entered text if available */}
                      {displayTime && (
                        <div className="bg-surface-alt p-2 rounded-lg border border-border-subtle text-xs">
                          <span className="text-muted block text-[11px]">
                            {t('schedule.userEnteredTime')}
                          </span>
                          <span className="font-semibold text-charcoal">{displayTime}</span>
                        </div>
                      )}

                      {/* Instructions */}
                      {med.instructions && (
                        <p className="text-xs text-body leading-relaxed">
                          {med.instructions}
                        </p>
                      )}
                    </div>

                    {/* Edit Action Link */}
                    <div className="pt-2 border-t border-border-subtle flex justify-end">
                      <Link
                        to="/medications"
                        className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                      >
                        <span>{t('schedule.editInMedsAction')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
