'use client';

import dynamic from 'next/dynamic';
import { useLocaleContext } from '@/components/LocaleProvider';

const TypingTrainer = dynamic(
  () => import('@/components/TypingTrainer').then((m) => ({ default: m.TypingTrainer })),
  {
    loading: () => (
      <div className="flex justify-center items-center py-16" aria-busy="true" aria-label="Loading typing trainer">
        <div className="skeleton w-[72px] h-24 rounded-xl" />
      </div>
    ),
    ssr: false,
  }
);

export default function TypePage() {
  const { t } = useLocaleContext();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="editorial-title text-3xl font-semibold mb-2">{t.type.title}</h1>
        <p className="text-[#8f9995] text-sm max-w-md mx-auto">{t.type.subtitle}</p>
      </div>

      {/* Key reference */}
      <div className="surface rounded-xl p-6 mb-10">
        <h2 className="section-kicker text-center mb-5">{t.type.mappingTitle}</h2>
        <div className="grid grid-cols-2 gap-6 text-sm max-w-xs mx-auto">
          <div>
            <p className="text-[#d6a85b] text-xs font-semibold mb-3">{t.type.leftHand}</p>
            <ul className="space-y-2 text-[#a9b0a9] text-xs">
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">F</kbd> → Dot 1</li>
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">D</kbd> → Dot 2</li>
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">S</kbd> → Dot 3</li>
            </ul>
          </div>
          <div>
            <p className="text-[#d6a85b] text-xs font-semibold mb-3">{t.type.rightHand}</p>
            <ul className="space-y-2 text-[#a9b0a9] text-xs">
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">J</kbd> → Dot 4</li>
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">K</kbd> → Dot 5</li>
              <li><kbd className="bg-[rgba(235,226,207,0.06)] border border-[rgba(235,226,207,0.12)] px-2 py-0.5 rounded text-[11px] font-mono">L</kbd> → Dot 6</li>
            </ul>
          </div>
        </div>
      </div>

      <TypingTrainer />
    </div>
  );
}
