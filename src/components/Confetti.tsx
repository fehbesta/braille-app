'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = ['#a78bfa', '#34d399', '#fbbf24', '#f472b6', '#60a5fa'];

// 12 particles max — enough for visual feedback without DOM/paint overhead
const PARTICLE_COUNT = 12;

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      const clearTimer = setTimeout(() => setParticles([]), 0);
      return () => clearTimeout(clearTimer);
    }
    const ps: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: 10 + (i / PARTICLE_COUNT) * 80, // spread evenly, no Math.random in loop
      color: COLORS[i % COLORS.length],
      size: 7,
      delay: (i % 4) * 0.1,
    }));
    const showTimer = setTimeout(() => setParticles(ps), 0);
    const hideTimer = setTimeout(() => setParticles([]), 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [active]);

  if (!particles.length) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle absolute top-1/3 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
