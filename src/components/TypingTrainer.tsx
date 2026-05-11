'use client';

import { useState, memo } from 'react';
import { useBrailleKeyboard } from '@/hooks/useBrailleKeyboard';
import { BrailleCell } from './BrailleCell';
import { useLocaleContext } from './LocaleProvider';
import { BrailleChar } from '@/types';
import { getBrailleDisplayText } from '@/utils/brailleDisplay';

const LEFT_KEYS = [{ key: 'F', dot: 1 }, { key: 'D', dot: 2 }, { key: 'S', dot: 3 }];
const RIGHT_KEYS = [{ key: 'J', dot: 4 }, { key: 'K', dot: 5 }, { key: 'L', dot: 6 }];
const NUMERIC_INDICATOR_DOTS = [3, 4, 5, 6];

type Tab = 'alphabet' | 'numbers' | 'accented';

const KeyCap = memo(function KeyCap({
  keyLabel,
  dot,
  active,
}: {
  keyLabel: string;
  dot: number;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        aria-label={`Key ${keyLabel} dot ${dot}${active ? ' pressed' : ''}`}
        className={[
          'w-11 h-11 rounded-xl border flex items-center justify-center',
          'font-bold text-sm select-none transition-colors duration-75',
          active
            ? 'bg-[#d6a85b] border-[#f0c979] text-[#17130c]'
            : 'surface text-[#a9b0a9]',
        ].join(' ')}
      >
        {keyLabel}
      </div>
      <span className="text-[10px] text-[#66706d]">dot {dot}</span>
    </div>
  );
});

const RefChar = memo(function RefChar({ b }: { b: BrailleChar }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 surface tactile-hover rounded-lg p-2 hover:border-[rgba(214,168,91,0.24)]"
      aria-label={`${b.label}: dots ${b.dots.join(', ')}`}
    >
      <div className="flex items-center gap-1">
        {b.category === 'number' && (
          <BrailleCell activeDots={NUMERIC_INDICATOR_DOTS} size="sm" label="Numeric indicator" />
        )}
        <BrailleCell activeDots={b.dots} size="sm" label={b.label} />
      </div>
      <span className="text-[#f3eee5] text-xs font-bold">{b.char}</span>
      {b.category === 'number' && (
        <span className="text-[#8f9995] text-[9px]">{getBrailleDisplayText(b)}</span>
      )}
      {b.pronunciation && (
        <span className="text-[#66706d] text-[9px]">{b.pronunciation}</span>
      )}
    </div>
  );
});

function toggleDot(dots: number[], dot: number): number[] {
  return dots.includes(dot)
    ? dots.filter((currentDot) => currentDot !== dot)
    : [...dots, dot].sort((a, b) => a - b);
}

export function TypingTrainer() {
  const { standard, t } = useLocaleContext();
  const {
    activeDots,
    typedText,
    numericMode,
    lastInput,
    commitDots,
    insertSpace,
    insertNumericIndicator,
    clearText,
    backspace,
  } = useBrailleKeyboard({
    dotsToChar: standard.dotsToChar,
  });

  const hasAccented = standard.accented.length > 0;
  const [tab, setTab] = useState<Tab>('alphabet');
  const [manualDots, setManualDots] = useState<number[]>([]);

  const tabChars: Record<Tab, BrailleChar[]> = {
    alphabet: standard.alphabet,
    numbers: standard.numbers,
    accented: standard.accented,
  };
  const refChars = tabChars[tab] ?? standard.alphabet;

  const previewDots = activeDots.length > 0 ? activeDots : manualDots;

  const handleConfirmManualCell = () => {
    if (!manualDots.length) return;
    commitDots(manualDots);
    setManualDots([]);
  };

  return (
    <section aria-label={t.type.title} className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <p className="section-kicker">{t.type.chordLabel}</p>
        <div className="p-4 surface rounded-xl">
          <BrailleCell
            activeDots={previewDots}
            size="lg"
            interactive={activeDots.length === 0}
            onDotToggle={(dot) => setManualDots((prev) => toggleDot(prev, dot))}
            label={`${t.type.activeDots}: ${previewDots.join(', ') || 'none'}`}
          />
        </div>
        <p className="text-[#d6a85b] font-mono text-xs min-h-4 tabular-nums" aria-live="polite">
          {previewDots.length > 0 ? `${[...previewDots].sort().join(' · ')}` : '\u00A0'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-8" aria-live="polite">
          <span
            className={[
              'px-2.5 py-1 rounded-md text-[11px] font-semibold border',
              numericMode
                ? 'bg-[rgba(214,168,91,0.14)] text-[#f0c979] border-[rgba(214,168,91,0.28)]'
                : 'surface text-[#8f9995]',
            ].join(' ')}
          >
            {numericMode ? t.type.modeNumbers : t.type.modeLetters}
          </span>
        </div>
        <div className="min-h-10 text-center" aria-live="polite">
          {activeDots.length > 0 ? (
            <p className="text-[#a9b0a9] text-xs">
              {t.type.holdReleaseHelp}
            </p>
          ) : manualDots.length > 0 ? (
            <p className="text-[#a9b0a9] text-xs">
              {t.type.tapConfirmHelp}
            </p>
          ) : lastInput.status === 'accepted' ? (
            <p className="text-[#75b7a8] text-xs">
              {t.type.wrotePattern} {lastInput.char} {t.type.wroteFromDots} {lastInput.dots.join(', ') || '3, 4, 5, 6'}.
            </p>
          ) : lastInput.status === 'unknown' ? (
            <p className="text-rose-300 text-xs">
              {t.type.unknownPattern}
            </p>
          ) : (
            <p className="text-[#66706d] text-xs">
              {t.type.idleHelp}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-end gap-5" role="img" aria-label="Keyboard layout">
        <div className="flex gap-2" aria-label={t.type.leftHand}>
          {LEFT_KEYS.map(({ key, dot }) => (
            <KeyCap key={key} keyLabel={key} dot={dot} active={activeDots.includes(dot)} />
          ))}
        </div>
        <div className="mb-6">
          <div className="w-14 h-7 surface rounded-md flex items-center justify-center text-[#66706d] text-[10px] select-none">
            SPACE
          </div>
        </div>
        <div className="flex gap-2" aria-label={t.type.rightHand}>
          {RIGHT_KEYS.map(({ key, dot }) => (
            <KeyCap key={key} keyLabel={key} dot={dot} active={activeDots.includes(dot)} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg surface rounded-xl p-4">
        <p className="text-[#8f9995] text-xs leading-relaxed text-center">
          {t.type.interactionHelp}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={handleConfirmManualCell}
            disabled={manualDots.length === 0 || activeDots.length > 0}
            className="px-4 py-2 brand-button disabled:opacity-25 disabled:cursor-not-allowed text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.confirmCharacter}
          </button>
          <button
            type="button"
            onClick={() => setManualDots([])}
            disabled={manualDots.length === 0}
            className="px-4 py-2 quiet-button disabled:opacity-25 disabled:cursor-not-allowed text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.clearCell}
          </button>
          <button
            type="button"
            onClick={() => {
              insertNumericIndicator();
              setManualDots([]);
            }}
            className="px-4 py-2 quiet-button text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.numberSign} ⠼
          </button>
          <button
            type="button"
            onClick={() => {
              insertSpace();
              setManualDots([]);
            }}
            className="px-4 py-2 quiet-button text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.space}
          </button>
        </div>
      </div>

      <p className="text-[#66706d] text-xs text-center max-w-xs">{t.type.exampleNote}</p>

      <div className="w-full max-w-lg">
        <div
          role="textbox"
          aria-label="Typed Braille text output"
          aria-live="polite"
          className="min-h-14 w-full surface rounded-lg p-4 font-mono text-xl text-[#f3eee5] tracking-widest text-center break-all"
        >
          {typedText || (
            <span className="text-[#66706d] text-sm tracking-normal font-sans">{t.type.placeholder}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3 justify-center">
          <button
            onClick={backspace}
            disabled={!typedText}
            className="px-4 py-2 quiet-button disabled:opacity-25 disabled:cursor-not-allowed text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.backspace}
          </button>
          <button
            onClick={clearText}
            disabled={!typedText}
            className="px-4 py-2 bg-rose-500/[0.08] hover:bg-rose-500/[0.14] border border-rose-500/20 disabled:opacity-25 disabled:cursor-not-allowed text-rose-300 text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.type.clear}
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <p className="text-[#8f9995] text-xs mb-3">
          {t.type.referenceNote}
        </p>
        <div className="flex gap-1.5 mb-4 flex-wrap" role="tablist">
          {(['alphabet', 'numbers', ...(hasAccented ? ['accented'] : [])] as Tab[]).map((tabKey) => {
            const labels: Record<Tab, string> = {
              alphabet: t.type.tabAlphabet,
              numbers: t.type.tabNumbers,
              accented: t.learn.categoryAccented,
            };
            return (
              <button
                key={tabKey}
                role="tab"
                aria-selected={tab === tabKey}
                onClick={() => setTab(tabKey)}
                className={[
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-[#f0c979]',
                  tab === tabKey ? 'brand-button' : 'quiet-button',
                ].join(' ')}
              >
                {labels[tabKey]}
              </button>
            );
          })}
        </div>
        <div role="tabpanel" className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {refChars.map((b) => <RefChar key={b.char} b={b} />)}
        </div>
      </div>
    </section>
  );
}
