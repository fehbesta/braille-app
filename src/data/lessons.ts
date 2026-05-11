import { Lesson, BrailleStandard, LocaleStrings } from '@/types';

/**
 * Generates the full lesson list for any BrailleStandard + locale combination.
 * Adding a new standard only requires adding its data file.
 */
export function buildLessons(std: BrailleStandard, t: LocaleStrings): Lesson[] {
  const lessons: Lesson[] = [];

  const alpha = std.alphabet;
  const chunks = [
    { slice: [0, 5], suffix: 'A-E', xp: 20 },
    { slice: [5, 10], suffix: 'F-J', xp: 20 },
    { slice: [10, 15], suffix: 'K-O', xp: 25 },
    { slice: [15, 20], suffix: 'P-T', xp: 25 },
    { slice: [20, 26], suffix: 'U-Z', xp: 30 },
  ] as const;

  chunks.forEach(({ slice, suffix, xp }, i) => {
    const items = alpha.slice(slice[0], slice[1]);
    if (!items.length) return;
    lessons.push({
      id: `alphabet-${i + 1}`,
      title: `${t.learn.categoryAlphabet}: ${suffix}`,
      description: `${t.learn.categoryAlphabet} ${suffix}`,
      category: 'alphabet',
      items,
      xpReward: xp,
    });
  });

  if (std.numbers.length) {
    const numbersDescription = std.locale === 'pt-BR'
      ? `${t.learn.categoryNumbers} 0-9 com indicador numerico`
      : `${t.learn.categoryNumbers} 0-9 with numeric indicator`;
    lessons.push({
      id: 'numbers-1',
      title: `${t.learn.categoryNumbers} 0-9`,
      description: numbersDescription,
      category: 'numbers',
      items: std.numbers,
      xpReward: 30,
    });
  }

  if (std.accented.length) {
    const group1 = std.accented.slice(0, 6);
    const group2 = std.accented.slice(6);
    lessons.push({
      id: 'accented-1',
      title: `${t.learn.categoryAccented} I`,
      description: `${t.learn.categoryAccented} I`,
      category: 'accented',
      items: group1,
      xpReward: 30,
    });
    if (group2.length) {
      lessons.push({
        id: 'accented-2',
        title: `${t.learn.categoryAccented} II`,
        description: `${t.learn.categoryAccented} II`,
        category: 'accented',
        items: group2,
        xpReward: 30,
      });
    }
  }

  if (std.words.length) {
    lessons.push({
      id: 'words-1',
      title: t.learn.categoryWords,
      description: t.learn.categoryWords,
      category: 'words',
      items: std.words,
      xpReward: 40,
    });
  }

  return lessons;
}
