import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Lessons',
  description: 'Browse all Braille lessons — alphabet, numbers, accented letters, and common words. Track your progress and earn XP.',
};

export default function LearnLayout({ children }: { children: ReactNode }) {
  return children;
}
