import { BrailleChar } from '@/types';

const NUMERIC_INDICATOR_DOTS = [3, 4, 5, 6];

const DOT_BIT: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
};

export function dotsToBrailleUnicode(dots: number[]): string {
  const mask = dots.reduce((acc, dot) => acc | (1 << DOT_BIT[dot]), 0);
  return String.fromCodePoint(0x2800 + mask);
}

export function getBrailleDisplayText(char: BrailleChar): string {
  const cell = dotsToBrailleUnicode(char.dots);
  if (char.category === 'number') return `${dotsToBrailleUnicode(NUMERIC_INDICATOR_DOTS)}${cell}`;
  return cell;
}

export function getBrailleDisplayLabel(char: BrailleChar): string {
  if (char.category === 'number') return `${char.char} (${getBrailleDisplayText(char)})`;
  return `${char.char} (${getBrailleDisplayText(char)})`;
}
