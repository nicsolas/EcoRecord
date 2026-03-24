import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/use-game';
import { CATEGORIES, CategoryId } from '@/lib/trash-data';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BIN_STYLES: Record<CategoryId, { bg: string; border: string; text: string }> = {
  organico:       { bg: 'bg-[#5a8a3c]', border: 'border-[#3d6029]', text: 'text-white' },
  vetro:          { bg: 'bg-[#2d7a4a]', border: 'border-[#1a5533]', text: 'text-white' },
  carta:          { bg: 'bg-[#2563eb]', border: 'border-[#1a47b3]', text: 'text-white' },
  multimateriale: { bg: 'bg-[#d97706]', border: 'border-[#b45309]', text: 'text-white' },
  indifferenziato:{ bg: 'bg-[#4b5563]', border: 'border-[#374151]', text: 'text-white' },
  raee:           { bg: 'bg-[#7c3aed]', border: 'border-[#5b21b6]', text: 'text-white' },
};

export default function Game() {
  const [, setLocation] = useLocation();
  const [imgError, setImgError] = useState(false);
  const {
    currentItem,
    currentIndex,
    correct,
    wrong,
    timeLeft,
    totalTime,
    gameState,
    lastFeedback,
    startGame,
    handleSort,
    totalItems,
  } = useGame();

  useEffect(() => {
    const fName = sessionStorage.getItem('ecosort_firstName');
    if (!fName) { setLocation('/'); return; }
    startGame();
  }, [startGame, setLocation]);

  useEffect(() => {
    setImgError(false);
  }, [currentIndex]);

  if (gameState === 'idle' || !currentItem) {
    return <div className="flex-1 flex items-center justify-center text-xl font-bold text-muted-foreground">Caricamento...</div>;
  }

  const timePct = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 8;
  const sorted = currentIndex;

  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 pt-4 pb-6 gap-4">

      {/* Top HUD */}
      <div className="grid grid-cols-3 gap-3">
        {/* Corretti */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex flex-col items-center">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Corretti</span>
          <span className="text-3xl font-black text-green-600">{correct}</span>
        </div>

        {/* Timer — centrale, prominente */}
        <div className={cn(
          "rounded-2xl p-3 flex flex-col items-center border-2 transition-all",
          isUrgent ? "bg-red-50 border-red-400 animate-pulse" : "bg-card border-border"
        )}>
          <span className={cn("text-xs font-bold uppercase tracking-wide", isUrgent ? "text-red-600" : "text-muted-foreground")}>
            ⏱ Tempo
          </span>
          <span className={cn("text-4xl font-black tabular-nums", isUrgent ? "text-red-600" : "text-foreground")}>
            {timeLeft}s
          </span>
        </div>

        {/* Oggetti smistati */}
        <div className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Smistati</span>
          <span className="text-3xl font-black text-foreground">{sorted}<span className="text-base font-normal text-muted-foreground">/120</span></span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-3 bg-border/40 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full transition-colors", isUrgent ? "bg-red-500" : "bg-primary")}
          animate={{ width: `${timePct}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>

      {/* Item Display */}
      <div className="flex-1 flex items-center justify-center min-h-[200px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentItem.id + lastFeedback}
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: lastFeedback === 'wrong' ? [0, -6, 6, -4, 0] : 0,
            }}
            exit={{ scale: 0.6, opacity: 0, y: -30 }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Item card */}
            <div className={cn(
              "relative w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] shadow-2xl border-4 flex items-center justify-center overflow-hidden bg-white",
              lastFeedback === 'correct' ? "border-green-500 shadow-green-300/60" :
              lastFeedback === 'wrong'   ? "border-red-500 shadow-red-300/60" :
              "border-white shadow-black/15"
            )}>
              {!imgError && currentItem.image ? (
                <img
                  src={`${import.meta.env.BASE_URL}trash/${currentItem.image}`}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-8xl select-none">{currentItem.emoji}</span>
              )}

              {/* Feedback overlay */}
              <AnimatePresence>
                {lastFeedback === 'correct' && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-500/20"
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-600 drop-shadow-xl" />
                  </motion.div>
                )}
                {lastFeedback === 'wrong' && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/20"
                  >
                    <XCircle className="w-20 h-20 text-red-600 drop-shadow-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Item name */}
            <div className="px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-xl shadow-lg">
              {currentItem.name}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bins — mobile: 3+3, desktop: tutti in riga */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {categoryIds.map((catId) => {
          const cat = CATEGORIES[catId];
          const style = BIN_STYLES[catId];
          return (
            <motion.button
              key={catId}
              disabled={gameState !== 'playing'}
              onClick={() => handleSort(catId)}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.04 }}
              className={cn(
                "flex flex-col items-center justify-end pb-3 pt-2 px-1 rounded-3xl h-24 md:h-36",
                "border-b-8 transition-all duration-100 cursor-pointer select-none",
                style.bg, style.border, style.text,
                gameState !== 'playing' && "opacity-70 pointer-events-none"
              )}
            >
              <span className="text-2xl md:text-4xl mb-1">🗑️</span>
              <span className="font-bold text-[9px] md:text-xs text-center leading-tight uppercase tracking-wide px-1">
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
