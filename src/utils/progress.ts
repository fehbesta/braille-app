import { UserProgress } from '@/types';

const STORAGE_KEY = 'braille_progress';

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastPracticeDate: '',
  completedLessons: [],
  quizScores: {},
  achievements: [],
  totalCorrect: 0,
  totalAttempts: 0,
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** XP thresholds per level — level N requires N*100 XP */
export function xpForLevel(level: number): number {
  return level * 100;
}

export function calcLevel(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return level;
}

export function xpInCurrentLevel(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return xp;
}

/** Update streak based on today's date */
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toDateString();
  if (progress.lastPracticeDate === today) return progress;

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const streak =
    progress.lastPracticeDate === yesterday ? progress.streak + 1 : 1;

  return { ...progress, streak, lastPracticeDate: today };
}
