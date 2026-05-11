'use client';

import { useCallback } from 'react';

// Tiny Web Audio API sound synthesizer — no external files needed
export function useSound() {
  const play = useCallback((type: 'correct' | 'wrong' | 'complete' | 'click') => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const configs: Record<string, { freq: number; oscType: OscillatorType; duration: number; vol: number }> = {
        correct:  { freq: 523, oscType: 'sine',     duration: 0.15, vol: 0.3 },
        wrong:    { freq: 220, oscType: 'sawtooth', duration: 0.2,  vol: 0.2 },
        complete: { freq: 659, oscType: 'sine',     duration: 0.4,  vol: 0.4 },
        click:    { freq: 800, oscType: 'sine',     duration: 0.05, vol: 0.1 },
      };

      const { freq, oscType, duration, vol } = configs[type];
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      // Play a second note for "complete"
      if (oscType === 'sine' && type === 'complete') {
        const osc2 = ctx.createOscillator();
        osc2.connect(gain);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(784, ctx.currentTime + 0.15);
        osc2.start(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.45);
      }
    } catch {
      // Audio not available — silently ignore
    }
  }, []);

  return { play };
}
