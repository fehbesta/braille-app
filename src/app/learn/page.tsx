'use client';

import { LessonCard } from '@/components/LessonCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';
import { useLocaleContext } from '@/components/LocaleProvider';
import { xpForLevel, xpInCurrentLevel } from '@/utils/progress';
import { Lesson } from '@/types';

export default function LearnPage() {
  const { progress } = useProgress();
  const { t, lessons } = useLocaleContext();
  const xpNeeded  = xpForLevel(progress.level);
  const xpCurrent = xpInCurrentLevel(progress.xp);

  const CATEGORIES = [
    { key: 'alphabet' as const, label: t.learn.categoryAlphabet, icon: 'Aa' },
    { key: 'numbers'  as const, label: t.learn.categoryNumbers,  icon: '09' },
    { key: 'accented' as const, label: t.learn.categoryAccented, icon: 'ÁÇ' },
    { key: 'words'    as const, label: t.learn.categoryWords,    icon: 'Tx' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="editorial-title text-3xl font-semibold mb-1.5">{t.learn.title}</h1>
        <p className="text-[#8f9995] text-sm">{t.learn.subtitle}</p>

        {/* XP bar */}
        <div className="mt-6 max-w-xs surface rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#d6a85b]">{t.learn.level} {progress.level}</span>
            <span className="text-xs text-[#66706d] tabular-nums">{xpCurrent} / {xpNeeded} XP</span>
          </div>
          <ProgressBar value={xpCurrent} max={xpNeeded} color="violet" showLabel={false} />
        </div>
      </div>

      {CATEGORIES.map(({ key, label, icon }) => {
        const categoryLessons: Lesson[] = lessons.filter((l) => l.category === key);
        if (!categoryLessons.length) return null;
        return (
          <section key={key} className="mb-12" aria-labelledby={`cat-${key}`}>
            <h2
              id={`cat-${key}`}
              className="flex items-center gap-2 section-kicker mb-5"
            >
              <span aria-hidden>{icon}</span>
              {label}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  completed={progress.completedLessons.includes(lesson.id)}
                  score={progress.quizScores[lesson.id]}
                  labels={{
                    start:    t.learn.start,
                    review:   t.learn.review,
                    quiz:     t.learn.quiz,
                    quizBest: t.progress.quizBest,
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
