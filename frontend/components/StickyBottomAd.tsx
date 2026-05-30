"use client";

import { useState, useEffect } from "react";

interface StickyBottomAdProps {
  className?: string;
  reopenAfterScroll?: number;
}

// 쿠팡파트너스 Sticky 배너 설정 - RemitBuddy용
// TODO: 쿠팡 파트너스에서 RemitBuddy용 위젯 ID 발급 후 교체
const COUPANG_STICKY = {
  id: 991132, // 쿠팡 파트너스 위젯 ID (교체 필요)
  trackingCode: "AF1644344", // 트래킹 코드 (교체 필요)
  width: 320,
  height: 50,
};

const StickyBottomAd = ({
  className = "",
  reopenAfterScroll = 500,
}: StickyBottomAdProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [closedAt, setClosedAt] = useState<number | null>(null);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);

  // 초기 표시 타이밍 (1.5초 후)
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(showTimer);
  }, []);

  // 스크롤 핸들링
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // 상단 근처에서는 숨김
      if (currentScroll < 200) {
        setIsVisible(false);
        return;
      }

      // 닫은 후 일정 스크롤 시 재표시
      if (closedAt !== null) {
        const scrolledSinceClosed = Math.abs(currentScroll - closedAt);
        if (scrolledSinceClosed > reopenAfterScroll) {
          setIsVisible(true);
          setClosedAt(null);
        }
      } else if (!hasScrolledEnough && currentScroll > 200) {
        setIsVisible(true);
        setHasScrolledEnough(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closedAt, reopenAfterScroll, hasScrolledEnough]);

  const handleClose = () => {
    setIsVisible(false);
    setClosedAt(window.scrollY);
  };

  if (!isVisible) return null;

  // iframe URL 생성
  const iframeSrc = `https://ads-partners.coupang.com/widgets.html?id=${COUPANG_STICKY.id}&template=carousel&trackingCode=${COUPANG_STICKY.trackingCode}&subId=&width=${COUPANG_STICKY.width}&height=${COUPANG_STICKY.height}`;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transform transition-transform duration-300 lg:hidden ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="relative max-w-screen-xl mx-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute -top-10 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-10"
          aria-label="Close ad"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 광고 컨테이너 */}
        <div className="px-4 py-2 flex items-center justify-center">
          <iframe
            src={iframeSrc}
            width={COUPANG_STICKY.width}
            height={COUPANG_STICKY.height}
            frameBorder="0"
            scrolling="no"
            referrerPolicy="unsafe-url"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyBottomAd;
