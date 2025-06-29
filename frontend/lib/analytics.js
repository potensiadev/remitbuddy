// lib/analytics.js
export function getOrCreateUuid() {
  // SSR 환경 보호
  if (typeof window === "undefined") return null;
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("uuid", uuid);
  }
  return uuid;
}

export function getDeviceInfo() {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Macintosh/i.test(ua)) return "Mac";
  return "Other";
}

export function logEvent(eventObj) {
  // SSR 방지
  if (typeof window === "undefined") return;
  // 나중에 API에 보내면 fetch로 바꾸세요!
  console.log("EVENT_LOG", eventObj);
}
