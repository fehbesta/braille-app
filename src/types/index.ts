// ─── Core Braille types ───────────────────────────────────────────────────────

export interface BrailleChar {
  char: string;
  dots: number[];
  label: string;
  category: 'letter' | 'number' | 'word' | 'punctuation' | 'accented';
  pronunciation?: string; // optional phonetic hint
}

// ─── Braille Standard (one per language/region) ───────────────────────────────

export type StandardId = 'en' | 'pt-BR';

export interface BrailleStandard {
  id: StandardId;
  name: string;          // e.g. "English Braille"
  nativeName: string;    // e.g. "Braille Inglês"
  flag: string;          // compact locale marker shown in the language UI
  locale: string;        // BCP-47 locale tag
  alphabet: BrailleChar[];
  numbers: BrailleChar[];
  accented: BrailleChar[];
  words: BrailleChar[];
  /** Derived lookup: sorted-dot-key → char */
  dotsToChar: Record<string, string>;
  /** Derived lookup: char → BrailleChar */
  charToBraille: Record<string, BrailleChar>;
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'alphabet' | 'numbers' | 'words' | 'accented';
  items: BrailleChar[];
  xpReward: number;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  type: 'identify-char' | 'select-dots';
  brailleChar: BrailleChar;
  options: string[];
  correctAnswer: string;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  achievements: string[];
  totalCorrect: number;
  totalAttempts: number;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export interface LocaleStrings {
  // Nav
  nav: {
    home: string;
    learn: string;
    quiz: string;
    read: string;
    type: string;
    progress: string;
    language: string;
  };
  // Home
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroTagline: string;
    startLearning: string;
    takeQuiz: string;
    aboutTitle: string;
    aboutP1: string;
    aboutP2: string;
    startLesson1: string;
    featuresTitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    beginFree: string;
    statsLetters: string;
    statsNumbers: string;
    statsLessons: string;
    statsFree: string;
    chipBraille: string;
    chipTouch: string;
    chipReading: string;
    dotLeft: string;
    dotRight: string;
    dotDiagramLabel: string;
  };
  // Learn
  learn: {
    title: string;
    subtitle: string;
    level: string;
    categoryAlphabet: string;
    categoryNumbers: string;
    categoryWords: string;
    categoryAccented: string;
    start: string;
    review: string;
    quiz: string;
  };
  // Lesson
  lesson: {
    clickToReveal: string;
    dots: string;
    prev: string;
    next: string;
    complete: string;
    lessonComplete: string;
    xpEarned: string;
    takeQuiz: string;
    allLessons: string;
    achievementUnlocked: string;
  };
  // Quiz
  quiz: {
    title: string;
    mixedTitle: string;
    identifyPrompt: string;
    selectDotsPrompt: string;
    correct: string;
    wrong: string;
    complete: string;
    score: string;
    correctLabel: string;
    bestStreak: string;
    retry: string;
    lessons: string;
    streakMessage: string;
  };
  read: {
    title: string;
    subtitle: string;
    prompt: string;
    totalAnswered: string;
    correctAnswers: string;
    currentStreak: string;
    accuracy: string;
    answerLabel: string;
    answerPlaceholder: string;
    submit: string;
    next: string;
    showAnswer: string;
    correct: string;
    incorrect: string;
    expected: string;
    progress: string;
  };
  // Type
  type: {
    title: string;
    subtitle: string;
    mappingTitle: string;
    leftHand: string;
    rightHand: string;
    placeholder: string;
    backspace: string;
    clear: string;
    chordLabel: string;
    activeDots: string;
    tabAlphabet: string;
    tabNumbers: string;
    exampleNote: string;
    modeLetters: string;
    modeNumbers: string;
    holdReleaseHelp: string;
    tapConfirmHelp: string;
    idleHelp: string;
    unknownPattern: string;
    wrotePattern: string;
    wroteFromDots: string;
    confirmCharacter: string;
    clearCell: string;
    numberSign: string;
    space: string;
    interactionHelp: string;
    referenceNote: string;
  };
  // Progress
  progress: {
    title: string;
    level: string;
    totalXP: string;
    streak: string;
    accuracy: string;
    levelProgress: string;
    xpToNext: string;
    practiceStreak: string;
    noStreak: string;
    dayStreak: string;
    daysStreak: string;
    lastPractice: string;
    startStreak: string;
    last7Days: string;
    lessonsTitle: string;
    lessonsCompleted: string;
    achievementsTitle: string;
    achievementsUnlocked: string;
    dangerZone: string;
    resetButton: string;
    resetConfirm: string;
    resetDone: string;
    quizBest: string;
  };
  // Achievements
  achievements: Record<string, { title: string; description: string }>;
  // Motivational
  motivational: string[];
  // Features list
  features: Array<{ icon: string; title: string; desc: string }>;
}
