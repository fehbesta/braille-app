import { StandardId } from '@/types';

export type ReadingDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ReadingPracticeEntry {
  id: string;
  answer: string;
  difficulty: ReadingDifficulty;
}

const PT_BR_WORDS: ReadingPracticeEntry[] = [
  { id: 'pt-casa', answer: 'casa', difficulty: 'beginner' },
  { id: 'pt-bola', answer: 'bola', difficulty: 'beginner' },
  { id: 'pt-gato', answer: 'gato', difficulty: 'beginner' },
  { id: 'pt-lua', answer: 'lua', difficulty: 'beginner' },
  { id: 'pt-mesa', answer: 'mesa', difficulty: 'beginner' },
  { id: 'pt-vaso', answer: 'vaso', difficulty: 'beginner' },
  { id: 'pt-livro', answer: 'livro', difficulty: 'intermediate' },
  { id: 'pt-dedos', answer: 'dedos', difficulty: 'intermediate' },
  { id: 'pt-musica', answer: 'm\u00fasica', difficulty: 'intermediate' },
  { id: 'pt-licao', answer: 'li\u00e7\u00e3o', difficulty: 'intermediate' },
  { id: 'pt-pratica', answer: 'pr\u00e1tica', difficulty: 'intermediate' },
  { id: 'pt-leitura', answer: 'leitura', difficulty: 'intermediate' },
  { id: 'pt-bom-dia', answer: 'bom dia', difficulty: 'advanced' },
  { id: 'pt-sala-2', answer: 'sala 2', difficulty: 'advanced' },
  { id: 'pt-texto-braille', answer: 'texto braille', difficulty: 'advanced' },
  { id: 'pt-nivel-3', answer: 'n\u00edvel 3', difficulty: 'advanced' },
];

const EN_WORDS: ReadingPracticeEntry[] = [
  { id: 'en-book', answer: 'book', difficulty: 'beginner' },
  { id: 'en-hand', answer: 'hand', difficulty: 'beginner' },
  { id: 'en-star', answer: 'star', difficulty: 'beginner' },
  { id: 'en-home', answer: 'home', difficulty: 'beginner' },
  { id: 'en-tree', answer: 'tree', difficulty: 'beginner' },
  { id: 'en-moon', answer: 'moon', difficulty: 'beginner' },
  { id: 'en-braille', answer: 'braille', difficulty: 'intermediate' },
  { id: 'en-reader', answer: 'reader', difficulty: 'intermediate' },
  { id: 'en-letter', answer: 'letter', difficulty: 'intermediate' },
  { id: 'en-cafe', answer: 'caf\u00e9', difficulty: 'intermediate' },
  { id: 'en-dot-grid', answer: 'dot grid', difficulty: 'advanced' },
  { id: 'en-room-2', answer: 'room 2', difficulty: 'advanced' },
  { id: 'en-level-3', answer: 'level 3', difficulty: 'advanced' },
];

export function getReadingPracticeWords(standardId: StandardId): ReadingPracticeEntry[] {
  return standardId === 'pt-BR' ? PT_BR_WORDS : EN_WORDS;
}
