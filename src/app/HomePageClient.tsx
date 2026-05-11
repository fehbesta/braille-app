'use client';

import Link from 'next/link';
import { memo } from 'react';
import { BrailleCell } from '@/components/BrailleCell';
import { useLocaleContext } from '@/components/LocaleProvider';

const HERO_CHARS = ['L', 'E', 'A', 'R', 'N'];
const STATS_KEYS = ['statsLetters', 'statsNumbers', 'statsLessons', 'statsFree'] as const;
const STATS_VALUES = ['26', '10', '7', '100%'];

const DotDiagram = memo(function DotDiagram({ left, right, label }: { left: string; right: string; label: string }) {
  return (
    <div className="tactile-card rounded-xl p-8 w-full max-w-sm">
      <p className="section-kicker text-center mb-7">{label}</p>
      <div className="grid grid-cols-2 gap-x-12 gap-y-5 justify-items-center">
        {[
          { dot: 1, side: left }, { dot: 4, side: right },
          { dot: 2, side: left }, { dot: 5, side: right },
          { dot: 3, side: left }, { dot: 6, side: right },
        ].map(({ dot, side }) => (
          <div key={dot} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(214,168,91,0.13)] border border-[rgba(214,168,91,0.28)] flex items-center justify-center text-[#f0c979] font-bold text-sm">
              {dot}
            </div>
            <span className="text-[#a9b0a9] text-sm">{side}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-xs text-[#66706d] px-1">
        <span>{left} 1-3</span>
        <span>4-6 {right}</span>
      </div>
    </div>
  );
});

export function HomePageClient() {
  const { standard, t } = useLocaleContext();
  const heroChips = [t.home.chipBraille, t.home.chipTouch, t.home.chipReading];

  const heroWord = HERO_CHARS.map(
    (char) => standard.alphabet.find((entry) => entry.char === char) ?? standard.alphabet[0]
  );

  return (
    <>
      <section className="relative px-4 pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden" aria-labelledby="hero-heading">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 58% 36% at 50% 4%, rgba(214,168,91,0.10) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="hero-panel rounded-2xl p-6 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
              <div className="relative">
                <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.08s' }}>
                  <div className="pill mb-5">
                    <span aria-hidden>{standard.flag}</span>
                    {standard.name}
                  </div>
                </div>

                <div className="animate-fade-in-up opacity-0 flex flex-wrap gap-2 mb-5" style={{ animationDelay: '0.16s' }}>
                  {heroChips.map((chip) => (
                    <span key={chip} className="dot-chip">{chip}</span>
                  ))}
                </div>

                <div className="braille-rule mb-5" aria-hidden />

                <h1
                  id="hero-heading"
                  className="editorial-title animate-fade-in-up opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-semibold mb-5 leading-[1.02] max-w-3xl"
                  style={{ animationDelay: '0.24s' }}
                >
                  <span className="block">{t.home.heroTitle}</span>
                  <span className="block text-[#d6a85b] mt-2">{t.home.heroSubtitle}</span>
                </h1>

                <p
                  className="animate-fade-in-up opacity-0 editorial-copy text-base md:text-lg max-w-xl mb-8"
                  style={{ animationDelay: '0.32s' }}
                >
                  {t.home.heroTagline}
                </p>

                <div className="animate-fade-in-up opacity-0 flex flex-col sm:flex-row gap-3" style={{ animationDelay: '0.40s' }}>
                  <Link
                    href="/learn"
                    className="px-7 py-3 brand-button font-semibold text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979] text-center"
                  >
                    {t.home.startLearning}
                  </Link>
                  <Link
                    href="/quiz"
                    className="px-7 py-3 quiet-button font-semibold text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979] text-center"
                  >
                    {t.home.takeQuiz}
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="hero-divider mb-6 pb-6">
                  <div className="relative flex justify-center lg:justify-end gap-3 sm:gap-4" aria-label="Braille spelling of LEARN" role="img">
                    {heroWord.map((entry, index) => (
                      <div
                        key={`${entry.char}-${index}`}
                        className="animate-fade-in-up opacity-0 flex flex-col items-center gap-2.5"
                        style={{ animationDelay: `${0.14 + index * 0.07}s` }}
                      >
                        <BrailleCell activeDots={entry.dots} size="lg" label={entry.label} />
                        <span className="text-[11px] text-[#66706d] font-mono tracking-widest">{entry.char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="tactile-card rounded-xl p-5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.44s' }}>
                    <p className="section-kicker mb-3">{t.home.aboutTitle}</p>
                    <p className="text-sm text-[#a9b0a9] leading-relaxed">{t.home.dotDiagramLabel}</p>
                  </div>
                  <div className="tactile-card rounded-xl p-5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.50s' }}>
                    <p className="section-kicker mb-3">{t.home.featuresTitle}</p>
                    <p className="text-sm text-[#a9b0a9] leading-relaxed">{t.home.ctaSubtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12" aria-label="Quick stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STATS_KEYS.map((key, index) => (
            <div key={key} className="tactile-card rounded-xl px-5 py-4 text-center">
              <p className="text-3xl font-semibold text-[#f3eee5] tabular-nums">{STATS_VALUES[index]}</p>
              <p className="text-[#66706d] text-sm mt-1">{t.home[key]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 md:py-18" aria-labelledby="about-heading">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="section-kicker mb-4">
              {standard.flag} {standard.nativeName}
            </p>
            <h2 id="about-heading" className="editorial-title text-3xl md:text-[2.2rem] font-semibold mb-5 leading-snug max-w-xl">
              {t.home.aboutTitle}
            </h2>
            <p className="editorial-copy mb-4 text-[15px] max-w-xl">{t.home.aboutP1}</p>
            <p className="editorial-copy mb-7 text-[15px] max-w-xl">{t.home.aboutP2}</p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-[#d6a85b] hover:text-[#f0c979] font-medium text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979] rounded-md"
            >
              {t.home.startLesson1}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="flex justify-center">
            <DotDiagram left={t.home.dotLeft} right={t.home.dotRight} label={t.home.dotDiagramLabel} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 pb-20" aria-labelledby="features-heading">
        <div className="flex flex-col items-start md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <p className="section-kicker mb-3">{standard.nativeName}</p>
            <h2 id="features-heading" className="editorial-title text-2xl md:text-3xl font-semibold">
              {t.home.featuresTitle}
            </h2>
          </div>
          <div className="braille-rule" aria-hidden />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {t.features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="animate-fade-in-up tactile-card tactile-hover rounded-xl p-6 hover:border-[rgba(214,168,91,0.24)] duration-200"
            >
              <div className="feature-mark mb-4" aria-hidden>{icon}</div>
              <h3 className="text-[#f3eee5] font-semibold mb-2 text-[15px]">{title}</h3>
              <p className="text-[#8f9995] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-24 text-center" aria-labelledby="cta-heading">
        <div className="relative tactile-card rounded-2xl p-10 md:p-12 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(117,183,168,0.10) 0%, transparent 70%)' }}
          />
          <div className="relative max-w-xl mx-auto">
            <div className="braille-rule mx-auto mb-5" aria-hidden />
            <h2 id="cta-heading" className="editorial-title text-2xl md:text-[2rem] font-semibold mb-3">
              {t.home.ctaTitle}
            </h2>
            <p className="text-[#a9b0a9] mb-8 text-[15px]">{t.home.ctaSubtitle}</p>
            <Link
              href="/learn"
              className="inline-block px-8 py-3 brand-button font-semibold text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
            >
              {t.home.beginFree}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
