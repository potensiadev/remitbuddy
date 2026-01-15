import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';

/**
 * ShareButton Component
 *
 * Enhanced share functionality with multiple methods:
 * - Clipboard copy with toast notification
 * - Native share API (mobile)
 * - Kakao Talk (Korean market essential)
 *
 * @param {string} url - Share URL (optional, defaults to current URL)
 * @param {string} title - Share title
 * @param {string} description - Share description
 * @param {string} country - Country name (legacy prop)
 * @param {number} amount - Amount (legacy prop)
 * @param {string} currency - Currency code (legacy prop)
 * @param {number} savings - Savings amount (legacy prop)
 */
const ShareButton = ({
  url,
  title,
  description,
  country,
  amount,
  currency,
  savings,
  variant = 'default', // default, compact, minimal
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dropdownRef = useRef(null);

  // Generate share URL (support both new and legacy props)
  const shareUrl = url || (typeof window !== 'undefined'
    ? country
      ? `${window.location.origin}/compare/${country.toLowerCase()}?amount=${amount}`
      : window.location.href
    : '');

  // Generate share title
  const shareTitle = title || 'RemitBuddy - 송금 비교 결과';

  // Generate share text/description
  const shareText = description || (savings > 0
    ? t('share.text_with_savings', `${country}으로 ${parseInt(amount).toLocaleString()}원 송금 비교 결과! 최대 ${savings?.toLocaleString()}원 절약 가능 🎉`)
    : country
      ? t('share.text', `${country}으로 ${parseInt(amount).toLocaleString()}원 송금 비교 결과를 확인해보세요!`)
      : '송금 비교 결과를 확인해보세요!');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Copy to clipboard with toast
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);

      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'clipboard',
          content_type: 'comparison_result',
          item_id: country ? `${country.toLowerCase()}_${amount}` : 'comparison'
        });
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    setShowDropdown(false);
  };

  // Native share API (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });

        // Analytics tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            method: 'native',
            content_type: 'comparison_result',
            item_id: country ? `${country.toLowerCase()}_${amount}` : 'comparison'
          });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
    setShowDropdown(false);
  };

  // Kakao Talk share
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // Initialize with your Kakao app key (set in _app.js or env)
        // window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareText,
          imageUrl: 'https://www.remitbuddy.com/og-image.png',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl
          }
        },
        buttons: [
          {
            title: '비교 결과 보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl
            }
          }
        ]
      });

      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'kakao',
          content_type: 'comparison_result',
          item_id: country ? `${country.toLowerCase()}_${amount}` : 'comparison'
        });
      }
    } else {
      // Fallback: open Kakao story
      const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
      window.open(kakaoUrl, '_blank', 'width=600,height=400');
    }
    setShowDropdown(false);
  };

  // Check if native share is available
  const canNativeShare = typeof navigator !== 'undefined' && navigator.share;

  // Button variants
  const buttonVariants = {
    default: 'px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-200 hover:border-brand-300 shadow-sm',
    compact: 'px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
    minimal: 'px-2 py-2 hover:bg-neutral-100 text-neutral-600',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Share Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`inline-flex items-center gap-2 rounded-xl text-sm font-semibold transition-all ${buttonVariants[variant]}`}
        aria-label="공유하기"
        aria-expanded={showDropdown}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {variant !== 'minimal' && (
          <>
            <span>{t('share.button', '공유하기')}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop (mobile touch-friendly) */}
          <div
            className="fixed inset-0 z-40 bg-black/5 sm:bg-transparent"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden animate-scale-in origin-top-right"
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100">
              <p className="text-sm font-semibold text-neutral-900">공유하기</p>
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{shareUrl}</p>
            </div>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left group"
              role="menuitem"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                copied ? 'bg-success-100' : 'bg-neutral-100 group-hover:bg-neutral-200'
              }`}>
                {copied ? (
                  <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-medium block ${copied ? 'text-success-600' : 'text-neutral-900'}`}>
                  {copied ? t('share.copied', '복사됨!') : t('share.copy_link', '링크 복사')}
                </span>
                <span className="text-xs text-neutral-500">
                  {copied ? '클립보드에 저장되었습니다' : t('share.copy_link_desc', '클립보드에 복사')}
                </span>
              </div>
            </button>

            {/* Divider */}
            <div className="h-px bg-neutral-100 mx-4" />

            {/* Kakao Talk */}
            <button
              onClick={handleKakaoShare}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left group"
              role="menuitem"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FEE500] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#391B1B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.86 5.25 4.64 6.69-.2.75-.73 2.71-.84 3.13-.13.52.19.51.4.37.17-.11 2.61-1.77 3.67-2.48.7.1 1.42.15 2.13.15 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-neutral-900 block">{t('share.kakao', '카카오톡 공유')}</span>
                <span className="text-xs text-neutral-500">{t('share.kakao_desc', '친구에게 바로 전송')}</span>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Native Share (Mobile) */}
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left group border-t border-neutral-100"
                role="menuitem"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-neutral-900 block">{t('share.native', '다른 앱으로 공유')}</span>
                  <span className="text-xs text-neutral-500">{t('share.native_desc', '메시지, 이메일 등')}</span>
                </div>
                <svg className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">링크가 클립보드에 복사되었습니다</span>
          </div>
        </div>
      )}
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  country: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currency: PropTypes.string,
  savings: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'compact', 'minimal']),
  className: PropTypes.string,
};

ShareButton.defaultProps = {
  variant: 'default',
  className: '',
};

export default ShareButton;
