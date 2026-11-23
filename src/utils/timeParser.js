/**
 * Safe, conservative time parser for user-entered time strings.
 * Supports:
 * - 24-hour formats: "14:00", "08:30"
 * - 12-hour English formats: "08:00 AM", "8:00am", "2:00 PM", "8 AM"
 * - 12-hour Arabic formats: "08:00 ص", "8 ص", "02:00 م", "8:30م"
 * - Arabic-Indic numerals: "٠٨:٠٠ ص", "١٤:٣٠"
 *
 * Returns minutes from midnight (0..1439) if safely recognized, or null if ambiguous.
 */
export function parseTimeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const raw = timeStr.trim();
  if (!raw) return null;

  // Reject composite sentences with connective words
  if (/\b(and|or|to)\b/i.test(raw) || /(و|أو|إلى)/.test(raw)) {
    return null;
  }

  // Normalize Arabic-Indic digits (٠-٩) to ASCII digits (0-9)
  const normalized = raw.replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632).trim();

  // AM / PM indicator detection (Arabic & English)
  // Check for AM: "am", "a.m.", "ص", "صباح", "صباحاً"
  // Check for PM: "pm", "p.m.", "م", "مساء", "مساءً"
  const hasAM =
    /\b(am|a\.m\.)\b|(?<![a-zA-Z])am(?![a-zA-Z])|(صباحاً|صباح|\bص\b)/i.test(normalized) ||
    /[0-9]\s*(am|ص)/i.test(normalized);
  const hasPM =
    /\b(pm|p\.m\.)\b|(?<![a-zA-Z])pm(?![a-zA-Z])|(مساءً|مساء|\bم\b)/i.test(normalized) ||
    /[0-9]\s*(pm|م)/i.test(normalized);

  // If both or conflicting, reject
  if (hasAM && hasPM) return null;

  // Pattern A: Clock with colon "HH:MM"
  const colonMatch = normalized.match(
    /^(\d{1,2})\s*:\s*(\d{2})(?:\s*([a-zA-Z\u0600-\u06FF.]+))?$/
  );
  if (colonMatch) {
    const hours = parseInt(colonMatch[1], 10);
    const minutes = parseInt(colonMatch[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    if (hasPM) {
      // 12-hour PM notation: hours must be 1..12 (e.g. "14:00 PM" is invalid)
      if (hours < 1 || hours > 12) return null;
      const pmHours = hours === 12 ? 12 : hours + 12;
      return pmHours * 60 + minutes;
    }

    if (hasAM) {
      // 12-hour AM notation: hours must be 1..12 (e.g. "13:00 AM" is invalid)
      if (hours < 1 || hours > 12) return null;
      const amHours = hours === 12 ? 0 : hours;
      return amHours * 60 + minutes;
    }

    // 24-hour notation without AM/PM marker
    // If extra text was captured that was neither valid AM nor valid PM, reject
    if (colonMatch[3]) return null;

    return hours * 60 + minutes;
  }

  // Pattern B: Bare hour with AM/PM indicator (e.g. "8 AM", "2 pm", "8 ص", "9 م")
  const hourMatch = normalized.match(/^(\d{1,2})\s*([a-zA-Z\u0600-\u06FF.]+)$/);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    if (hours >= 1 && hours <= 12) {
      if (hasPM) {
        const pmHours = hours === 12 ? 12 : hours + 12;
        return pmHours * 60;
      }
      if (hasAM) {
        const amHours = hours === 12 ? 0 : hours;
        return amHours * 60;
      }
    }
  }

  return null;
}
