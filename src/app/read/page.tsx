'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useLocaleContext } from '@/components/LocaleProvider';
import { getReadingPracticeWords, ReadingDifficulty } from '@/data/readingPractice';
import { dotsToBrailleUnicode, getBrailleDisplayText } from '@/utils/brailleDisplay';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/components/ToastProvider';

const XP_PER_CORRECT_READING = 3;
const DIFFICULTY_ORDER: ReadingDifficulty[] = ['beginner', 'intermediate', 'advanced'];

function normalizeAnswer(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function wordToBraille(word: string, charToBraille: Record<string, { dots: number[]; category?: string }>): string {
  return word
    .split('')
    .map((char) => {
      if (char === ' ') return '   ';
      const entry = charToBraille[char.toUpperCase()] ?? charToBraille[char];
      if (!entry) return '';
      if (entry.category === 'number') return getBrailleDisplayText(entry as never);
      return dotsToBrailleUnicode(entry.dots);
    })
    .join('');
}

function getNextIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  const offset = Math.floor(Math.random() * (total - 1)) + 1;
  return (currentIndex + offset) % total;
}

function getDifficultyFromPerformance(totalAnswered: number, correctAnswers: number, streak: number): ReadingDifficulty {
  const accuracy = totalAnswered > 0 ? correctAnswers / totalAnswered : 0;

  if (totalAnswered >= 12 && accuracy >= 0.85 && streak >= 3) return 'advanced';
  if (totalAnswered >= 5 && accuracy >= 0.7) return 'intermediate';
  return 'beginner';
}

function getDifficultyLabel(t: ReturnType<typeof useLocaleContext>['t'], difficulty: ReadingDifficulty): string {
  if (difficulty === 'advanced') return t.read.advanced;
  if (difficulty === 'intermediate') return t.read.intermediate;
  return t.read.beginner;
}

export default function ReadPage() {
  const { standardId, standard, t } = useLocaleContext();
  const { progress, addXP } = useProgress();
  const { show } = useToast();
  const allWords = useMemo(() => getReadingPracticeWords(standardId), [standardId]);
  const [difficulty, setDifficulty] = useState<ReadingDifficulty>('beginner');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  const currentWords = useMemo(
    () => allWords.filter((entry) => entry.difficulty === difficulty),
    [allWords, difficulty]
  );
  const currentWord = currentWords[currentIndex] ?? currentWords[0] ?? allWords[0];
  const nextSuggestedDifficulty = difficulty === 'beginner'
    ? 'intermediate'
    : difficulty === 'intermediate'
      ? 'advanced'
      : null;

  const brailleWord = useMemo(
    () => wordToBraille(currentWord.answer, standard.charToBraille),
    [currentWord.answer, standard.charToBraille]
  );

  const isCorrect = submitted && normalizeAnswer(answer) === normalizeAnswer(currentWord.answer);
  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  function goToNextWord() {
    setCurrentIndex((index) => getNextIndex(index, currentWords.length));
    setAnswer('');
    setSubmitted(false);
    setShowAnswer(false);
  }

  function maybeAdvanceDifficulty(nextTotalAnswered: number, nextCorrectAnswers: number, nextStreak: number) {
    const nextDifficulty = getDifficultyFromPerformance(nextTotalAnswered, nextCorrectAnswers, nextStreak);
    if (DIFFICULTY_ORDER.indexOf(nextDifficulty) > DIFFICULTY_ORDER.indexOf(difficulty)) {
      setDifficulty(nextDifficulty);
      setCurrentIndex(0);
      setAnswer('');
      setSubmitted(false);
      setShowAnswer(false);
      show(`${t.read.difficultyUp}: ${getDifficultyLabel(t, nextDifficulty)}`, 'success');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted) return;

    const correct = normalizeAnswer(answer) === normalizeAnswer(currentWord.answer);
    const nextTotalAnswered = totalAnswered + 1;
    const nextCorrectAnswers = correctAnswers + (correct ? 1 : 0);
    const nextStreak = correct ? currentStreak + 1 : 0;

    setTotalAnswered(nextTotalAnswered);
    setCorrectAnswers(nextCorrectAnswers);
    setCurrentStreak(nextStreak);
    setSubmitted(true);
    maybeAdvanceDifficulty(nextTotalAnswered, nextCorrectAnswers, nextStreak);

    if (correct) {
      addXP(XP_PER_CORRECT_READING);
      setSessionXP((xp) => xp + XP_PER_CORRECT_READING);
      show(`+${XP_PER_CORRECT_READING} XP`, 'xp');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="editorial-title text-3xl font-semibold mb-2">{t.read.title}</h1>
        <p className="text-[#8f9995] text-sm max-w-xl">{t.read.subtitle}</p>
      </div>

      <section className="surface rounded-xl p-6 md:p-8" aria-labelledby="reading-practice-title">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="section-kicker mb-2" id="reading-practice-title">{t.read.continuousLabel}</p>
            <p className="text-xs text-[#66706d]">{t.read.readyForNext}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="dot-chip !text-[11px]">{t.read.overallLevel} {progress.level}</span>
            <span className="dot-chip !text-[11px]">{t.read.practiceStreak} {progress.streak}</span>
            <span className="dot-chip !text-[11px]">{t.read.sessionXP} {sessionXP}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6" aria-label="Reading practice stats">
          <div className="rounded-lg border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#66706d]">{t.read.totalAnswered}</p>
            <p className="text-lg font-semibold text-[#f3eee5] tabular-nums">{totalAnswered}</p>
          </div>
          <div className="rounded-lg border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#66706d]">{t.read.correctAnswers}</p>
            <p className="text-lg font-semibold text-[#75b7a8] tabular-nums">{correctAnswers}</p>
          </div>
          <div className="rounded-lg border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#66706d]">{t.read.currentStreak}</p>
            <p className="text-lg font-semibold text-[#f0c979] tabular-nums">{currentStreak}</p>
          </div>
          <div className="rounded-lg border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#66706d]">{t.read.accuracy}</p>
            <p className="text-lg font-semibold text-[#f3eee5] tabular-nums">{accuracy}%</p>
          </div>
          <div className="rounded-lg border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#66706d]">{t.read.difficulty}</p>
            <p className="text-lg font-semibold text-[#d6a85b]">{getDifficultyLabel(t, difficulty)}</p>
          </div>
        </div>

        {nextSuggestedDifficulty && (
          <p className="text-xs text-[#66706d] mb-6">
            {t.read.nextDifficultyHint} <span className="text-[#a9b0a9]">{getDifficultyLabel(t, nextSuggestedDifficulty)}</span>
          </p>
        )}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="section-kicker mb-2">{t.read.prompt}</p>
            {submitted && isCorrect && (
              <p className="text-xs text-[#75b7a8]">+{XP_PER_CORRECT_READING} {t.read.xpEarned}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="quiet-button px-3.5 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#f0c979]"
          >
            {t.read.showAnswer}
          </button>
        </div>

        <div
          className="rounded-xl border border-[rgba(235,226,207,0.08)] bg-[rgba(235,226,207,0.03)] px-5 py-8 mb-6"
          role="group"
          aria-label={`${t.read.prompt}: ${getDifficultyLabel(t, difficulty)}`}
        >
          <p className="text-center text-4xl md:text-5xl tracking-[0.2em] text-[#f3eee5] leading-tight">
            {brailleWord}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-[#d7ddd7] mb-2">{t.read.answerLabel}</span>
            <input
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={t.read.answerPlaceholder}
              autoComplete="off"
              className="w-full rounded-lg border border-[rgba(235,226,207,0.12)] bg-[rgba(8,10,10,0.9)] px-4 py-3 text-sm text-[#f3eee5] placeholder:text-[#66706d] focus-visible:outline-2 focus-visible:outline-[#f0c979]"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="brand-button px-4 py-2.5 rounded-md text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#f0c979]"
            >
              {t.read.submit}
            </button>
            <button
              type="button"
              onClick={goToNextWord}
              className="quiet-button px-4 py-2.5 rounded-md text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#f0c979]"
            >
              {t.read.next}
            </button>
          </div>
        </form>

        <div className="mt-6 min-h-[52px]" aria-live="polite">
          {submitted && (
            <p className={`text-sm font-medium ${isCorrect ? 'text-[#75b7a8]' : 'text-[#f0c979]'}`}>
              {isCorrect ? t.read.correct : t.read.incorrect}
            </p>
          )}
          {(showAnswer || (submitted && !isCorrect)) && (
            <p className="text-sm text-[#a9b0a9] mt-2">
              {t.read.expected} <span className="text-[#f3eee5] font-medium">{currentWord.answer}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
