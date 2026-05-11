'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserProgress } from '@/types';
import { DEFAULT_PROGRESS, saveProgress, calcLevel, updateStreak } from '@/utils/progress';
import { ACHIEVEMENT_DEFS } from '@/data/achievements';

export function useProgress() {
  // HYDRATION FIX: Always initialise with DEFAULT_PROGRESS so server and client
  // render identical HTML. localStorage is read in useEffect after hydration.
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem('braille_progress');
        if (raw) setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(raw) });
      } catch {
        // localStorage unavailable — keep default.
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const applyAndSave = useCallback(
    (updated: UserProgress): { next: UserProgress; newAchievements: string[] } => {
      const newAchievements = ACHIEVEMENT_DEFS
        .filter((a) => !updated.achievements.includes(a.id) && a.condition(updated))
        .map((a) => a.id);
      const next: UserProgress = {
        ...updated,
        achievements: [...new Set([...updated.achievements, ...newAchievements])],
      };
      saveProgress(next);
      return { next, newAchievements };
    },
    []
  );

  const addXP = useCallback((amount: number) => {
    setProgress((prev) => {
      const updated = updateStreak({ ...prev, xp: prev.xp + amount, level: calcLevel(prev.xp + amount) });
      return applyAndSave(updated).next;
    });
  }, [applyAndSave]);

  const completeLesson = useCallback((lessonId: string, xp: number): string[] => {
    let unlocked: string[] = [];
    setProgress((prev) => {
      const updated = updateStreak({
        ...prev,
        xp: prev.xp + xp,
        level: calcLevel(prev.xp + xp),
        completedLessons: [...new Set([...prev.completedLessons, lessonId])],
      });
      const { next, newAchievements } = applyAndSave(updated);
      unlocked = newAchievements;
      return next;
    });
    return unlocked;
  }, [applyAndSave]);

  const recordQuizScore = useCallback(
    (lessonId: string, score: number, correct: number, total: number): string[] => {
      let unlocked: string[] = [];
      setProgress((prev) => {
        const updated = {
          ...prev,
          quizScores: { ...prev.quizScores, [lessonId]: score },
          totalCorrect: prev.totalCorrect + correct,
          totalAttempts: prev.totalAttempts + total,
        };
        const { next, newAchievements } = applyAndSave(updated);
        unlocked = newAchievements;
        return next;
      });
      return unlocked;
    },
    [applyAndSave]
  );

  const resetProgress = useCallback(() => {
    persist({
      xp: 0, level: 1, streak: 0, lastPracticeDate: '',
      completedLessons: [], quizScores: {}, achievements: [],
      totalCorrect: 0, totalAttempts: 0,
    });
  }, [persist]);

  return { progress, addXP, completeLesson, recordQuizScore, resetProgress };
}
