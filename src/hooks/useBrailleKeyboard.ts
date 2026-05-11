'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const KEY_TO_DOT: Record<string, number> = {
  f: 1, d: 2, s: 3,
  j: 4, k: 5, l: 6,
};

const NUMERIC_INDICATOR = '⠼';

const NUMBER_DOT_TO_DIGIT: Record<string, string> = {
  '1': '1',
  '1,2': '2',
  '1,4': '3',
  '1,4,5': '4',
  '1,5': '5',
  '1,2,4': '6',
  '1,2,4,5': '7',
  '1,2,5': '8',
  '2,4': '9',
  '2,4,5': '0',
};

interface Options {
  dotsToChar: Record<string, string>;
}

type LastInputStatus = 'idle' | 'accepted' | 'unknown';

function sortDots(dots: number[]): number[] {
  return [...dots].sort((a, b) => a - b);
}

function inferNumericMode(text: string): boolean {
  const lastSpace = text.lastIndexOf(' ');
  const segment = lastSpace >= 0 ? text.slice(lastSpace + 1) : text;
  const indicatorIndex = segment.lastIndexOf(NUMERIC_INDICATOR);
  if (indicatorIndex === -1) return false;
  const trailing = segment.slice(indicatorIndex + NUMERIC_INDICATOR.length);
  return trailing.length === 0 || /^\d+$/.test(trailing);
}

export function useBrailleKeyboard({ dotsToChar }: Options) {
  const [activeDots, setActiveDots] = useState<number[]>([]);
  const [typedText, setTypedText] = useState<string>('');
  const [numericMode, setNumericMode] = useState(false);
  const [lastInput, setLastInput] = useState<{
    dots: number[];
    char: string | null;
    status: LastInputStatus;
  }>({ dots: [], char: null, status: 'idle' });

  const heldKeys = useRef<Set<string>>(new Set());
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef(dotsToChar);
  const dotsRef = useRef<number[]>([]);
  const numericModeRef = useRef(false);

  useEffect(() => {
    mapRef.current = dotsToChar;
  }, [dotsToChar]);

  useEffect(() => {
    numericModeRef.current = numericMode;
  }, [numericMode]);

  const commitDots = useCallback((dots: number[]) => {
    const sortedDots = sortDots(dots);
    if (!sortedDots.length) return;

    const dotKey = sortedDots.join(',');
    const resolved = mapRef.current[dotKey];
    const digit = NUMBER_DOT_TO_DIGIT[dotKey];

    if (numericModeRef.current && digit) {
      setTypedText((prev) => prev + digit);
      setLastInput({ dots: sortedDots, char: digit, status: 'accepted' });
      return;
    }

    if (resolved) {
      setTypedText((prev) => prev + resolved);
      setLastInput({ dots: sortedDots, char: resolved, status: 'accepted' });
      if (numericModeRef.current && !digit) setNumericMode(false);
      return;
    }

    setLastInput({ dots: sortedDots, char: null, status: 'unknown' });
    if (numericModeRef.current) setNumericMode(false);
  }, []);

  const insertNumericIndicator = useCallback(() => {
    setTypedText((prev) => prev + NUMERIC_INDICATOR);
    setNumericMode(true);
    setLastInput({ dots: [3, 4, 5, 6], char: NUMERIC_INDICATOR, status: 'accepted' });
  }, []);

  const insertSpace = useCallback(() => {
    setTypedText((prev) => prev + ' ');
    setNumericMode(false);
    setLastInput({ dots: [], char: ' ', status: 'accepted' });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key === ' ') {
      e.preventDefault();
      if (activeDots.length === 0 && heldKeys.current.size === 0) insertSpace();
      return;
    }

    if (key === '#') {
      e.preventDefault();
      insertNumericIndicator();
      return;
    }

    if (!(key in KEY_TO_DOT)) return;
    e.preventDefault();
    if (releaseTimer.current) {
      clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    }
    heldKeys.current.add(key);
    const dots = [...heldKeys.current].map((heldKey) => KEY_TO_DOT[heldKey]);
    dotsRef.current = dots;
    setActiveDots(dots);
    setLastInput((prev) => (prev.status === 'unknown' ? { dots: [], char: null, status: 'idle' } : prev));
  }, [activeDots.length, insertNumericIndicator, insertSpace]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (!(key in KEY_TO_DOT)) return;
    heldKeys.current.delete(key);

    if (heldKeys.current.size === 0) {
      const snapshot = dotsRef.current;
      releaseTimer.current = setTimeout(() => {
        commitDots(snapshot);
        dotsRef.current = [];
        setActiveDots([]);
      }, 80);
    }
  }, [commitDots]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [handleKeyDown, handleKeyUp]);

  const clearText = useCallback(() => {
    setTypedText('');
    setNumericMode(false);
    setLastInput({ dots: [], char: null, status: 'idle' });
  }, []);

  const backspace = useCallback(() => {
    setTypedText((prev) => {
      const next = prev.slice(0, -1);
      setNumericMode(inferNumericMode(next));
      return next;
    });
  }, []);

  return {
    activeDots,
    typedText,
    numericMode,
    lastInput,
    commitDots,
    insertSpace,
    insertNumericIndicator,
    clearText,
    backspace,
  };
}
