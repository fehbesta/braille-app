// Server Component shell — exports metadata, renders the client page component.
import type { Metadata } from 'next';
import { HomePageClient } from './HomePageClient';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Learn Braille interactively with guided lessons, adaptive quizzes, and a Perkins-style typing trainer — free, in your browser.',
};

export default function HomePage() {
  return <HomePageClient />;
}
