'use client';

import { useState, useRef, useEffect } from 'react';
import { StandardId } from '@/types';
import { getStandard, ALL_STANDARDS } from '@/data/braille/index';
import { useLocaleContext } from './LocaleProvider';

export function LanguageSelector() {
  const { standardId, setStandard, t } = useLocaleContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = getStandard(standardId);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${current.nativeName}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md quiet-button text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
      >
        <span aria-hidden>{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeName}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.nav.language}
          className="absolute right-0 top-full mt-1.5 w-44 surface-strong rounded-lg overflow-hidden z-50 animate-fade-in"
        >
          <div aria-live="polite" className="sr-only">
            {t.nav.language}: {current.nativeName}
          </div>
          {ALL_STANDARDS.map((id: StandardId) => {
            const std = getStandard(id);
            const selected = id === standardId;
            return (
              <button
                key={id}
                role="option"
                aria-selected={selected}
                onClick={() => { setStandard(id); setOpen(false); }}
                className={[
                  'w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-left transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-[#f0c979]',
                  selected
                    ? 'bg-[rgba(214,168,91,0.14)] text-[#f0c979]'
                    : 'text-[#d8d1c4] hover:bg-[rgba(235,226,207,0.05)]',
                ].join(' ')}
              >
                <span aria-hidden>{std.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs">{std.nativeName}</p>
                  <p className="text-[11px] text-[#66706d]">{std.name}</p>
                </div>
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6l3 3 5-5" stroke="#f0c979" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
