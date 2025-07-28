// utils/analytics.js - 기존 gtag.js와 완전 연동된 최종 버전
import { v4 as uuidv4 } from 'uuid';

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

// Get amount range for better segmentation
const getAmountRange = (amount) => {
  if (!amount || amount <= 0) return 'unknown';
  if (amount < 100000) return '0-100k';
  if (amount < 500000) return '100k-500k';
  if (amount < 1000000) return '500k-1M';
  return '1M+';
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

// Core event logging function
export const logEvent = async (eventType, additionalData = {}) => {
  if (typeof window === 'undefined') return;
  
  const uuid = getDeviceUUID();
  const deviceCategory = getDeviceCategory();
  const deviceType = getDeviceType();
  const browser = getBrowserInfo();
  const lang = document.documentElement.lang || 'en';
  const country = getCountryFromLang(lang);
  
  // Prepare event data for Google Analytics 4
  const gaEventData = {
    // Core tracking data
    uuid,
    lang,
    country,
    device_category: deviceCategory,
    device_type: deviceType,
    browser,
    user_session_duration: getSessionDuration(),
    
    // Business-specific data (conditionally added)
    ...(additionalData.amount && {
      amount: parseInt(additionalData.amount),
      amount_range: getAmountRange(additionalData.amount)
    }),
    
    ...(additionalData.transfer_currency && {
      transfer_currency: additionalData.transfer_currency
    }),
    
    ...(additionalData.country && {
      receiving_country: additionalData.country,
      corridor: `KR-${additionalData.country}`
    }),
    
    ...(additionalData.provider && {
      provider: additionalData.provider
    }),
    
    // Include any other additional data (excluding processed fields)
    ...Object.fromEntries(
      Object.entries(additionalData).filter(([key]) => 
        !['amount', 'transfer_currency', 'country', 'provider'].includes(key)
      )
    )
  };

  // Full event data for backend (includes more fields)
  const backendEventData = {
    ...gaEventData,
    event: eventType,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  try {
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event logged:', eventType, gaEventData);
    }
    
    // Send to Google Analytics 4 using existing gtag setup
    if (typeof window !== 'undefined' && window.gtag) {
      // Direct gtag call (compatible with existing gtag.js setup)
      window.gtag('event', eventType, gaEventData);
    }
    
    // Send to backend API for backup
    await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendEventData)
    });
    
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

// Specific event logging functions matching your frontend code
export const logPageView = () => {
  startSession();
  logEvent('view_main', {
    page_title: "RemitBuddy - Compare Exchange Rate",
    page_location: window.location.href
  });
};

export const logClickedCTA = (amount, country, currency) => {
  logEvent('click_compare_rates_now', { 
    amount: amount,
    country: country, 
    transfer_currency: currency
  });
};

export const logCompareAgain = (amount, country, currency) => {
  logEvent('click_compare_again', {
    amount: amount,
    country: country,
    transfer_currency: currency,
    is_repeat_search: true
  });
};

export const logClickedProvider = (providerName, amount, country, currency, additionalContext = {}) => {
  logEvent('click_provider', { 
    provider: providerName,
    amount: amount,
    country: country,
    transfer_currency: currency,
    ...additionalContext
  });
};

export const logSendingCountrySwitch = (currency) => {
  logEvent('sending_country_switched', { 
    transfer_currency: currency
  });
};