import React from 'react';
import { useTranslation } from 'next-i18next';

export const SavedCorridors = ({ corridors, onSelectCorridor, onRemoveCorridor }) => {
    const { t } = useTranslation('common');

    if (!corridors || corridors.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {t('user_profile.title', 'Your Saved Corridors')}
            </h3>
            <div className="flex flex-wrap gap-2">
                {corridors.map((corridor, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 rounded-lg px-3 py-2 transition-all group"
                    >
                        <button
                            onClick={() => onSelectCorridor(corridor)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-brand-600"
                        >
                            <span>{parseInt(corridor.amount).toLocaleString()} KRW</span>
                            <span className="text-gray-400">→</span>
                            <span>{corridor.country}</span>
                        </button>
                        <button
                            onClick={() => onRemoveCorridor(index)}
                            className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
                            title={t('user_profile.remove', 'Remove')}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SaveCorridorButton = ({ amount, country, onSave, isSaved }) => {
    const { t } = useTranslation('common');

    return (
        <button
            onClick={onSave}
            disabled={isSaved}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSaved
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-gray-100 hover:bg-brand-50 text-gray-600 hover:text-brand-600 border border-gray-200 hover:border-brand-200'
                }`}
        >
            {isSaved ? (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('user_profile.saved', 'Saved!')}
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {t('user_profile.save_this', 'Save this corridor')}
                </>
            )}
        </button>
    );
};
