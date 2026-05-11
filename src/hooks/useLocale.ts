'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { StandardId, BrailleStandard, LocaleStrings, Lesson } from '@/types';
import { getStandard } from '@/data/braille/index';
import { getStrings } from '@/data/i18n/index';
import { buildLessons } from '@/data/lessons';

const STORAGE_KEY = 'braille_standard';
// The server always renders with this default. The client must start with the
// same value so the hydration HTML matches, then read localStorage afterward.
const DEFAULT_STANDARD: StandardId = 'en';

function readStoredStandardId(): StandardId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return (raw as StandardId) ?? DEFAULT_STANDARD;
  } catch {
    return DEFAULT_STANDARD;
  }
}

export interface LocaleContext {
  standardId: StandardId;
  standard: BrailleStandard;
  t: LocaleStrings;
  lessons: Lesson[];
  setStandard: (id: StandardId) => void;
}

export function useLocale(): LocaleContext {
  // ROOT CAUSE FIX: Previously `useState` was initialised with `loadStandardId`,
  // which read localStorage on the client but returned 'en' on the server.
  // React runs the initialiser during SSR *and* during client hydration, so if
  // the stored locale was 'pt-BR' the client produced different HTML than the
  // server, causing a hydration mismatch.
  //
  // Fix: always start with DEFAULT_STANDARD (matching the server), then apply
  // the stored preference in a useEffect that only runs after hydration.
  const [standardId, setStandardIdState] = useState<StandardId>(DEFAULT_STANDARD);

  // After hydration, silently sync to whatever the user last chose.
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = readStoredStandardId();
      if (stored !== DEFAULT_STANDARD) setStandardIdState(stored);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const setStandard = useCallback((id: StandardId) => {
    setStandardIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage unavailable (private browsing, storage quota) — ignore.
    }
  }, []);

  const standard = useMemo(() => getStandard(standardId), [standardId]);
  const t        = useMemo(() => getStrings(standardId),  [standardId]);
  const lessons  = useMemo(() => buildLessons(standard, t), [standard, t]);

  return { standardId, standard, t, lessons, setStandard };
}
