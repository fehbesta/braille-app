'use client';

import { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '@/types';
import { BrailleCell } from './BrailleCell';
import { useSound } from '@/hooks/useSound';
import { useLocaleContext } from './LocaleProvider';
import { getBrailleDisplayLabel, getBrailleDisplayText } from '@/utils/brailleDisplay';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { play } = useSound();
  const { t } = useLocaleContext();

  const answeredRef = useRef(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAnswerRef = useRef(onAnswer);
  useEffect(() => { onAnswerRef.current = onAnswer; }, [onAnswer]);

  useEffect(() => {
    answeredRef.current = false;
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [question]);

  const handleSelect = (option: string) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setSelected(option);
    const correct = option === question.correctAnswer;
    play(correct ? 'correct' : 'wrong');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onAnswerRef.current(correct);
    }, 1000);
  };

  const isIdentify = question.type === 'identify-char';
  const isNumber = question.brailleChar.category === 'number';

  return (
    <div className="flex flex-col items-center gap-7 w-full max-w-md mx-auto">
      {/* Prompt */}
      <p className="text-[#a9b0a9] text-center text-sm font-medium">
        {isIdentify
          ? t.quiz.identifyPrompt
          : `${t.quiz.selectDotsPrompt} "${question.brailleChar.char}"`}
      </p>

      {/* Subject */}
      <div className="flex flex-col items-center gap-3">
        {isIdentify ? (
          <div className="p-5 surface rounded-xl flex flex-col items-center gap-3">
            {isNumber && (
              <div className="flex items-center gap-2" aria-label={getBrailleDisplayLabel(question.brailleChar)}>
                <BrailleCell activeDots={[3, 4, 5, 6]} size="lg" label="Numeric indicator" />
                <BrailleCell activeDots={question.brailleChar.dots} size="lg" label="Braille number cell" />
              </div>
            )}
            {!isNumber && (
              <BrailleCell activeDots={question.brailleChar.dots} size="lg" label="Braille cell to identify" />
            )}
            {isNumber && (
              <p className="text-[#8f9995] text-xs">
                Number sign plus digit cell: {getBrailleDisplayText(question.brailleChar)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 bg-[rgba(214,168,91,0.13)] border border-[rgba(214,168,91,0.30)] rounded-xl flex items-center justify-center text-4xl font-semibold text-[#f3eee5]"
              aria-label={`${isNumber ? 'Number' : 'Character'} ${question.brailleChar.char}`}
            >
              {question.brailleChar.char}
            </div>
            {isNumber && (
              <p className="text-[#8f9995] text-xs">
                Write numbers with the numeric indicator: {getBrailleDisplayText(question.brailleChar)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {question.options.map((option) => {
          const isCorrect  = option === question.correctAnswer;
          const isSelected = option === selected;

          let cls = 'surface hover:bg-[rgba(235,226,207,0.055)] hover:border-[rgba(235,226,207,0.16)]';
          if (selected) {
            if (isCorrect)       cls = 'bg-[rgba(117,183,168,0.12)] border-[rgba(117,183,168,0.42)] text-[#9ad7c8]';
            else if (isSelected) cls = 'bg-rose-500/10 border-rose-500/40 text-rose-300';
            else                 cls = 'surface opacity-40';
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              aria-pressed={isSelected}
              aria-label={isIdentify ? `Option: ${option}` : `Dot pattern: ${option}`}
              className={`border rounded-lg p-4 flex items-center justify-center transition-colors duration-150 font-medium text-[#f3eee5] focus-visible:outline-2 focus-visible:outline-[#f0c979] min-h-[72px] tactile-hover ${cls}`}
            >
              {isIdentify ? (
                <span className="text-2xl font-bold">{option}</span>
              ) : (
                <div className="flex items-center gap-2">
                  {isNumber && <BrailleCell activeDots={[3, 4, 5, 6]} size="sm" label="Numeric indicator" />}
                  <BrailleCell activeDots={option.split(',').map(Number)} size="sm" label={`Dot pattern ${option}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected && (
        <div
          role="alert"
          aria-live="assertive"
          className={`w-full py-3 px-4 rounded-xl text-center text-sm font-medium animate-fade-in ${
            selected === question.correctAnswer
              ? 'bg-[rgba(117,183,168,0.12)] text-[#9ad7c8] border border-[rgba(117,183,168,0.28)]'
              : 'bg-rose-500/10 text-rose-300 border border-rose-500/25'
          }`}
        >
          {selected === question.correctAnswer
            ? t.quiz.correct
            : `${t.quiz.wrong} "${question.brailleChar.char}" (${t.lesson.dots}: ${isNumber ? `${getBrailleDisplayText(question.brailleChar)} = ` : ''}${question.brailleChar.dots.join(', ')})`}
        </div>
      )}
    </div>
  );
}
