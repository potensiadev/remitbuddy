import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProviderResultCard from "../../components/ProviderResultCard";
import { logEvent, getDeviceInfo, getOrCreateUuid } from "../../lib/analytics";

export default function ResultPage() {
  const router = useRouter();
  const { lang = "en", amount = "1000000", country = "VN" } = router.query;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const uuid = getOrCreateUuid();
  const device = getDeviceInfo();

  useEffect(() => {
    if (!amount || !country) return;
    fetch(`/api/getRemittanceQuote?amount=${amount}&country=${country}`)
      .then(res => res.json())
      .then(data => setResults(data.results))
      .finally(() => setLoading(false));
  }, [amount, country]);

  // Provider 클릭 이벤트
  const handleProviderClick = (provider) => {
    logEvent({
      uuid, lang, country: "KR", device,
      event: "clicked_provider",
      provider,
      timestamp: new Date().toISOString(),
    });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F6F6FA] flex flex-col items-center">
      {/* 헤더 & 카드 (생략, 동일 구조) */}
      <div className="w-full max-w-sm pt-5 text-sm text-gray-600 text-center mb-2">Sorted by Most Receive Amount</div>
      <div className="w-full max-w-sm flex flex-col gap-3">
        {results.map((r, i) => (
          <ProviderResultCard
            key={r.provider}
            provider={r}
            best={i === 0}
            onClick={() => handleProviderClick(r.provider)}
          />
        ))}
      </div>
      <button
        className="w-full max-w-sm h-12 mt-8 rounded-xl bg-gray-700 text-white font-extrabold text-[1.13rem]"
        onClick={() => {
          logEvent({
            uuid, lang, country: "KR", device,
            event: "compare_again",
            timestamp: new Date().toISOString(),
          });
          router.back();
        }}
      >
        Compare Again
      </button>
    </div>
  );
}
