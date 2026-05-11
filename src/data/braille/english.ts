import { BrailleChar, BrailleStandard } from '@/types';
import { buildLookups } from './index';

// Standard Grade 1 English Braille
// Dot layout:  1 4
//              2 5
//              3 6

const alphabet: BrailleChar[] = [
  { char: 'A', dots: [1],             label: 'Letter A', category: 'letter' },
  { char: 'B', dots: [1, 2],          label: 'Letter B', category: 'letter' },
  { char: 'C', dots: [1, 4],          label: 'Letter C', category: 'letter' },
  { char: 'D', dots: [1, 4, 5],       label: 'Letter D', category: 'letter' },
  { char: 'E', dots: [1, 5],          label: 'Letter E', category: 'letter' },
  { char: 'F', dots: [1, 2, 4],       label: 'Letter F', category: 'letter' },
  { char: 'G', dots: [1, 2, 4, 5],    label: 'Letter G', category: 'letter' },
  { char: 'H', dots: [1, 2, 5],       label: 'Letter H', category: 'letter' },
  { char: 'I', dots: [2, 4],          label: 'Letter I', category: 'letter' },
  { char: 'J', dots: [2, 4, 5],       label: 'Letter J', category: 'letter' },
  { char: 'K', dots: [1, 3],          label: 'Letter K', category: 'letter' },
  { char: 'L', dots: [1, 2, 3],       label: 'Letter L', category: 'letter' },
  { char: 'M', dots: [1, 3, 4],       label: 'Letter M', category: 'letter' },
  { char: 'N', dots: [1, 3, 4, 5],    label: 'Letter N', category: 'letter' },
  { char: 'O', dots: [1, 3, 5],       label: 'Letter O', category: 'letter' },
  { char: 'P', dots: [1, 2, 3, 4],    label: 'Letter P', category: 'letter' },
  { char: 'Q', dots: [1, 2, 3, 4, 5], label: 'Letter Q', category: 'letter' },
  { char: 'R', dots: [1, 2, 3, 5],    label: 'Letter R', category: 'letter' },
  { char: 'S', dots: [2, 3, 4],       label: 'Letter S', category: 'letter' },
  { char: 'T', dots: [2, 3, 4, 5],    label: 'Letter T', category: 'letter' },
  { char: 'U', dots: [1, 3, 6],       label: 'Letter U', category: 'letter' },
  { char: 'V', dots: [1, 2, 3, 6],    label: 'Letter V', category: 'letter' },
  { char: 'W', dots: [2, 4, 5, 6],    label: 'Letter W', category: 'letter' },
  { char: 'X', dots: [1, 3, 4, 6],    label: 'Letter X', category: 'letter' },
  { char: 'Y', dots: [1, 3, 4, 5, 6], label: 'Letter Y', category: 'letter' },
  { char: 'Z', dots: [1, 3, 5, 6],    label: 'Letter Z', category: 'letter' },
];

// Numbers share patterns with A–J
const numbers: BrailleChar[] = [
  { char: '1', dots: [1],          label: 'Number 1 with numeric indicator', category: 'number' },
  { char: '2', dots: [1, 2],       label: 'Number 2 with numeric indicator', category: 'number' },
  { char: '3', dots: [1, 4],       label: 'Number 3 with numeric indicator', category: 'number' },
  { char: '4', dots: [1, 4, 5],    label: 'Number 4 with numeric indicator', category: 'number' },
  { char: '5', dots: [1, 5],       label: 'Number 5 with numeric indicator', category: 'number' },
  { char: '6', dots: [1, 2, 4],    label: 'Number 6 with numeric indicator', category: 'number' },
  { char: '7', dots: [1, 2, 4, 5], label: 'Number 7 with numeric indicator', category: 'number' },
  { char: '8', dots: [1, 2, 5],    label: 'Number 8 with numeric indicator', category: 'number' },
  { char: '9', dots: [2, 4],       label: 'Number 9 with numeric indicator', category: 'number' },
  { char: '0', dots: [2, 4, 5],    label: 'Number 0 with numeric indicator', category: 'number' },
];

// Grade 1 common word contractions
const words: BrailleChar[] = [
  { char: 'AND',  dots: [1, 2, 3, 4, 5, 6], label: 'Word: and',  category: 'word' },
  { char: 'FOR',  dots: [1, 2, 3, 4, 5],    label: 'Word: for',  category: 'word' },
  { char: 'OF',   dots: [1, 2, 3, 5, 6],    label: 'Word: of',   category: 'word' },
  { char: 'THE',  dots: [2, 3, 4, 6],       label: 'Word: the',  category: 'word' },
  { char: 'WITH', dots: [2, 3, 4, 5, 6],    label: 'Word: with', category: 'word' },
];

// English has no accented letters
const accented: BrailleChar[] = [];

export const englishStandard: BrailleStandard = {
  id: 'en',
  name: 'English Braille',
  nativeName: 'English Braille',
  flag: 'EN',
  locale: 'en',
  alphabet,
  numbers,
  accented,
  words,
  ...buildLookups(alphabet, numbers, accented, words),
};
