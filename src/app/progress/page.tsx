'use client';

import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/components/ToastProvider';
import { useLocaleContext } from '@/components/LocaleProvider';
import { ProgressBar } from '@/components/ProgressBar';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ACHIEVEMENT_DEFS, getAchievementLabel } from '@/data/achievements';
import { xpForLevel, xpInCurrentLevel } from '@/utils/progress';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const accent: Record<string, string> = {
    violet: 'text-[#d6a85b] [--card-a:#d6a85b] [--card-b:#75b7a8]',
    blue:   'text-[#7aa7bd] [--card-a:#7aa7bd] [--card-b:#75b7a8]',
    amber:  'text-[#f0c979] [--card-a:#f0c979] [--card-b:#d6a85b]',
    green:  'text-[#75b7a8] [--card-a:#75b7a8] [--card-b:#d6a85b]',
  };
  return (
    <div className={`tactile-card rounded-xl p-5 ${accent[color]}`}>
      <span className="text-xl" aria-hidden>{icon}</span>
      <p className={`text-2xl font-bold mt-3 tabular-nums ${accent[color].split(' ')[0]}`}>{value}</p>
      <p className="text-[#66706d] text-xs mt-1">{label}</p>
    </div>
  );
}

export default function ProgressPage() {
  const { progress, resetProgress } = useProgress();
  const { show } = useToast();
  const { t, lessons } = useLocaleContext();

  const xpNeeded  = xpForLevel(progress.level);
  const xpCurrent = xpInCurrentLevel(progress.xp);
  const accuracy  = progress.totalAttempts > 0
    ? Math.round((progress.totalCorrect / progress.totalAttempts) * 100)
    : 0;

  const handleReset = () => {
    if (confirm(t.progress.resetConfirm)) {
      resetProgress();
      show(t.progress.resetDone, 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="editorial-title text-3xl font-semibold mb-10">{t.progress.title}</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard label={t.progress.level}    value={progress.level}          icon="LV" color="violet" />
        <StatCard label={t.progress.totalXP}  value={progress.xp}             icon="XP" color="blue"   />
        <StatCard label={t.progress.streak}   value={progress.streak}         icon="ST" color="amber"  />
        <StatCard label={t.progress.accuracy} value={`${accuracy}%`}          icon="AC" color="green"  />
      </div>

      {/* Level progress */}
      <section className="surface rounded-xl p-6 mb-4" aria-labelledby="level-heading">
        <h2 id="level-heading" className="section-kicker mb-5">{t.progress.levelProgress}</h2>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#d6a85b] font-bold">{t.progress.level} {progress.level}</span>
          <span className="text-[#66706d] text-xs tabular-nums">{xpCurrent} / {xpNeeded} {t.progress.xpToNext}</span>
        </div>
        <ProgressBar value={xpCurrent} max={xpNeeded} color="violet" label="XP" />
      </section>

      {/* Streak */}
      <section className="surface rounded-xl p-6 mb-4" aria-labelledby="streak-heading">
        <h2 id="streak-heading" className="section-kicker mb-5">{t.progress.practiceStreak}</h2>
        <div className="flex items-center gap-5 mb-5">
          <div className="text-4xl font-semibold text-[#f0c979] tabular-nums">{progress.streak}</div>
          <div>
            <p className="text-[#f3eee5] text-sm font-medium">
              {progress.streak === 0 ? t.progress.noStreak
                : progress.streak === 1 ? t.progress.dayStreak
                : `${progress.streak} ${t.progress.daysStreak}`}
            </p>
            <p className="text-[#66706d] text-xs mt-0.5">
              {progress.lastPracticeDate
                ? `${t.progress.lastPractice} ${progress.lastPracticeDate}`
                : t.progress.startStreak}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5" aria-label={t.progress.last7Days}>
          {Array.from({ length: 7 }, (_, i) => {
            const active = i < Math.min(progress.streak, 7);
            return (
              <div
                key={i}
                aria-label={active ? 'Active day' : 'Inactive day'}
                className={`flex-1 h-2 rounded-full ${active ? 'bg-[#d6a85b]' : 'bg-[rgba(235,226,207,0.07)]'}`}
              />
            );
          })}
        </div>
        <p className="text-[#66706d] text-xs mt-2">{t.progress.last7Days}</p>
      </section>

      {/* Lessons */}
      <section className="surface rounded-xl p-6 mb-4" aria-labelledby="lessons-heading">
        <div className="flex items-center justify-between mb-5">
          <h2 id="lessons-heading" className="section-kicker">{t.progress.lessonsTitle}</h2>
          <span className="text-xs text-[#66706d] tabular-nums">{progress.completedLessons.length} / {lessons.length}</span>
        </div>
        <ProgressBar value={progress.completedLessons.length} max={lessons.length} color="green" label="Lessons" className="mb-5" />
        <ul className="space-y-0" role="list">
          {lessons.map((lesson) => {
            const done  = progress.completedLessons.includes(lesson.id);
            const score = progress.quizScores[lesson.id];
            return (
              <li
                key={lesson.id}
                className="flex items-center justify-between py-2.5 border-b border-[rgba(235,226,207,0.06)] last:border-0"
              >
                <span className={`flex items-center gap-2 text-sm ${done ? 'text-[#d8d1c4]' : 'text-[#66706d]'}`}>
                  <span aria-hidden className={`text-xs ${done ? 'text-[#75b7a8]' : 'text-[#3e4744]'}`}>
                    {done ? '●' : '○'}
                  </span>
                  {lesson.title}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#66706d]">
                  {done && <span className="text-[#d6a85b]">+{lesson.xpReward} XP</span>}
                  {score !== undefined && <span>{t.progress.quizBest} {score}%</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Achievements */}
      <section aria-labelledby="achievements-heading" className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 id="achievements-heading" className="section-kicker">{t.progress.achievementsTitle}</h2>
          <span className="text-xs text-[#66706d] tabular-nums">{progress.achievements.length} / {ACHIEVEMENT_DEFS.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ACHIEVEMENT_DEFS.map((a) => {
            const { title, description } = getAchievementLabel(a.id, t);
            return (
              <AchievementBadge
                key={a.id}
                achievementId={a.id}
                unlocked={progress.achievements.includes(a.id)}
                title={title}
                description={description}
              />
            );
          })}
        </div>
      </section>

      {/* Danger zone */}
      <div className="border-t border-[rgba(235,226,207,0.07)] pt-8">
        <p className="text-[#66706d] text-xs mb-3">{t.progress.dangerZone}</p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-rose-500/[0.08] hover:bg-rose-500/[0.14] border border-rose-500/20 text-rose-300 text-xs font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-rose-300"
        >
          {t.progress.resetButton}
        </button>
      </div>
    </div>
  );
}
