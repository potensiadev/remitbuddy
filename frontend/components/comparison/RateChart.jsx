import { useTranslation } from 'next-i18next';

/**
 * RateChart Component
 *
 * Mini 7-day rate trend chart (simulated data for now)
 */
const RateChart = ({ currency, currentRate }) => {
  const { t } = useTranslation('common');

  // Simulated 7-day data (in production, this would come from API)
  const generateSimulatedData = () => {
    const baseRate = currentRate || 1;
    const variance = baseRate * 0.02; // 2% variance
    return Array.from({ length: 7 }, (_, i) => {
      const dayOffset = 6 - i;
      const randomVariance = (Math.random() - 0.5) * variance;
      return {
        day: dayOffset === 0 ? 'Today' : `${dayOffset}d`,
        rate: baseRate + randomVariance,
        isToday: dayOffset === 0
      };
    });
  };

  const data = generateSimulatedData();
  const rates = data.map(d => d.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const range = maxRate - minRate || 1;

  const isBetterThanAvg = currentRate >= avgRate;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{t('rate_chart.title', 'Rate Trend')}</h4>
          <p className="text-xs text-gray-500">{t('rate_chart.subtitle', 'Last 7 days')}</p>
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isBetterThanAvg ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {isBetterThanAvg ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {t('rate_chart.better_than_avg', 'Better than average')}
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {t('rate_chart.worse_than_avg', 'Below average')}
            </>
          )}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 flex items-end gap-1">
        {data.map((point, index) => {
          const height = ((point.rate - minRate) / range) * 100;
          const normalizedHeight = Math.max(20, Math.min(100, height || 50));

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all ${
                  point.isToday ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                style={{ height: `${normalizedHeight}%` }}
              />
              <span className={`text-[10px] ${point.isToday ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
                {point.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.avg', '7-day avg')}:</span>{' '}
          <span className="text-gray-700">{avgRate.toFixed(2)}</span>
        </div>
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.high', 'High')}:</span>{' '}
          <span className="text-green-600">{maxRate.toFixed(2)}</span>
        </div>
        <div className="text-gray-500">
          <span className="font-medium">{t('rate_chart.low', 'Low')}:</span>{' '}
          <span className="text-red-500">{minRate.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default RateChart;
