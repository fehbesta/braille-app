import { BrailleChar, BrailleStandard, StandardId } from '@/types';
import { englishStandard } from './english';
import { portugueseBRStandard } from './portugueseBR';

// ─── Lookup builder (called by each standard file) ───────────────────────────
export function buildLookups(
  alphabet: BrailleChar[],
  numbers: BrailleChar[],
  accented: BrailleChar[],
  words: BrailleChar[]
): { dotsToChar: Record<string, string>; charToBraille: Record<string, BrailleChar> } {
  const all = [...alphabet, ...numbers, ...accented, ...words];
  const textInputOrder = [...words, ...numbers, ...accented, ...alphabet];
  return {
    dotsToChar: Object.fromEntries(
      textInputOrder.map((b) => [[...b.dots].sort().join(','), b.char])
    ),
    charToBraille: Object.fromEntries(all.map((b) => [b.char, b])),
  };
}

// ─── Registry ────────────────────────────────────────────────────────────────
// Previously used require() with a module-level singleton, which ran eagerly
// on the server and caused issues with circular deps. Plain ESM imports are
// tree-shakeable, statically analysable, and work correctly in both SSR and
// client bundles.
const REGISTRY: Record<StandardId, BrailleStandard> = {
  'en':    englishStandard,
  'pt-BR': portugueseBRStandard,
};

export function getStandard(id: StandardId): BrailleStandard {
  return REGISTRY[id];
}

export const ALL_STANDARDS: StandardId[] = ['en', 'pt-BR'];
