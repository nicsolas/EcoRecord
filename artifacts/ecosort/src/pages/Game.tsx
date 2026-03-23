import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/use-game';
import { CATEGORIES } from '@/lib/trash-data';
import { Timer, Trophy, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    currentItem, 
    currentIndex, 
    score, 
    timeLeft, 
    gameState, 
    lastFeedback, 
    startGame, 
    handleSort,
    initialTime
  } = useGame();

  useEffect(() => {
    const fName = sessionStorage.getItem('ecosort_firstName');
    if (!fName) {
      setLocation('/');
      return;
    }
    startGame();
  }, [startGame, setLocation]);

  if (gameState === 'idle' || !currentItem) {
    return <div className="flex-1 flex items-center justify-center">Caricamento...</div>;
  }

  const progressPct = (timeLeft / initialTime) * 100;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border/50 mb-8">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <span>Oggetto</span>
          <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded-md font-display">{currentIndex + 1}/10</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-display text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
        
        <AnimatePresence mode="popLayout">
          {gameState !== 'finished' && (
            <motion.div
              key={currentItem.id + gameState}
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1,
                y: gameState === 'feedback' && lastFeedback === 'correct' ? -100 : 0,
                x: gameState === 'feedback' && lastFeedback === 'wrong' ? [0, -10, 10, -10, 0] : 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
              className="flex flex-col items-center justify-center z-10"
            >
              <div className={cn(
                "w-48 h-48 md:w-56 md:h-56 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-8xl md:text-9xl border-8 relative",
                gameState === 'feedback' && lastFeedback === 'correct' ? "border-green-500 shadow-green-500/50" :
                gameState === 'feedback' && (lastFeedback === 'wrong' || lastFeedback === 'timeout') ? "border-red-500 shadow-red-500/50" :
                "border-primary/20 shadow-primary/10"
              )}>
                {currentItem.emoji}
                
                {/* Feedback Overlays */}
                {gameState === 'feedback' && lastFeedback === 'correct' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-white rounded-full">
                    <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-md" />
                  </motion.div>
                )}
                {gameState === 'feedback' && lastFeedback === 'wrong' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-white rounded-full">
                    <XCircle className="w-16 h-16 text-red-500 drop-shadow-md" />
                  </motion.div>
                )}
                {gameState === 'feedback' && lastFeedback === 'timeout' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-6 -right-6 bg-white rounded-full">
                    <Clock className="w-16 h-16 text-red-500 drop-shadow-md" />
                  </motion.div>
                )}
              </div>
              
              <motion.div 
                className="mt-6 px-6 py-2 bg-foreground text-background rounded-full font-display text-2xl shadow-lg"
                layoutId="itemName"
              >
                {currentItem.name}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Timer Bar */}
      <div className="my-8 px-4 w-full max-w-lg mx-auto">
        <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2">
          <span>Tempo</span>
          <span>{timeLeft}s</span>
        </div>
        <div className="h-4 bg-border/50 rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full", timeLeft <= 3 ? "bg-red-500" : "bg-primary")}
            initial={{ width: '100%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Bins / Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mt-auto">
        {Object.values(CATEGORIES).map((cat) => (
          <button
            key={cat.id}
            disabled={gameState !== 'playing'}
            onClick={() => handleSort(cat.id as CategoryId)}
            className={cn(
              "relative group flex flex-col items-center justify-center p-4 rounded-3xl h-32 md:h-40 transition-all duration-200",
              "border-b-8 active:border-b-0 active:translate-y-2",
              cat.colorClass,
              gameState !== 'playing' && "opacity-80 cursor-not-allowed transform-none"
            )}
            style={{ borderColor: 'rgba(0,0,0,0.2)' }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-full mb-2 flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>
            <span className="font-display font-bold text-sm md:text-base tracking-wide text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
