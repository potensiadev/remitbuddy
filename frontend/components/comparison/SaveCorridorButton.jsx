import { useTranslation } from 'next-i18next';

/**
 * SaveCorridorButton Component
 *
 * Button to save a comparison corridor for quick access
 */
const SaveCorridorButton = ({ amount, country, onSave, isSaved }) => {
  const { t } = useTranslation('common');

  return (
    <button
      onClick={onSave}
      disabled={isSaved}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isSaved
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

export default SaveCorridorButton;
