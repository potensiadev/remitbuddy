"use client";

import { useEffect, useState } from "react";

type AdPosition =
  | "atf-banner"
  | "before-content"
  | "in-content"
  | "after-content"
  | "sidebar"
  | "sidebar-sticky"
  | "in-feed"
  | "category-hero"
  | "end-of-page";

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

// 쿠팡파트너스 설정 - RemitBuddy용 (새로 발급 필요)
// TODO: 쿠팡 파트너스에서 RemitBuddy용 위젯 ID 발급 후 교체
const COUPANG_CONFIG = {
  id: 991132, // 쿠팡 파트너스 위젯 ID (교체 필요)
  trackingCode: "AF1644344", // 트래킹 코드 (교체 필요)
};

// 위치별 광고 사이즈 설정
const AD_CONFIG: Record<
  AdPosition,
  {
    mobile: { width: number; height: number };
    desktop: { width: number; height: number };
  }
> = {
  "atf-banner": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
  "before-content": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
  "in-content": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
  "after-content": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
  sidebar: {
    mobile: { width: 0, height: 0 },
    desktop: { width: 300, height: 250 },
  },
  "sidebar-sticky": {
    mobile: { width: 0, height: 0 },
    desktop: { width: 300, height: 600 },
  },
  "in-feed": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 970, height: 250 },
  },
  "category-hero": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
  "end-of-page": {
    mobile: { width: 320, height: 100 },
    desktop: { width: 728, height: 90 },
  },
};

// 쿠팡 광고 iframe 컴포넌트
const CoupangAd = ({ width, height }: { width: number; height: number }) => {
  const src = `https://ads-partners.coupang.com/widgets.html?id=${COUPANG_CONFIG.id}&template=carousel&trackingCode=${COUPANG_CONFIG.trackingCode}&subId=&width=${width}&height=${height}`;

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      scrolling="no"
      referrerPolicy="unsafe-url"
      style={{
        maxWidth: "100%",
        border: "none",
        display: "block",
      }}
    />
  );
};

const AdSlot = ({ position, className = "" }: AdSlotProps) => {
  const config = AD_CONFIG[position];
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // 위치별 스타일
  const positionStyles: Record<AdPosition, string> = {
    "atf-banner": "w-full",
    "before-content": "w-full py-4",
    "in-content": "w-full py-6 my-4",
    "after-content": "w-full py-6",
    sidebar: "w-full",
    "sidebar-sticky": "w-full",
    "in-feed": "w-full py-6",
    "category-hero": "w-full py-4",
    "end-of-page": "w-full py-6",
  };

  // 뷰포트 체크 전
  if (isMobile === null) {
    return (
      <div
        className={`ad-slot ${positionStyles[position]} ${className}`}
        style={{ minHeight: config.mobile.height || config.desktop.height }}
      />
    );
  }

  const currentConfig = isMobile ? config.mobile : config.desktop;

  // 해당 뷰포트에서 숨겨야 하면 렌더링하지 않음
  if (currentConfig.width === 0) {
    return null;
  }

  return (
    <div className={`ad-slot ${positionStyles[position]} ${className}`}>
      <div className="flex items-center justify-center">
        <CoupangAd width={currentConfig.width} height={currentConfig.height} />
      </div>
    </div>
  );
};

export default AdSlot;
