'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center" role="alert">
      <div className="section-kicker mb-6 select-none" aria-hidden>Error</div>
      <h2 className="editorial-title text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-[#8f9995] text-sm mb-8">
        {error.message || 'An unexpected error occurred. Your progress is safe.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 brand-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
      >
        Try again
      </button>
    </div>
  );
}
