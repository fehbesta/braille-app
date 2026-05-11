import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Typing Trainer',
  description: 'Practice Braille typing with a Perkins-style keyboard simulator. Press chord combinations to produce Braille characters.',
};

export default function TypeLayout({ children }: { children: ReactNode }) {
  return children;
}
