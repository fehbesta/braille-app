// Legacy shim for older imports of '@/data/braille'.
// New code should import standards from '@/data/braille/index'.
import { getStandard } from './braille/index';

const defaultStandard = getStandard('en');

export const BRAILLE_ALPHABET = defaultStandard.alphabet;
export const BRAILLE_NUMBERS = defaultStandard.numbers;
export const BRAILLE_WORDS = defaultStandard.words;
export const DOTS_TO_CHAR = defaultStandard.dotsToChar;
export const CHAR_TO_BRAILLE = defaultStandard.charToBraille;
