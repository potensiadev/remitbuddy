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

// Detect device from user agent
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }
  if (/Windows/.test(userAgent)) {
    return 'Windows';
  }
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return 'MacOS';
  }
  if (/Linux/.test(userAgent)) {
    return 'Linux';
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

// Log event to backend
export const logEvent = async (eventType, additionalData = {}) => {
  if (typeof window === 'undefined') return;
  
  const uuid = getDeviceUUID();
  const device = getDeviceType();
  const lang = document.documentElement.lang || 'en';
  const country = getCountryFromLang(lang);
  
  const eventData = {
    uuid,
    lang,
    country,
    device,
    event: eventType,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  try {
    // For development, log to console
    console.log('📊 Event logged:', eventData);
    
    // Send to backend API
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

// Specific event logging functions
export const logClickedCTA = () => {
  logEvent('clicked_cta');
};

export const logCompareAgain = () => {
  logEvent('compare_again');
};

export const logClickedProvider = (providerName) => {
  logEvent('clicked_provider', { provider: providerName });
};

export const logSendingCountrySwitch = (currency) => {
  logEvent('sending_country_switched', { currency });
};