import { BrailleChar, BrailleStandard } from '@/types';
import { buildLookups } from './index';

// Brazilian Portuguese Braille, checked against MEC/SEESP,
// "Grafia Braille para a Lingua Portuguesa" (2006), Chapter II.
// Notes from the standard:
// - c cedilha is dots 1-2-3-4-6.
// - digits use the same cells as A-J and are preceded by the number sign in
//   full Braille text. This beginner app teaches the digit cells separately.

const alphabet: BrailleChar[] = [
  { char: 'A', dots: [1],             label: 'Letra A', category: 'letter', pronunciation: 'a' },
  { char: 'B', dots: [1, 2],          label: 'Letra B', category: 'letter', pronunciation: 'be' },
  { char: 'C', dots: [1, 4],          label: 'Letra C', category: 'letter', pronunciation: 'ce' },
  { char: 'D', dots: [1, 4, 5],       label: 'Letra D', category: 'letter', pronunciation: 'de' },
  { char: 'E', dots: [1, 5],          label: 'Letra E', category: 'letter', pronunciation: 'e' },
  { char: 'F', dots: [1, 2, 4],       label: 'Letra F', category: 'letter', pronunciation: 'efe' },
  { char: 'G', dots: [1, 2, 4, 5],    label: 'Letra G', category: 'letter', pronunciation: 'ge' },
  { char: 'H', dots: [1, 2, 5],       label: 'Letra H', category: 'letter', pronunciation: 'aga' },
  { char: 'I', dots: [2, 4],          label: 'Letra I', category: 'letter', pronunciation: 'i' },
  { char: 'J', dots: [2, 4, 5],       label: 'Letra J', category: 'letter', pronunciation: 'jota' },
  { char: 'K', dots: [1, 3],          label: 'Letra K', category: 'letter', pronunciation: 'ca' },
  { char: 'L', dots: [1, 2, 3],       label: 'Letra L', category: 'letter', pronunciation: 'ele' },
  { char: 'M', dots: [1, 3, 4],       label: 'Letra M', category: 'letter', pronunciation: 'eme' },
  { char: 'N', dots: [1, 3, 4, 5],    label: 'Letra N', category: 'letter', pronunciation: 'ene' },
  { char: 'O', dots: [1, 3, 5],       label: 'Letra O', category: 'letter', pronunciation: 'o' },
  { char: 'P', dots: [1, 2, 3, 4],    label: 'Letra P', category: 'letter', pronunciation: 'pe' },
  { char: 'Q', dots: [1, 2, 3, 4, 5], label: 'Letra Q', category: 'letter', pronunciation: 'que' },
  { char: 'R', dots: [1, 2, 3, 5],    label: 'Letra R', category: 'letter', pronunciation: 'erre' },
  { char: 'S', dots: [2, 3, 4],       label: 'Letra S', category: 'letter', pronunciation: 'esse' },
  { char: 'T', dots: [2, 3, 4, 5],    label: 'Letra T', category: 'letter', pronunciation: 'te' },
  { char: 'U', dots: [1, 3, 6],       label: 'Letra U', category: 'letter', pronunciation: 'u' },
  { char: 'V', dots: [1, 2, 3, 6],    label: 'Letra V', category: 'letter', pronunciation: 've' },
  { char: 'W', dots: [2, 4, 5, 6],    label: 'Letra W', category: 'letter', pronunciation: 'dablio' },
  { char: 'X', dots: [1, 3, 4, 6],    label: 'Letra X', category: 'letter', pronunciation: 'xis' },
  { char: 'Y', dots: [1, 3, 4, 5, 6], label: 'Letra Y', category: 'letter', pronunciation: 'ipsilon' },
  { char: 'Z', dots: [1, 3, 5, 6],    label: 'Letra Z', category: 'letter', pronunciation: 'ze' },
];

const numbers: BrailleChar[] = [
  { char: '1', dots: [1],          label: 'Numero 1 com indicador numerico', category: 'number' },
  { char: '2', dots: [1, 2],       label: 'Numero 2 com indicador numerico', category: 'number' },
  { char: '3', dots: [1, 4],       label: 'Numero 3 com indicador numerico', category: 'number' },
  { char: '4', dots: [1, 4, 5],    label: 'Numero 4 com indicador numerico', category: 'number' },
  { char: '5', dots: [1, 5],       label: 'Numero 5 com indicador numerico', category: 'number' },
  { char: '6', dots: [1, 2, 4],    label: 'Numero 6 com indicador numerico', category: 'number' },
  { char: '7', dots: [1, 2, 4, 5], label: 'Numero 7 com indicador numerico', category: 'number' },
  { char: '8', dots: [1, 2, 5],    label: 'Numero 8 com indicador numerico', category: 'number' },
  { char: '9', dots: [2, 4],       label: 'Numero 9 com indicador numerico', category: 'number' },
  { char: '0', dots: [2, 4, 5],    label: 'Numero 0 com indicador numerico', category: 'number' },
];

const accented: BrailleChar[] = [
  { char: 'Á', dots: [1, 2, 3, 5, 6],    label: 'Letra Á (a agudo)', category: 'accented', pronunciation: 'a agudo' },
  { char: 'À', dots: [1, 2, 4, 6],       label: 'Letra À (a grave)', category: 'accented', pronunciation: 'a grave' },
  { char: 'Â', dots: [1, 6],             label: 'Letra Â (a circunflexo)', category: 'accented', pronunciation: 'a circunflexo' },
  { char: 'Ã', dots: [3, 4, 5],          label: 'Letra Ã (a til)', category: 'accented', pronunciation: 'a til' },
  { char: 'É', dots: [1, 2, 3, 4, 5, 6], label: 'Letra É (e agudo)', category: 'accented', pronunciation: 'e agudo' },
  { char: 'Ê', dots: [1, 2, 6],          label: 'Letra Ê (e circunflexo)', category: 'accented', pronunciation: 'e circunflexo' },
  { char: 'Í', dots: [3, 4],             label: 'Letra Í (i agudo)', category: 'accented', pronunciation: 'i agudo' },
  { char: 'Ó', dots: [3, 4, 6],          label: 'Letra Ó (o agudo)', category: 'accented', pronunciation: 'o agudo' },
  { char: 'Ô', dots: [1, 4, 5, 6],       label: 'Letra Ô (o circunflexo)', category: 'accented', pronunciation: 'o circunflexo' },
  { char: 'Õ', dots: [2, 4, 6],          label: 'Letra Õ (o til)', category: 'accented', pronunciation: 'o til' },
  { char: 'Ú', dots: [2, 3, 4, 5, 6],    label: 'Letra Ú (u agudo)', category: 'accented', pronunciation: 'u agudo' },
  { char: 'Ü', dots: [1, 2, 5, 6],       label: 'Letra Ü (u trema)', category: 'accented', pronunciation: 'u trema' },
  { char: 'Ç', dots: [1, 2, 3, 4, 6],    label: 'Letra Ç (c cedilha)', category: 'accented', pronunciation: 'ce cedilha' },
];

// Beginner word cards use the first cell of each word as a simple entry point.
const words: BrailleChar[] = [
  { char: 'OLÁ',    dots: [1, 3, 5],    label: 'Palavra: ola', category: 'word' },
  { char: 'CASA',   dots: [1, 4],       label: 'Palavra: casa', category: 'word' },
  { char: 'AMOR',   dots: [1],          label: 'Palavra: amor', category: 'word' },
  { char: 'BRASIL', dots: [1, 2],       label: 'Palavra: brasil', category: 'word' },
  { char: 'AMIGO',  dots: [1],          label: 'Palavra: amigo', category: 'word' },
];

export const portugueseBRStandard: BrailleStandard = {
  id: 'pt-BR',
  name: 'Braille Brasileiro',
  nativeName: 'Braille Brasileiro',
  flag: 'PT',
  locale: 'pt-BR',
  alphabet,
  numbers,
  accented,
  words,
  ...buildLookups(alphabet, numbers, accented, words),
};
