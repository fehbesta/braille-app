import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Progress',
  description: 'Track your Braille learning progress — XP, level, streaks, lesson completion, and achievements.',
};

export default function ProgressLayout({ children }: { children: ReactNode }) {
  return children;
}
