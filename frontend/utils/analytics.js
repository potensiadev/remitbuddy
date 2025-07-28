// utils/analytics.js - 매개변수 이름 수정된 버전
import { v4 as uuidv4 } from 'uuid';

// Get amount range for better segmentation
const getAmountRange = (amount) => {
  if (!amount || amount <= 0) return 'unknown';
  if (amount < 100000) return '0-100k';
  if (amount < 500000) return '100k-500k';
  if (amount < 1000000) return '500k-1M';
  return '1M+';
};

// Get session duration range for categorical analysis
const getSessionDurationRange = (duration) => {
  if (duration <= 30) return '0-30s';
  if (duration <= 60) return '30-60s';
  if (duration <= 120) return '60-120s';
  return '120s+';
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
  const sessionDuration = getSessionDuration();
  
  // Prepare event data for Google Analytics 4
  const gaEventData = {
    // Core tracking data (측정기준용)
    user_uuid: uuid,
    lang: lang,
    country: country,
    device_category: deviceCategory,
    device_type: deviceType,
    browser: browser,
    session_duration_range: getSessionDurationRange(sessionDuration),
    
    // 측정항목용 수치 데이터
    session_duration_seconds: sessionDuration,
    
    // Business-specific data (conditionally added)
    ...(additionalData.amount && {
      transfer_amount_value: parseInt(additionalData.amount), // 측정항목
      amount_range: getAmountRange(additionalData.amount)     // 측정기준
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

// 나머지 함수들은 동일...
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