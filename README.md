# BrailleLearn

BrailleLearn is an interactive web app for learning Braille in the browser. It includes guided lessons, quizzes, progress tracking, achievements, language selection, and a Perkins-style typing trainer.

The app currently supports English Braille and Brazilian Portuguese Braille.

## Features

- Guided Braille lessons
- Interactive quizzes
- Typing trainer for Braille practice
- Progress and achievement tracking
- English and Brazilian Portuguese content
- Offline-stable build configuration using system fonts

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notes

Use the default development command:

```bash
npm run dev
```

The production build does not depend on downloading Google Fonts. Typography uses local system font stacks defined in `src/app/globals.css`.
