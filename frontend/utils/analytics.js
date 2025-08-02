// utils/analytics.js - 올바른 이벤트 분리 버전

// Session tracking
let sessionStartTime = null;

// Get or create device UUID (SSR 안전 버전)
export const getDeviceUUID = () => {
  if (typeof window === 'undefined') return '';
  
  try {
    let uuid = localStorage.getItem('remitbuddy_uuid');
    if (!uuid) {
      if (crypto && crypto.randomUUID) {
        uuid = crypto.randomUUID();
      } else {
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      localStorage.setItem('remitbuddy_uuid', uuid);
    }
    return uuid;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return 'temp-' + Date.now();
  }
};

export const getDeviceCategory = () => {
  if (typeof window === 'undefined') return 'Unknown';
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  return isMobile ? 'Mobile' : 'Desktop';
};

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

export const getCountryFromLang = (lang) => {
  const langToCountry = {
    'vi': 'VN', 'ko': 'KR', 'en': 'US', 'th': 'TH',
    'my': 'MM', 'ne': 'NP', 'id': 'ID', 'km': 'KH',
    'tl': 'PH', 'fil': 'PH', 'uz': 'UZ', 'si': 'LK', 'ta': 'LK'
  };
  return langToCountry[lang] || 'US';
};

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

export const getSessionDuration = () => {
  if (!sessionStartTime) return 0;
  return Math.round((Date.now() - sessionStartTime) / 1000);
};

export const startSession = () => {
  if (!sessionStartTime) {
    sessionStartTime = Date.now();
    console.log('🎯 세션 시작됨:', new Date().toISOString());
  }
};

const getAmountRange = (amount) => {
  if (!amount || amount <= 0) return 'unknown';
  if (amount < 100000) return '0-100k';
  if (amount < 500000) return '100k-500k';
  if (amount < 1000000) return '500k-1M';
  return '1M+';
};

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
    
    const gaEventData = {
      user_uuid: uuid,
      lang: lang,
      country: country,
      device_category: deviceCategory,
      device_type: deviceType,
      browser: browser,
      session_duration_range: getSessionDurationRange(sessionDuration),
      session_duration_seconds: sessionDuration,
      
      ...(additionalData.amount && {
        amount: additionalData.amount,
        transfer_amount_value: parseInt(additionalData.amount),
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
      
      ...Object.fromEntries(
        Object.entries(additionalData).filter(([key]) => 
          !['amount', 'transfer_currency', 'country', 'provider'].includes(key)
        )
      )
    };

    console.log('📊 Event logged:', eventType, gaEventData);
    
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('📈 GA 이벤트 전송 중:', eventType);
      window.gtag('event', eventType, gaEventData);
      console.log('✅ GA 이벤트 전송 완료:', eventType);
    } else {
      console.error('❌ GA가 로드되지 않음');
    }
    
    // Backend logging (optional)
    try {
      await fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...gaEventData,
          event: eventType,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      });
    } catch (backendError) {
      console.warn('Backend logging failed:', backendError);
    }
    
  } catch (error) {
    console.error('Failed to log event:', error);
  }
};

// 🔥 명확히 분리된 이벤트들

// 세션 시작 이벤트 (퍼널 분석 필요시 수동 호출)
export const logSessionStart = () => {
  console.log('🎯 세션 시작 이벤트');
  logEvent('session_start', {
    session_start_time: new Date().toISOString(),
    is_new_session: true,
    page_title: "RemitBuddy - Session Start",
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
};

// 1단계: 메인 화면 보기
export const logViewMain = () => {
  startSession();
  console.log('🏠 메인 화면 보기 이벤트');
  logEvent('view_main', {
    page_title: "RemitBuddy - Main View",
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
};

// 2단계: 첫 번째 CTA 클릭 (환율 비교하기)
export const logClickedCTA = (amount, country, currency) => {
  console.log('🚀 첫 번째 CTA 클릭 이벤트:', { amount, country, currency });
  logEvent('clicked_cta', { 
    amount: amount,
    country: country, 
    transfer_currency: currency,
    is_first_search: true  // 🔥 첫 번째 검색임을 명시
  });
};

// 3단계: 재비교 (Compare Again) - 🔥 다른 이벤트명 사용
export const logCompareAgain = (amount, country, currency) => {
  console.log('🔄 Compare Again 이벤트 (재검색)');
  logEvent('compare_again', {  // 🔥 'clicked_cta'가 아닌 'compare_again' 사용
    amount: amount,
    country: country,
    transfer_currency: currency,
    is_repeat_search: true,
    search_term: `${amount}_KRW_to_${currency}`
  });
};

// 4단계: 업체 선택
export const logClickedProvider = (providerName, amount, country, currency, additionalContext = {}) => {
  console.log('🏦 Provider 클릭 이벤트:', providerName);
  logEvent('clicked_provider', { 
    content_type: 'provider',
    content_id: providerName,
    provider: providerName,
    amount: amount,
    country: country,
    transfer_currency: currency,
    ...additionalContext
  });
};


// 기타 이벤트들
export const logSendingCountrySwitch = (currency) => {
  console.log('🌍 국가 변경 이벤트:', currency);
  logEvent('sending_country_switch', { 
    item_category: 'destination_country',
    item_name: currency,
    transfer_currency: currency
  });
};