/**
 * CareMate LocalStorage Utility Helpers
 * Safe read/write/remove operations with error boundaries and fallbacks.
 */

export function getStorageItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    // Attempt parsing as JSON; if it's a raw unquoted string, fallback to raw value
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (error) {
    console.warn(`[CareMate] Unable to read LocalStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem(key, value) {
  try {
    const serialized = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[CareMate] Unable to write LocalStorage key "${key}":`, error);
    return false;
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[CareMate] Unable to remove LocalStorage key "${key}":`, error);
    return false;
  }
}
