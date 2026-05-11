// Server Component — no hooks, no browser APIs.
import { memo } from 'react';

interface BrailleCellProps {
  activeDots?: number[];
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onDotToggle?: (dot: number) => void;
  label?: string;
  className?: string;
}

// Col 0 = left (dots 1,2,3)  Col 1 = right (dots 4,5,6)
const DOT_POSITIONS = [
  { dot: 1, row: 0, col: 0 },
  { dot: 4, row: 0, col: 1 },
  { dot: 2, row: 1, col: 0 },
  { dot: 5, row: 1, col: 1 },
  { dot: 3, row: 2, col: 0 },
  { dot: 6, row: 2, col: 1 },
];

// Sizes: cell container, dot diameter, grid gap+padding
const SIZE_MAP = {
  sm: { cell: 'w-9 h-[52px]',  dot: 'w-2.5 h-2.5', gap: 'gap-[5px] p-[5px]'  },
  md: { cell: 'w-12 h-[68px]', dot: 'w-3.5 h-3.5',  gap: 'gap-[6px] p-[6px]'  },
  lg: { cell: 'w-[72px] h-24', dot: 'w-5 h-5',       gap: 'gap-[8px] p-[8px]'  },
};

export const BrailleCell = memo(function BrailleCell({
  activeDots = [],
  size = 'md',
  interactive = false,
  onDotToggle,
  label,
  className = '',
}: BrailleCellProps) {
  const { cell, dot, gap } = SIZE_MAP[size];
  const containerRole  = interactive ? 'group' : 'img';
  const containerLabel = label ?? `Braille cell with dots ${activeDots.join(', ') || 'none'} active`;

  return (
    <div
      role={containerRole}
      aria-label={containerLabel}
      className={[
        'inline-grid grid-cols-2 rounded-lg',
        'surface border-[rgba(235,226,207,0.10)]',
        gap, cell, className,
      ].join(' ')}
    >
      {DOT_POSITIONS.map(({ dot: dotNum, row, col }) => {
        const isActive = activeDots.includes(dotNum);

        if (!interactive) {
          return (
            <div
              key={dotNum}
              aria-hidden
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
              className={[dot, 'rounded-full', isActive ? 'dot-active' : 'dot-inactive'].join(' ')}
            />
          );
        }

        return (
          <button
            key={dotNum}
            type="button"
            onClick={() => onDotToggle?.(dotNum)}
            aria-label={`Dot ${dotNum}${isActive ? ' (active)' : ''}`}
            aria-pressed={isActive}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
            className={[
              dot, 'rounded-full cursor-pointer',
              'transition-colors duration-100',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f0c979]',
              isActive ? 'dot-active' : 'dot-inactive hover:bg-[#34413f]',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
});
