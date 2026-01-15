import React from 'react';
import PropTypes from 'prop-types';
import Skeleton, {
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  ProviderCardSkeleton,
} from '../ui/Skeleton';

/**
 * ResultsSkeleton Component
 *
 * Premium loading placeholder for comparison results.
 * Design Philosophy: "Invisible Complexity, Visible Clarity"
 *
 * Uses shimmer animation for a polished UX during data fetching.
 * Matches the exact layout of actual components for seamless transitions.
 */

/**
 * Table Row Skeleton for table view
 */
const TableRowSkeleton = ({ index = 0 }) => (
  <tr
    className="border-b border-neutral-100 last:border-0 animate-fade-in-up"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" width={40} height={40} />
        <Skeleton variant="text" className="w-24 h-5" />
      </div>
    </td>
    <td className="py-4 px-4">
      <Skeleton variant="text" className="w-32 h-6" />
    </td>
    <td className="py-4 px-4">
      <Skeleton variant="text" className="w-16 h-5" />
    </td>
    <td className="py-4 px-4">
      <Skeleton variant="text" className="w-20 h-5" />
    </td>
    <td className="py-4 px-4">
      <Skeleton variant="text" className="w-16 h-5" />
    </td>
    <td className="py-4 px-4">
      <Skeleton variant="rounded" width={100} height={36} />
    </td>
  </tr>
);

TableRowSkeleton.propTypes = {
  index: PropTypes.number,
};

/**
 * Results Header Skeleton
 */
export const ResultsHeaderSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden animate-fade-in-up ${className}`}>
    <div className="p-5 sm:p-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Skeleton variant="rounded" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-32 sm:w-40 h-6 sm:h-7" />
            <Skeleton variant="text" className="w-20 sm:w-24 h-4" />
          </div>
        </div>
        <Skeleton variant="rounded" width={100} height={40} />
      </div>

      {/* Amount Display */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton variant="text" className="w-32 sm:w-40 h-8 sm:h-10" />
          <Skeleton variant="text" className="w-6 sm:w-8 h-5 sm:h-6" />
          <Skeleton variant="text" className="w-12 sm:w-16 h-7 sm:h-8" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton variant="text" className="w-20 h-4" />
          <Skeleton variant="text" className="w-24 h-4" />
        </div>
      </div>
    </div>

    {/* Banner */}
    <div className="px-5 sm:px-6 py-3 bg-neutral-50 border-t border-neutral-200">
      <Skeleton variant="text" className="w-48 sm:w-64 h-5" />
    </div>
  </div>
);

ResultsHeaderSkeleton.propTypes = {
  className: PropTypes.string,
};

/**
 * View Toggle Skeleton
 */
export const ViewToggleSkeleton = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Skeleton variant="rounded" width={80} height={40} />
    <Skeleton variant="rounded" width={80} height={40} />
    <Skeleton variant="rounded" width={80} height={40} />
  </div>
);

ViewToggleSkeleton.propTypes = {
  className: PropTypes.string,
};

/**
 * Sort Dropdown Skeleton
 */
export const SortDropdownSkeleton = () => (
  <Skeleton variant="rounded" width={140} height={40} />
);

/**
 * Main Results Skeleton Component
 */
export default function ResultsSkeleton({
  count = 4,
  view = 'cards',
  showHeader = true,
  showViewToggle = true,
  className = '',
}) {
  return (
    <div className={`space-y-5 sm:space-y-6 ${className}`}>
      {/* Header Skeleton */}
      {showHeader && <ResultsHeaderSkeleton />}

      {/* View Toggle & Actions Bar */}
      {showViewToggle && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <ViewToggleSkeleton />
          <SortDropdownSkeleton />
        </div>
      )}

      {/* Cards View */}
      {view === 'cards' && (
        <div className="space-y-4">
          {/* Best Rate Card (Featured) - Full width on top */}
          <ProviderCardSkeleton isBest index={0} />

          {/* Other Cards - Grid layout */}
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: count - 1 }).map((_, i) => (
              <ProviderCardSkeleton key={i} index={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['송금사', '받는 금액', '환율', '수수료', '소요 시간', ''].map((header, i) => (
                    <th key={i} className="py-3 px-4 text-left">
                      <Skeleton variant="text" className="w-16 h-4" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: count }).map((_, i) => (
                  <TableRowSkeleton key={i} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart View */}
      {view === 'chart' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-5 sm:p-6 animate-fade-in-up">
          <div className="mb-4">
            <Skeleton variant="text" className="w-40 h-6 mb-2" />
            <Skeleton variant="text" className="w-60 h-4" />
          </div>
          <div className="h-64 sm:h-80 flex items-end justify-center gap-4 sm:gap-6 px-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton
                  variant="rectangular"
                  className="w-full rounded-t-lg"
                  style={{ height: `${Math.random() * 50 + 50}%` }}
                />
                <Skeleton variant="text" className="w-16 h-3" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Message */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>실시간 환율을 불러오는 중...</span>
        </div>
      </div>
    </div>
  );
}

ResultsSkeleton.propTypes = {
  count: PropTypes.number,
  view: PropTypes.oneOf(['cards', 'table', 'chart']),
  showHeader: PropTypes.bool,
  showViewToggle: PropTypes.bool,
  className: PropTypes.string,
};

ResultsSkeleton.defaultProps = {
  count: 4,
  view: 'cards',
  showHeader: true,
  showViewToggle: true,
  className: '',
};

/**
 * Compact Skeleton for inline loading states
 */
export const CompactResultsSkeleton = ({ count = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm animate-fade-in-up"
        style={{ animationDelay: `${i * 50}ms` }}
      >
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" className="w-10 h-10" />
          <div className="flex-1 space-y-1.5">
            <Skeleton variant="text" className="w-24 h-4" />
            <Skeleton variant="text" className="w-32 h-5" />
          </div>
          <Skeleton variant="button" className="h-8 w-20" />
        </div>
      </div>
    ))}
  </div>
);

CompactResultsSkeleton.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};
