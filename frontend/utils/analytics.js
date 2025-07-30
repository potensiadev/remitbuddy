// utils/analytics.js - 완전한 버전

// Session tracking
let sessionStartTime = null;

// Get or create device UUID
export const getDeviceUUID = () => {
  if (typeof window === 'undefined') return '';
  
  let uuid = localStorage.getItem('remitbuddy_uuid');
  if (!uuid) {
    // Use crypto.randomUUID if available, fallback to timestamp-based UUID
    if (crypto && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      // Fallback UUID generation
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    localStorage.setItem('remitbuddy_uuid', uuid);
  }
  return uuid;
};

// Get device category (mobile/desktop)
export const getDeviceCategory = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  return isMobile ? 'Mobile' : 'Desktop';
};

// Get device type (more specific)
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  
  if (/iPad/i.test(userAgent)) return 'iPad';
  if (/iPhone/i.test(userAgent)) return 'iPhone';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Macintosh/i.test(userAgent)) return 'Mac';
  
  return 'Other';
};

// Get country from language
export const getCountryFromLang = (lang) => {
  const langToCountry = {
    'vi': 'VN',
    'ko': 'KR',
    'en': 'US',
    'th': 'TH',
    'my': 'MM',
    'ne': 'NP',
    'id': 'ID'
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

// Session duration functions
export const getSessionDuration = () => {
  if (!sessionStartTime) return 0;
  return Math.round((Date.now() - sessionStartTime) / 1000); // in seconds
};

export const startSession = () => {
  if (!sessionStartTime) {
    sessionStartTime = Date.now();
  }
};

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
  
  try {
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
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event logged:', eventType, gaEventData);
    }
    
    // Send to Google Analytics 4 using existing gtag setup
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('📈 GA 이벤트 전송 중:', eventType, gaEventData);
      window.gtag('event', eventType, gaEventData);
      console.log('✅ GA 이벤트 전송 완료');
    } else {
      console.error('❌ GA가 로드되지 않음 - window.gtag가 없음');
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

// Specific event logging functions
export const logPageView = () => {
  startSession();
  logEvent('page_view', {
    page_title: "RemitBuddy - Compare Exchange Rate",
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
};

export const logClickedCTA = (amount, country, currency) => {
  console.log('🚀 CTA 클릭 이벤트 호출됨:', { amount, country, currency });
  
  logEvent('begin_checkout', { 
    amount: amount,
    country: country, 
    transfer_currency: currency,
    value: parseInt(amount) || 0
  });
};

export const logCompareAgain = (amount, country, currency) => {
  logEvent('search', {
    amount: amount,
    country: country,
    transfer_currency: currency,
    search_term: `${amount}_KRW_to_${currency}`,
    is_repeat_search: true
  });
};

export const logClickedProvider = (providerName, amount, country, currency, additionalContext = {}) => {
  logEvent('select_content', { 
    content_type: 'provider',
    content_id: providerName,
    provider: providerName,
    amount: amount,
    country: country,
    transfer_currency: currency,
    value: parseInt(amount) || 0,
    ...additionalContext
  });
};

export const logSendingCountrySwitch = (currency) => {
  logEvent('select_item', { 
    item_category: 'destination_country',
    item_name: currency,
    transfer_currency: currency
  });
};