interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'violet' | 'green' | 'amber' | 'blue';
  showLabel?: boolean;
  className?: string;
}

const COLOR_MAP = {
  violet: 'from-[#d6a85b] to-[#f0c979]',
  green:  'from-[#75b7a8] to-[#9ad7c8]',
  amber:  'from-[#d6a85b] to-[#f0c979]',
  blue:   'from-[#7aa7bd] to-[#9dc1d1]',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  color = 'violet',
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-label={label}
    >
      {showLabel && label && (
        <div className="flex justify-between text-xs text-[#66706d] mb-1.5">
          <span>{label}</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-[rgba(235,226,207,0.07)] rounded-full overflow-hidden border border-[rgba(235,226,207,0.05)]">
        <div
          className={`h-full bg-gradient-to-r ${COLOR_MAP[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
