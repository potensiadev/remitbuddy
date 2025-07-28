import { v4 as uuidv4 } from 'uuid';
import { event } from '../lib/gtag';

// Get or create device UUID
export const getDeviceUUID = () => {
  if (typeof window === 'undefined') return null;
  
  let uuid = localStorage.getItem('device_uuid');
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem('device_uuid', uuid);
  }
  return uuid;
};

// Detect device category (Mobile/PC)
export const getDeviceCategory = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'Mobile';
  }
  
  return 'PC';
};

// Detect specific device type
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Mobile devices
  if (/iPad/.test(userAgent) && !window.MSStream) {
    return 'iPad';
  }
  if (/iPhone/.test(userAgent) && !window.MSStream) {
    return 'iPhone';
  }
  if (/iPod/.test(userAgent) && !window.MSStream) {
    return 'iPod';
  }
  if (/android/i.test(userAgent)) {
    // Try to detect specific Android devices
    if (/samsung/i.test(userAgent)) return 'Samsung Android';
    if (/lg/i.test(userAgent)) return 'LG Android';
    if (/huawei/i.test(userAgent)) return 'Huawei Android';
    if (/xiaomi/i.test(userAgent)) return 'Xiaomi Android';
    return 'Android';
  }
  
  // Desktop devices
  if (/Windows/.test(userAgent)) {
    return 'Windows PC';
  }
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return 'Mac';
  }
  if (/Linux/.test(userAgent)) {
    return 'Linux PC';
  }
  
  return 'Unknown';
};

// Get country from language
export const getCountryFromLang = (lang) => {
  const langToCountry = {
    'vi': 'VN',
    'ko': 'KR',
    'en': 'US'
  };
  return langToCountry[lang] || 'US';
};

// Get browser information
export const getBrowserInfo = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  
  return 'Unknown';
};

// Log event to backend
export const logEvent = async (eventType, additionalData = {}) => {
  if (typeof window === 'undefined') return;
  
  const uuid = getDeviceUUID();
  const deviceCategory = getDeviceCategory();
  const deviceType = getDeviceType();
  const browser = getBrowserInfo();
  const lang = document.documentElement.lang || 'en';
  const country = getCountryFromLang(lang);
  
  const eventData = {
    uuid,
    lang,
    country,
    device_category: deviceCategory,
    device_type: deviceType,
    browser,
    event: eventType,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...additionalData
  };
  
  try {
    // For development, log to console
    console.log('📊 Event logged:', eventData);
    
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      const { event: eventName, ...properties } = eventData;
      window.gtag('event', eventName, {
        ...properties,
        custom_map: {
          custom_parameter_1: 'device_category',
          custom_parameter_2: 'device_type',
          custom_parameter_3: 'browser'
        }
      });
    }
    
    // Also send to backend API for backup
    await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

// Session tracking
let sessionStartTime = null;

export const getSessionDuration = () => {
  if (!sessionStartTime) return 0;
  return Math.round((Date.now() - sessionStartTime) / 1000); // in seconds
};

export const startSession = () => {
  if (!sessionStartTime) {
    sessionStartTime = Date.now();
  }
};

// Specific event logging functions
export const logPageView = () => {
  startSession();
  logEvent('view_main', {
    session_duration: getSessionDuration()
  });
};

export const logClickedCTA = (amount, country, currency) => {
  logEvent('click_compare_rates_now', { 
    amount,
    country,
    currency,
    transfer_currency: currency,
    session_duration: getSessionDuration()
  });
};

export const logCompareAgain = (amount, country, currency) => {
  logEvent('click_compare_again', {
    amount,
    country,
    transfer_currency: currency,
    session_duration: getSessionDuration()
  });
};

export const logClickedProvider = (providerName, amount, country, currency) => {
  logEvent('click_provider', { 
    provider: providerName,
    amount,
    country,
    transfer_currency: currency,
    session_duration: getSessionDuration()
  });
};

export const logSendingCountrySwitch = (currency) => {
  logEvent('sending_country_switched', { 
    transfer_currency: currency,
    session_duration: getSessionDuration()
  });
};