import React from 'react';
import { useTranslation } from 'next-i18next';

export const ViewToggle = ({ view, onViewChange }) => {
  const { t } = useTranslation('common');

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('cards')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'cards'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {t('view_toggle.cards', 'Cards')}
        </span>
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'table'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {t('view_toggle.table', 'Table')}
        </span>
      </button>
    </div>
  );
};

export const ResultsTable = ({ results, currency, onProviderClick, bestAmount }) => {
  const { t } = useTranslation('common');

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.provider', 'Provider')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.amount_received', 'Amount Received')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.rate', 'Rate')}
            </th>
            <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.fee', 'Fee')}
            </th>
            <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('view_toggle.action', 'Action')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((provider, index) => {
            const isBest = index === 0;
            const displayName = provider.provider === 'JP Remit' ? 'JRF' : provider.provider === 'The Moin' ? 'Moin' : provider.provider;
            const diffFromBest = bestAmount - provider.recipient_gets;

            return (
              <tr
                key={provider.provider}
                className={`hover:bg-gray-50 transition-colors ${isBest ? 'bg-blue-50/50' : ''}`}
              >
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isBest ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{displayName}</span>
                    {isBest && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                        {t('provider.best_badge', 'Max Amount')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="font-bold text-gray-900">
                    {provider.recipient_gets.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    <span className="text-gray-500 font-normal ml-1">{currency}</span>
                  </div>
                  {!isBest && diffFromBest > 0 && (
                    <div className="text-xs text-red-500">
                      -{diffFromBest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-gray-600">
                  {provider.exchange_rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </td>
                <td className="px-4 py-4 text-right text-gray-600">
                  ₩{provider.fee.toLocaleString('en-US')}
                </td>
                <td className="px-4 py-4 text-center">
                  <a
                    href={provider.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onProviderClick(provider, index)}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isBest
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {t('provider.cta_default', 'Visit')}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
