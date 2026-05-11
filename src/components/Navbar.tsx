'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, memo } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { useLocaleContext } from './LocaleProvider';

const NavLink = memo(function NavLink({
  href, label, active, onClick,
}: {
  href: string; label: string; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={[
        'nav-link focus-visible:outline-2 focus-visible:outline-[#f0c979]',
        active ? 'nav-link-active' : '',
      ].join(' ')}
    >
      {active && (
        <span
          aria-hidden
          className="absolute bottom-1.5 left-[14px] right-[14px] h-px bg-[linear-gradient(90deg,transparent,rgba(214,168,91,0.85),transparent)]"
        />
      )}
      {label}
    </Link>
  );
});

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLocaleContext();

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/learn', label: t.nav.learn },
    { href: '/quiz', label: t.nav.quiz },
    { href: '/read', label: t.nav.read },
    { href: '/type', label: t.nav.type },
    { href: '/progress', label: t.nav.progress },
  ];

  return (
    <nav
      className="nav-shell sticky top-0 z-50"
      style={{ backdropFilter: 'none' }}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-base text-[#f3eee5] focus-visible:outline-2 focus-visible:outline-[#f0c979] rounded-md shrink-0"
        >
          <span
            aria-hidden
            className="w-8 h-8 rounded-lg border border-[rgba(214,168,91,0.28)] bg-[linear-gradient(180deg,rgba(214,168,91,0.95),rgba(214,168,91,0.78))] flex items-center justify-center text-sm font-bold text-[#17130c] shadow-[inset_0_-1px_0_rgba(0,0,0,0.25)]"
          >
            ⠃
          </span>
          <span className="inline-flex items-center gap-2">
            Braille<span className="text-[#d6a85b]">Learn</span>
            <span aria-hidden className="hidden sm:inline-block w-8 h-[7px] opacity-55 bg-[radial-gradient(circle,rgba(214,168,91,0.9)_1px,transparent_1.5px)] bg-[length:8px_7px] bg-repeat-x" />
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center" role="list">
          {links.map(({ href, label }) => (
            <li key={href}>
              <NavLink href={href} label={label} active={pathname === href} />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector />
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-transparent text-[#8f9995] hover:text-[#f3eee5] hover:bg-[rgba(235,226,207,0.04)] hover:border-[rgba(235,226,207,0.08)] transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {menuOpen ? (
                <>
                  <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="2" y1="4.5" x2="14" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="11.5" x2="14" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-panel md:hidden">
          <ul className="flex flex-col p-3 gap-2" role="list">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={[
                    'nav-link w-full justify-start rounded-lg focus-visible:outline-2 focus-visible:outline-[#f0c979]',
                    pathname === href ? 'nav-link-active' : '',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
