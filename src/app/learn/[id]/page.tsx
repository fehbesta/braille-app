'use client';

import dynamic from 'next/dynamic';
import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { BrailleCell } from '@/components/BrailleCell';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import { useToast } from '@/components/ToastProvider';
import { useLocaleContext } from '@/components/LocaleProvider';
import { ACHIEVEMENT_DEFS, getAchievementLabel } from '@/data/achievements';
import { BrailleChar } from '@/types';
import { getBrailleDisplayText } from '@/utils/brailleDisplay';

const Confetti = dynamic(
  () => import('@/components/Confetti').then((m) => ({ default: m.Confetti })),
  { ssr: false }
);

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lessons, t } = useLocaleContext();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) notFound();

  const router = useRouter();
  const { completeLesson } = useProgress();
  const { play } = useSound();
  const { show } = useToast();

  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone]       = useState(false);
  const [confetti, setConfetti] = useState(false);

  const item: BrailleChar = lesson.items[index];
  const isNumber = item.category === 'number';
  const progressPct = (index / lesson.items.length) * 100;
  const motivational = t.motivational[index % t.motivational.length];

  const flip   = () => { play('click'); setFlipped((f) => !f); };
  const goTo   = (i: number) => { play('click'); setIndex(i); setFlipped(false); };

  const handleNext = () => {
    if (index + 1 >= lesson.items.length) {
      const unlocked = completeLesson(lesson.id, lesson.xpReward);
      play('complete');
      setConfetti(true);
      show(`+${lesson.xpReward} ${t.lesson.xpEarned}`, 'xp');
      unlocked.forEach((aid) => {
        const def = ACHIEVEMENT_DEFS.find((a) => a.id === aid);
        if (def) {
          const { title } = getAchievementLabel(aid, t);
          show(`${t.lesson.achievementUnlocked} ${def.icon} ${title}`, 'success');
        }
      });
      setDone(true);
    } else {
      play('click');
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (done) {
    return (
      <>
        <Confetti active={confetti} />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="animate-scale-in">
            <div className="section-kicker mb-6 select-none">Complete</div>
            <h1 className="editorial-title text-2xl font-semibold mb-2">{t.lesson.lessonComplete}</h1>
            <p className="text-[#8f9995] text-sm mb-2">{motivational}</p>
            <p className="text-[#d6a85b] font-semibold mb-10">+{lesson.xpReward} {t.lesson.xpEarned}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => router.push(`/quiz?lesson=${lesson.id}`)}
                className="px-6 py-2.5 brand-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
              >
                {t.lesson.takeQuiz}
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="px-6 py-2.5 quiet-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
              >
                {t.lesson.allLessons}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-[#f3eee5]">{lesson.title}</h1>
          <span className="text-xs text-[#66706d] tabular-nums">{index + 1} / {lesson.items.length}</span>
        </div>
        <ProgressBar value={progressPct} max={100} color="violet" showLabel={false} />
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Flip card */}
        <div className="flip-card w-64 h-64 cursor-pointer select-none" onClick={flip}>
          <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
            {/* Front */}
            <div
              className="flip-card-front absolute inset-0 surface rounded-xl flex flex-col items-center justify-center gap-5 hover:border-[rgba(214,168,91,0.28)] transition-colors"
              role="button"
              tabIndex={0}
              aria-label={`${item.label}. ${t.lesson.clickToReveal}.`}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && flip()}
            >
              <div className="flex items-center gap-2">
                {isNumber && <BrailleCell activeDots={[3, 4, 5, 6]} size="lg" label="Numeric indicator" />}
                <BrailleCell activeDots={item.dots} size="lg" label={item.label} />
              </div>
              <p className="text-[#66706d] text-xs">{t.lesson.clickToReveal}</p>
            </div>
            {/* Back */}
            <div
              className="flip-card-back absolute inset-0 bg-[rgba(214,168,91,0.10)] border border-[rgba(214,168,91,0.26)] rounded-xl flex flex-col items-center justify-center gap-3"
              role="button"
              tabIndex={-1}
              aria-label={`${item.label}. ${t.lesson.dots}: ${item.dots.join(', ')}.`}
            >
              <span className="text-6xl font-semibold text-[#f3eee5] tracking-tight">{item.char}</span>
              <p className="text-[#f0c979] text-sm font-medium">{item.label}</p>
              {isNumber && (
                <p className="text-[#8f9995] text-xs">Braille display: {getBrailleDisplayText(item)}</p>
              )}
              {item.pronunciation && (
                <p className="text-[#d6a85b]/70 text-xs">/{item.pronunciation}/</p>
              )}
              <p className="text-[#8f9995] text-xs">{t.lesson.dots}: {item.dots.join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* Character navigator */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs" role="tablist" aria-label="Jump to character">
          {lesson.items.map((it, i) => (
            <button
              key={`${it.char}-${i}`}
              role="tab"
              aria-selected={i === index}
              onClick={() => goTo(i)}
              aria-label={`Go to ${it.label}`}
              className={[
                'w-8 h-8 rounded-md text-xs font-bold transition-colors duration-100',
                'focus-visible:outline-2 focus-visible:outline-[#f0c979]',
                i === index
                  ? 'brand-button'
                  : i < index
                    ? 'bg-[rgba(117,183,168,0.14)] text-[#9ad7c8] border border-[rgba(117,183,168,0.24)]'
                    : 'quiet-button',
              ].join(' ')}
            >
              {it.char}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => index > 0 && goTo(index - 1)}
            disabled={index === 0}
            className="px-5 py-2.5 quiet-button disabled:opacity-25 disabled:cursor-not-allowed text-sm rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.lesson.prev}
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2.5 brand-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {index + 1 >= lesson.items.length ? t.lesson.complete : t.lesson.next}
          </button>
        </div>
      </div>
    </div>
  );
}
