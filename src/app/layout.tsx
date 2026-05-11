import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ToastProvider';
import { LocaleProvider } from '@/components/LocaleProvider';

export const metadata: Metadata = {
  title: {
    default: 'BrailleLearn — Interactive Braille Education',
    template: '%s | BrailleLearn',
  },
  description: 'Learn Braille interactively with lessons, quizzes, and a Perkins-style typing trainer. Supports English and Brazilian Portuguese Braille.',
  keywords: ['braille', 'braille brasileiro', 'learn braille', 'accessibility', 'education'],
  openGraph: {
    siteName: 'BrailleLearn',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="app-shell text-stone-100 min-h-screen antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#d6a85b] focus:text-[#17130c] focus:rounded-md focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <LocaleProvider>
          <ToastProvider>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </ToastProvider>
        </LocaleProvider>
        <footer className="mt-24 border-t border-[rgba(235,226,207,0.07)]">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#66706d] text-sm">
            <span className="flex items-center gap-2">
              <span aria-hidden className="text-[#d6a85b]">⠃⠗</span>
              BrailleLearn
            </span>
            <span>Making Braille accessible to everyone</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
