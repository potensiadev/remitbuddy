import React from 'react';
import { useLayoutMode } from '../hooks/useLayoutMode';

interface HomeLayoutProps {
  form: React.ReactNode;
  results: React.ReactNode;
}

export default function HomeLayout({ form, results }: HomeLayoutProps) {
  const mode = useLayoutMode();
  
  if (mode === 'desktop') {
    return (
      <div className="w-full">
        <div className="mx-auto max-w-7xl grid grid-cols-[380px_1fr] gap-6 px-4 py-6">
          <aside className="sticky top-6 h-fit">
            {form}
          </aside>
          <main id="results-root" className="min-h-[40vh] w-full" tabIndex={-1}>
            {results || (
              <div className="w-full">
                {/* Empty state placeholder to maintain layout */}
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <main id="results-root" className="mx-auto max-w-xl px-4 py-6" tabIndex={-1}>
      {form}
      {results && (
        <div className="mt-6">
          {results}
        </div>
      )}
    </main>
  );
}