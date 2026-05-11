import { BrailleChar, QuizQuestion } from '@/types';

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick N unique random items from an array */
export function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Build a quiz question from a BrailleChar and a pool of all chars */
export function buildQuestion(
  target: BrailleChar,
  pool: BrailleChar[]
): QuizQuestion {
  const type = Math.random() > 0.5 ? 'identify-char' : 'select-dots';

  if (type === 'identify-char') {
    const distractors = pickRandom(
      pool.filter((b) => b.char !== target.char),
      3
    ).map((b) => b.char);
    return {
      type,
      brailleChar: target,
      options: shuffle([target.char, ...distractors]),
      correctAnswer: target.char,
    };
  }

  // select-dots: show the letter, pick the right dot pattern
  const correctKey = [...target.dots].sort().join(',');
  const distractorKeys = pickRandom(
    pool.filter((b) => b.char !== target.char),
    3
  ).map((b) => [...b.dots].sort().join(','));

  return {
    type,
    brailleChar: target,
    options: shuffle([correctKey, ...distractorKeys]),
    correctAnswer: correctKey,
  };
}
