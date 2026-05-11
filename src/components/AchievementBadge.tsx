// Server Component — receives resolved label strings as props; no hooks needed.
import { ACHIEVEMENT_DEFS } from '@/data/achievements';

interface AchievementBadgeProps {
  achievementId: string;
  unlocked: boolean;
  title: string;
  description: string;
}

export function AchievementBadge({ achievementId, unlocked, title, description }: AchievementBadgeProps) {
  const def = ACHIEVEMENT_DEFS.find((a) => a.id === achievementId);
  if (!def) return null;

  return (
    <div
      role="img"
      aria-label={`${title}: ${description}${unlocked ? '' : ' (locked)'}`}
      className={[
        'tactile-card flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-colors duration-200',
        unlocked
          ? '[--card-a:#d6a85b] [--card-b:#75b7a8] border-[rgba(214,168,91,0.25)]'
          : 'opacity-55 grayscale',
      ].join(' ')}
    >
      <span className="text-2xl" aria-hidden>{def.icon}</span>
      <div>
        <p className="text-xs font-semibold text-[#f3eee5] leading-snug">{title}</p>
        <p className="text-[11px] text-[#66706d] mt-0.5 leading-snug">{description}</p>
      </div>
      {!unlocked && <span className="text-[10px] text-[#66706d]" aria-hidden>locked</span>}
    </div>
  );
}
