import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6 select-none text-[#66706d]" aria-hidden>⠿</div>
      <h1 className="editorial-title text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-[#8f9995] text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2.5 brand-button text-sm font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
      >
        Back to Home
      </Link>
    </div>
  );
}
