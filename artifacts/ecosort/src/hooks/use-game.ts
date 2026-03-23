import { useState, useCallback, useEffect, useRef } from 'react';
import { shuffleAllItems, TrashItem, CategoryId } from '@/lib/trash-data';
import { useLocation } from 'wouter';

const TOTAL_SECONDS = 30;

export interface GameResult {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  timeTaken: number;
}

export function useGame() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [, setLocation] = useLocation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishGame = useCallback((finalCorrect: number, finalWrong: number, finalTime: number) => {
    stopTimer();
    setGameState('finished');
    const score = finalCorrect * 10;
    const timeTaken = TOTAL_SECONDS - finalTime;
    sessionStorage.setItem('ecosort_last_score', score.toString());
    sessionStorage.setItem('ecosort_last_correct', finalCorrect.toString());
    sessionStorage.setItem('ecosort_last_wrong', finalWrong.toString());
    sessionStorage.setItem('ecosort_last_total', (finalCorrect + finalWrong).toString());
    sessionStorage.setItem('ecosort_last_time', timeTaken.toString());
    setTimeout(() => setLocation('/results'), 600);
  }, [stopTimer, setLocation]);

  const startGame = useCallback(() => {
    stopTimer();
    const shuffled = shuffleAllItems();
    setItems(shuffled);
    setCurrentIndex(0);
    setCorrect(0);
    setWrong(0);
    setTimeLeft(TOTAL_SECONDS);
    setLastFeedback(null);
    setGameState('playing');
    startTimeRef.current = Date.now();
  }, [stopTimer]);

  // Global countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [gameState, stopTimer]);

  // Watch for time running out
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      finishGame(correct, wrong, 0);
    }
  }, [timeLeft, gameState, correct, wrong, finishGame]);

  const handleSort = useCallback((selectedCategory: CategoryId) => {
    if (gameState !== 'playing') return;

    const currentItem = items[currentIndex];
    const isCorrect = currentItem.categoryId === selectedCategory;

    const newCorrect = isCorrect ? correct + 1 : correct;
    const newWrong = isCorrect ? wrong : wrong + 1;

    if (isCorrect) {
      setCorrect(newCorrect);
      setLastFeedback('correct');
    } else {
      setWrong(newWrong);
      setLastFeedback('wrong');
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= items.length) {
      // All 100 items sorted
      finishGame(newCorrect, newWrong, timeLeft);
      return;
    }

    setGameState('feedback');

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setLastFeedback(null);
      setGameState('playing');
    }, 300);
  }, [gameState, items, currentIndex, correct, wrong, timeLeft, finishGame]);

  return {
    items,
    currentIndex,
    currentItem: items[currentIndex],
    correct,
    wrong,
    score: correct * 10,
    timeLeft,
    totalTime: TOTAL_SECONDS,
    gameState,
    lastFeedback,
    startGame,
    handleSort,
    totalItems: items.length,
  };
}
