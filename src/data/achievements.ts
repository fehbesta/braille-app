import { Achievement, LocaleStrings, UserProgress } from '@/types';

// Achievement conditions are locale-independent (based on progress IDs).
// Titles/descriptions come from the locale strings passed at render time.
export const ACHIEVEMENT_DEFS: Achievement[] = [
  {
    id: 'first-lesson',
    icon: '01',
    condition: (p: UserProgress) => p.completedLessons.length >= 1,
  },
  {
    id: 'alphabet-master',
    icon: 'ABC',
    condition: (p: UserProgress) =>
      ['alphabet-1', 'alphabet-2', 'alphabet-3', 'alphabet-4', 'alphabet-5'].every((id) =>
        p.completedLessons.includes(id)
      ),
  },
  {
    id: 'number-cruncher',
    icon: '123',
    condition: (p: UserProgress) => p.completedLessons.includes('numbers-1'),
  },
  {
    id: 'accented-master',
    icon: 'ÁÇ',
    condition: (p: UserProgress) => p.completedLessons.includes('accented-1'),
  },
  {
    id: 'streak-3',
    icon: '3D',
    condition: (p: UserProgress) => p.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: '7D',
    condition: (p: UserProgress) => p.streak >= 7,
  },
  {
    id: 'xp-100',
    icon: '100',
    condition: (p: UserProgress) => p.xp >= 100,
  },
  {
    id: 'xp-500',
    icon: '500',
    condition: (p: UserProgress) => p.xp >= 500,
  },
  {
    id: 'perfect-quiz',
    icon: '100%',
    condition: (p: UserProgress) => Object.values(p.quizScores).some((s) => s === 100),
  },
];

/** Resolve display strings for an achievement from locale */
export function getAchievementLabel(
  id: string,
  t: LocaleStrings
): { title: string; description: string } {
  return t.achievements[id] ?? { title: id, description: '' };
}
