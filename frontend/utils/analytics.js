import { event as gaEvent } from "nextjs-google-analytics";

/**
 * Standardized Event Names
 */
export const ANALYTICS_EVENTS = {
  SEARCH_RATES: "search_rates",
  CLICK_PROVIDER: "click_provider",
  VIEW_RESULTS: "view_results",
  SESSION_START: "session_start",
};

/**
 * Track an event with standard parameters
 * @param {string} action - Event name (from ANALYTICS_EVENTS)
 * @param {object} params - Event parameters
 */
export const trackEvent = (action, params = {}) => {
  // Add retention metrics to every event if available
  const retention = getRetentionMetrics();

  if (typeof window !== 'undefined' && window.gtag) {
    gaEvent(action, {
      ...params,
      visit_count: retention.visitCount,
      days_since_last: retention.daysSinceLast,
      is_returning: retention.visitCount > 1,
    });
  } else {
    // Fallback or dev mode logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 Dev] ${action}`, { ...params, ...retention });
    }
  }
};

/**
 * Get (or create) persistent retention metrics from localStorage
 * To be called on app mount
 */
export const initRetentionTracking = () => {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'remitbuddy_retention';
  const now = new Date().getTime();
  const today = new Date().toDateString();

  let data = {
    visitCount: 0,
    lastVisitTime: now,
    lastVisitDate: '',
    firstSeenDate: new Date().toISOString(),
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      data = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Local storage error", e);
  }

  // Check if this is a new "Visit" (e.g., different day or session timeout)
  // For simplicity, we count a new visit if the date string is different
  if (data.lastVisitDate !== today) {
    data.visitCount += 1;
    data.lastVisitDate = today;

    // Calculate Days Since Last specific visit
    const daysSince = Math.floor((now - data.lastVisitTime) / (1000 * 60 * 60 * 24));
    data.daysSinceLast = daysSince; // Store temporarily for current session usage

    data.lastVisitTime = now; // Update time for next calculation

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Track Session Start with Retention Data
    trackEvent(ANALYTICS_EVENTS.SESSION_START, {
      cohort: data.firstSeenDate.substring(0, 7) // e.g. "2024-01"
    });
  }

  return data;
};

/**
 * Helper to get current metrics without mutating
 */
export const getRetentionMetrics = () => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('remitbuddy_retention');
    return stored ? JSON.parse(stored) : { visitCount: 1, daysSinceLast: 0 };
  } catch {
    return {};
  }
};