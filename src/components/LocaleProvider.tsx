'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocale, LocaleContext } from '@/hooks/useLocale';
import { getStandard } from '@/data/braille/index';
import { getStrings } from '@/data/i18n/index';
import { buildLessons } from '@/data/lessons';

// Provide a safe default so useLocaleContext never returns undefined
const defaultStandard = getStandard('en');
const defaultT        = getStrings('en');

const Ctx = createContext<LocaleContext>({
  standardId: 'en',
  standard:   defaultStandard,
  t:          defaultT,
  lessons:    buildLessons(defaultStandard, defaultT),
  setStandard: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export function useLocaleContext(): LocaleContext {
  return useContext(Ctx);
}
