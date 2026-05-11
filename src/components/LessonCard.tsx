import Link from 'next/link';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  score?: number;
  labels: { start: string; review: string; quiz: string; quizBest: string; };
}

const CATEGORY_ACCENT: Record<string, string> = {
  alphabet: '[--card-a:#d6a85b] [--card-b:#75b7a8]',
  numbers: '[--card-a:#7aa7bd] [--card-b:#75b7a8]',
  words: '[--card-a:#75b7a8] [--card-b:#d6a85b]',
  accented: '[--card-a:#d6a85b] [--card-b:#f0c979]',
};

const CATEGORY_ICONS: Record<string, string> = {
  alphabet: 'Aa',
  numbers: '09',
  words: 'Tx',
  accented: 'AC',
};

export function LessonCard({ lesson, completed, score, labels }: LessonCardProps) {
  const accent = CATEGORY_ACCENT[lesson.category] ?? '';
  const icon = CATEGORY_ICONS[lesson.category] ?? 'Aa';

  return (
    <article
      className={`tactile-card tactile-hover ${accent} rounded-xl p-5 hover:border-[rgba(235,226,207,0.16)] duration-150`}
      aria-label={`${lesson.title}${completed ? ', completed' : ''}`}
    >
      {completed && (
        <span
          className="absolute top-4 right-4 rounded-md bg-[rgba(117,183,168,0.14)] border border-[rgba(117,183,168,0.32)] px-2 py-1 flex items-center justify-center text-[#9ad7c8] text-[10px] font-semibold"
          aria-label="Completed"
          title="Completed"
        >
          OK
        </span>
      )}

      <div className="flex items-start gap-3 mb-4">
        <span className="feature-mark shrink-0 mt-0.5" aria-hidden>{icon}</span>
        <div className="min-w-0">
          <h3 className="card-heading">{lesson.title}</h3>
          <p className="card-copy mt-1">{lesson.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 gap-3">
        <span className="dot-chip !min-h-0 !h-7 !px-2.5 !text-[11px]">+{lesson.xpReward} XP</span>
        {score !== undefined && (
          <span className="card-meta text-right">
            {labels.quizBest} <span className="text-[#a9b0a9]">{score}%</span>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/learn/${lesson.id}`}
          className="flex-1 text-center py-2 px-3 brand-button text-xs font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
        >
          {completed ? labels.review : labels.start}
        </Link>
        <Link
          href={`/quiz?lesson=${lesson.id}`}
          className="flex-1 text-center py-2 px-3 quiet-button text-xs font-semibold rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-[#f0c979]"
        >
          {labels.quiz}
        </Link>
      </div>
    </article>
  );
}
