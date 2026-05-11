import { StandardId } from '@/types';

export interface ReadingPracticeEntry {
  id: string;
  answer: string;
}

const PT_BR_WORDS: ReadingPracticeEntry[] = [
  { id: 'pt-casa', answer: 'casa' },
  { id: 'pt-bola', answer: 'bola' },
  { id: 'pt-gato', answer: 'gato' },
  { id: 'pt-lua', answer: 'lua' },
  { id: 'pt-livro', answer: 'livro' },
  { id: 'pt-mao', answer: 'mao' },
  { id: 'pt-dedo', answer: 'dedo' },
  { id: 'pt-mesa', answer: 'mesa' },
  { id: 'pt-sapo', answer: 'sapo' },
  { id: 'pt-vaso', answer: 'vaso' },
];

const EN_WORDS: ReadingPracticeEntry[] = [
  { id: 'en-book', answer: 'book' },
  { id: 'en-hand', answer: 'hand' },
  { id: 'en-star', answer: 'star' },
  { id: 'en-home', answer: 'home' },
  { id: 'en-tree', answer: 'tree' },
  { id: 'en-moon', answer: 'moon' },
  { id: 'en-fish', answer: 'fish' },
  { id: 'en-bell', answer: 'bell' },
];

export function getReadingPracticeWords(standardId: StandardId): ReadingPracticeEntry[] {
  return standardId === 'pt-BR' ? PT_BR_WORDS : EN_WORDS;
}
