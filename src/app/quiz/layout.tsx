import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quiz',
  description: 'Test your Braille knowledge with adaptive quizzes. Identify characters, select dot patterns, and build your streak.',
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return children;
}
