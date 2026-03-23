import { useState, useCallback, useEffect } from 'react';
import { getRandomItems, TrashItem, CategoryId } from '@/lib/trash-data';
import { useLocation } from 'wouter';
import { useGetGameConfig } from '@workspace/api-client-react';

export function useGame() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  
  const [, setLocation] = useLocation();
  const { data: config } = useGetGameConfig();

  const pointsPerAnswer = config?.pointsPerCorrectAnswer || 10;
  const initialTime = config?.timePerItem || 10;

  const startGame = useCallback(() => {
    setItems(getRandomItems(10));
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(initialTime);
    setGameState('playing');
    setLastFeedback(null);
  }, [initialTime]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 9) {
      setGameState('finished');
      sessionStorage.setItem('ecosort_last_score', score.toString());
      setTimeout(() => setLocation('/results'), 1000);
    } else {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(initialTime);
      setGameState('playing');
      setLastFeedback(null);
    }
  }, [currentIndex, score, initialTime, setLocation]);

  const handleSort = useCallback((selectedCategory: CategoryId) => {
    if (gameState !== 'playing') return;
    
    const currentItem = items[currentIndex];
    const isCorrect = currentItem.categoryId === selectedCategory;
    
    if (isCorrect) {
      setScore(prev => prev + pointsPerAnswer);
      setLastFeedback('correct');
    } else {
      setLastFeedback('wrong');
    }
    
    setGameState('feedback');
    setTimeout(handleNext, 800);
  }, [gameState, items, currentIndex, pointsPerAnswer, handleNext]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 0) {
      setLastFeedback('timeout');
      setGameState('feedback');
      setTimeout(handleNext, 800);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, handleNext]);

  return {
    items,
    currentIndex,
    currentItem: items[currentIndex],
    score,
    timeLeft,
    gameState,
    lastFeedback,
    startGame,
    handleSort,
    initialTime
  };
}
