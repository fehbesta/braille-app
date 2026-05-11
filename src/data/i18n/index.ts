import { LocaleStrings, StandardId } from '@/types';
import { en } from './en';
import { ptBR } from './pt-BR';

export const LOCALE_STRINGS: Record<StandardId, LocaleStrings> = {
  'en':    en,
  'pt-BR': ptBR,
};

export function getStrings(id: StandardId): LocaleStrings {
  return LOCALE_STRINGS[id] ?? en;
}
