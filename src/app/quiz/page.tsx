'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuizCard } from '@/components/QuizCard';
import { ProgressBar } from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import { useToast } from '@/components/ToastProvider';
import { useLocaleContext } from '@/components/LocaleProvider';
import { buildQuestion, shuffle } from '@/utils/quiz';
import { QuizQuestion, BrailleChar } from '@/types';
import { ACHIEVEMENT_DEFS, getAchievementLabel } from '@/data/achievements';

const Confetti = dynamic(
  () => import('@/components/Confetti').then((m) => ({ default: m.Confetti })),
  { ssr: false }
);

const QUESTIONS_PER_QUIZ = 10;
const XP_PER_CORRECT = 5;

function buildQuiz(pool: BrailleChar[]): QuizQuestion[] {
  return shuffle(pool).slice(0, QUESTIONS_PER_QUIZ).map((t) => buildQuestion(t, pool));
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const cls: Record<string, string> = {
    violet: 'text-[#d6a85b]',
    green:  'text-[#75b7a8]',
    amber:  'text-[#f0c979]',
  };
  return (
    <div className="surface rounded-lg p-4 text-center">
      <p className={`text-2xl font-semibold tabular-nums ${cls[color]}`}>{value}</p>
      <p className="text-[#66706d] text-xs mt-1">{label}</p>
    </div>
  );
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get('lesson');
  const { addXP, recordQuizScore } = useProgress();
  const { play } = useSound();
  const { show } = useToast();
  const { standard, lessons, t } = useLocaleContext();

  const lesson = lessonId ? lessons.find((l) => l.id === lessonId) : null;
  const pool   = lesson
    ? lesson.items
    : [...standard.alphabet, ...standard.numbers, ...standard.accented];

  const [questions] = useState<QuizQuestion[]>(() => buildQuiz(pool));
  const [current, setCurrent]     = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [done, setDone]           = useState(false);
  const [confetti, setConfetti]   = useState(false);

  const countersRef = useRef({ correct: 0, streak: 0, maxStreak: 0, current: 0 });

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const c = countersRef.current;
      const newCorrect   = isCorrect ? c.correct + 1 : c.correct;
      const newStreak    = isCorrect ? c.streak + 1 : 0;
      const newMaxStreak = Math.max(c.maxStreak, newStreak);

      countersRef.current = { correct: newCorrect, streak: newStreak, maxStreak: newMaxStreak, current: c.current + 1 };
      setCorrect(newCorrect);
      setStreak(newStreak);
      setMaxStreak(newMaxStreak);

      if (isCorrect) {
        addXP(XP_PER_CORRECT);
        if (newStreak > 0 && newStreak % 3 === 0) show(`${newStreak} ${t.quiz.streakMessage}`, 'success');
      }

      if (c.current + 1 >= questions.length) {
        const score    = Math.round((newCorrect / questions.length) * 100);
        const unlocked = recordQuizScore(lessonId ?? 'mixed', score, newCorrect, questions.length);
        play('complete');
        if (score >= 80) setConfetti(true);
        unlocked.forEach((aid: string) => {
          const def = ACHIEVEMENT_DEFS.find((a) => a.id === aid);
          if (def) {
            const { title } = getAchievementLabel(aid, t);
            show(`${def.icon} ${title}`, 'success');
          }
        });
        setDone(true);
      } else {
        setCurrent((prev) => prev + 1);
      }
    },
    [questions.length, addXP, lessonId, recordQuizScore, play, show, t]
  );

  if (done) {
    const score = Math.round((correct / questions.length) * 100);
    const msg   = t.motivational[correct % t.motivational.length];
    const resultMark = score >= 80 ? 'High score' : score >= 50 ? 'Good practice' : 'Keep practicing';
    return (
      <>
        <Confetti active={confetti} />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="animate-scale-in">
            <div className="section-kicker mb-6 select-none">{resultMark}</div>
            <h1 className="editorial-title text-2xl font-semibold mb-2">{t.quiz.complete}</h1>
            <p className="text-[#8f9995] text-sm mb-8">{msg}</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <StatCard label={t.quiz.score}        value={`${score}%`}                 color="violet" />
              <StatCard label={t.quiz.correctLabel} value={`${correct}/${questions.length}`} color="green" />
              <StatCard label={t.quiz.bestStreak}   value={`${maxStreak}`}              color="amber" />
            </div>
            <ProgressBar value={score} max={100} color={score >= 80 ? 'green' : 'violet'} label={t.quiz.score} />
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 brand-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
              >
                {t.quiz.retry}
              </button>
              <button
                onClick={() => router.push('/learn')}
                className="px-6 py-2.5 quiet-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
              >
                {t.quiz.lessons}
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
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-[#f3eee5]">
            {lesson ? `${t.quiz.title}: ${lesson.title}` : t.quiz.mixedTitle}
          </h1>
          <div className="flex items-center gap-3 text-xs">
            {streak >= 2 && (
              <span className="text-[#f0c979] font-semibold">{streak} streak</span>
            )}
            <span className="text-[#66706d] tabular-nums">{current + 1} / {questions.length}</span>
          </div>
        </div>
        <ProgressBar value={current} max={questions.length} color="violet" showLabel={false} />
      </div>

      <QuizCard key={current} question={questions[current]} onAnswer={handleAnswer} />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="h-2 w-full bg-[rgba(235,226,207,0.07)] rounded-full mb-10" />
        <div className="flex flex-col items-center gap-7">
          <div className="skeleton w-24 h-24 rounded-xl" />
          <div className="grid grid-cols-2 gap-3 w-full">
            {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-[72px] rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
