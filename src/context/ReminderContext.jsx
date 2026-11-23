/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { parseTimeStringToMinutes } from '../utils/timeParser';
import { Bell, Check, X, Clock } from 'lucide-react';

const STORAGE_KEY_ENABLED = 'caremate_reminders_enabled';
const STORAGE_KEY_MEDS = 'caremate_medications';
const SESSION_KEY_FIRED = 'caremate_reminders_fired_session';

function getLocalTodayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getInitialFiredSet() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const raw = window.sessionStorage.getItem(SESSION_KEY_FIRED);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    }
  } catch {
    // Fallback gracefully to empty Set if sessionStorage is unavailable
  }
  return new Set();
}

const ReminderContext = createContext();

export function ReminderProvider({ children }) {
  // 1. Permission status: 'unsupported' | 'default' | 'granted' | 'denied'
  const [permission, setPermission] = useState(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  // 2. User enabled toggle state: default to true so reminders are active out-of-the-box
  const [enabled, setEnabled] = useState(() => {
    return Boolean(getStorageItem(STORAGE_KEY_ENABLED, true));
  });

  // 3. Active in-app reminder alert toast (works 100% reliably in any browser tab without requiring OS permissions)
  const [activeAlert, setActiveAlert] = useState(null);

  // Track fired events to prevent duplicates in current session / day
  // Structure: Set of keys `YYYY-MM-DD_medId_minute_chunkIdx`
  const firedRemindersRef = useRef(getInitialFiredSet());

  // Last evaluated time key (`YYYY-MM-DD_minute`)
  const lastCheckedKeyRef = useRef(null);

  // Sync state if user changes it
  const toggleEnabled = useCallback((nextVal) => {
    const val = typeof nextVal === 'boolean' ? nextVal : !enabled;
    setEnabled(val);
    setStorageItem(STORAGE_KEY_ENABLED, val);
  }, [enabled]);

  // Request browser permission explicitly
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported';
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        toggleEnabled(true);
      }
      return res;
    } catch (err) {
      console.warn('[CareMate Reminders] Permission request failed:', err);
      return Notification.permission;
    }
  }, [toggleEnabled]);

  // Check reminder events
  const checkReminders = useCallback(() => {
    if (!enabled) return;

    const now = new Date();
    const currentMinute = now.getHours() * 60 + now.getMinutes();
    const todayStr = getLocalTodayString();
    const checkKey = `${todayStr}_${currentMinute}`;

    // Prevent burst catch-ups or redundant checks if minute hasn't changed
    if (lastCheckedKeyRef.current === checkKey) {
      return;
    }
    lastCheckedKeyRef.current = checkKey;

    // Fetch latest user medications
    const storedMeds = getStorageItem(STORAGE_KEY_MEDS, []);
    if (!Array.isArray(storedMeds) || storedMeds.length === 0) return;

    storedMeds.forEach((med) => {
      if (!med.times || typeof med.times !== 'string') return;

      const chunks = med.times.split(/[,،;|\n]+/).map((s) => s.trim()).filter(Boolean);

      chunks.forEach((chunk, chunkIdx) => {
        const parsedMinutes = parseTimeStringToMinutes(chunk);
        if (parsedMinutes === null) return; // Ignore unscheduled or ambiguous times

        // Check if the current minute matches or within a 1-minute window
        // (to guarantee detection even if computer wakes from sleep or tab was throttled)
        const diff = currentMinute - parsedMinutes;
        const isDue = diff >= 0 && diff <= 1;

        if (isDue) {
          const dedupeKey = `${todayStr}_${med.id}_${parsedMinutes}_${chunkIdx}`;
          if (!firedRemindersRef.current.has(dedupeKey)) {
            firedRemindersRef.current.add(dedupeKey);

            // Persist to sessionStorage so provider remounts / refreshes do not duplicate
            try {
              if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.setItem(
                  SESSION_KEY_FIRED,
                  JSON.stringify(Array.from(firedRemindersRef.current))
                );
              }
            } catch {
              // Ignore sessionStorage errors
            }

            // A. Always trigger in-app banner alert (100% reliable inside active browser tab)
            setActiveAlert({
              id: dedupeKey,
              medName: med.name,
              time: chunk,
              instructions: med.instructions || '',
            });

            // B. If native browser Notification permission is granted, also dispatch native OS notification
            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              const title = `CareMate: موعد دواء ${med.name}`;
              const body = `${chunk}${med.instructions ? ' — ' + med.instructions : ''}`;

              try {
                new Notification(title, {
                  body,
                  icon: '/favicon.svg',
                  tag: dedupeKey,
                });
              } catch (err) {
                console.warn('[CareMate Reminders] Unable to display native notification:', err);
              }
            }
          }
        }
      });
    });
  }, [enabled]);

  // Lightweight interval (ticks every 10 seconds to catch minute changes cleanly without heavy polling)
  useEffect(() => {
    if (!enabled) return;

    // Run initial check
    checkReminders();

    const intervalId = setInterval(() => {
      checkReminders();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [enabled, checkReminders]);

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  return (
    <ReminderContext.Provider
      value={{
        permission,
        enabled,
        toggleEnabled,
        requestPermission,
        activeAlert,
        dismissAlert,
      }}
    >
      {children}

      {/* Floating In-App Reminder Alert Modal / Toast */}
      {activeAlert && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-5 inset-x-4 sm:inset-x-auto sm:end-6 sm:w-96 z-50 bg-primary text-white p-5 rounded-3xl shadow-2xl border-2 border-white/20 animate-in fade-in slide-in-from-top-4 duration-300 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shrink-0 shadow-sm">
                <Bell className="w-7 h-7" />
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-white/80 block uppercase tracking-wider">
                  حان موعد الدواء الآن ⏰
                </span>
                <h4 className="text-xl font-black text-white truncate max-w-[200px]">
                  {activeAlert.medName}
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissAlert}
              className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-start space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-white/90">
              <Clock className="w-4 h-4" />
              <span>الموعد: {activeAlert.time}</span>
            </div>
            {activeAlert.instructions && (
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {activeAlert.instructions}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={dismissAlert}
            className="w-full min-h-[48px] py-2.5 px-4 bg-white text-primary font-black text-base rounded-xl hover:bg-surface-alt transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>حسناً، تم الاطلاع</span>
          </button>
        </div>
      )}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
}
