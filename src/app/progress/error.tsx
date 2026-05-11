'use client';

import { useEffect } from 'react';

export default function ProgressError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center" role="alert">
      <div className="section-kicker mb-5" aria-hidden>Progress</div>
      <h2 className="editorial-title text-xl font-semibold mb-3">Could not load your progress</h2>
      <p className="text-[#a9b0a9] text-sm mb-8">Your data is stored locally and is safe. Try refreshing the page.</p>
      <button onClick={reset} className="px-5 py-2.5 brand-button font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]">
        Try again
      </button>
    </div>
  );
}
