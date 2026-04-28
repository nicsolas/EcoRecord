import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/hooks/use-game';
import { CATEGORIES, CategoryId } from '@/lib/trash-data';
import { CheckCircle2, XCircle, Timer, Award, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Premium glossy gradients and shadows for the bins
const BIN_STYLES: Record<CategoryId, { gradient: string; shadow: string; border: string; text: string; icon: string }> = {
  organico:       { gradient: 'from-lime-500 to-lime-700', shadow: 'shadow-lime-900', border: 'border-lime-800', text: 'text-white', icon: '🍎' },
  vetro:          { gradient: 'from-emerald-500 to-emerald-700', shadow: 'shadow-emerald-900', border: 'border-emerald-800', text: 'text-white', icon: '🍾' },
  carta:          { gradient: 'from-blue-500 to-blue-700', shadow: 'shadow-blue-900', border: 'border-blue-800', text: 'text-white', icon: '📄' },
  multimateriale: { gradient: 'from-amber-400 to-amber-600', shadow: 'shadow-amber-900', border: 'border-amber-800', text: 'text-white', icon: '🥫' },
  indifferenziato:{ gradient: 'from-gray-500 to-gray-700', shadow: 'shadow-gray-900', border: 'border-gray-800', text: 'text-white', icon: '🗑️' },
  raee:           { gradient: 'from-violet-500 to-violet-700', shadow: 'shadow-violet-900', border: 'border-violet-800', text: 'text-white', icon: '🔋' },
};

export default function Game() {
  const [, setLocation] = useLocation();
  const [imgError, setImgError] = useState(false);
  const {
    currentItem,
    currentIndex,
    correct,
    timeLeft,
    totalTime,
    gameState,
    lastFeedback,
    startGame,
    handleSort,
  } = useGame();

  useEffect(() => {
    const username = sessionStorage.getItem('ekosmos_username');
    if (!username) { setLocation('/'); return; }
    startGame();
  }, [startGame, setLocation]);

  useEffect(() => {
    setImgError(false);
  }, [currentIndex]);

  if (gameState === 'idle' || !currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-primary">
        <Recycle className="w-16 h-16 animate-spin-slow" />
        <h2 className="text-2xl font-display font-bold">Preparazione area di riciclo...</h2>
      </div>
    );
  }

  const timePct = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 8;
  const sorted = currentIndex;

  const categoryIds = Object.keys(CATEGORIES) as CategoryId[];

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6 gap-6 relative">
      
      {/* Decorative background blurs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top HUD - Glassmorphic Panels */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        
        {/* Punteggio / Corretti */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl shadow-black/5 rounded-3xl p-3 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10"><Award className="w-12 h-12" /></div>
          <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Punteggio</span>
          <span className="text-3xl md:text-4xl font-black text-emerald-600 drop-shadow-sm">{correct}</span>
        </motion.div>

        {/* Timer - Centro, molto prominente */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "rounded-3xl p-3 flex flex-col items-center justify-center border-2 transition-all shadow-xl relative overflow-hidden",
            isUrgent 
              ? "bg-red-500/10 border-red-500 text-red-600 shadow-red-500/20 animate-pulse" 
              : "bg-white/80 backdrop-blur-md border-primary/20 text-foreground shadow-primary/5"
          )}
        >
          <div className="absolute top-0 left-0 p-2 opacity-10"><Timer className="w-16 h-16" /></div>
          <span className={cn("text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1", isUrgent ? "text-red-600" : "text-muted-foreground")}>
            Tempo Rimasto
          </span>
          <span className={cn("text-4xl md:text-5xl font-black tabular-nums tracking-tight", isUrgent && "drop-shadow-md")}>
            {timeLeft}s
          </span>
        </motion.div>

        {/* Smistati */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 shadow-xl shadow-black/5 rounded-3xl p-3 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10"><Recycle className="w-12 h-12" /></div>
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-1">Smistati</span>
          <span className="text-3xl md:text-4xl font-black text-primary drop-shadow-sm">{sorted}<span className="text-lg md:text-xl font-normal text-primary/60">/120</span></span>
        </motion.div>

      </div>

      {/* Premium Timer Bar */}
      <div className="relative h-4 bg-black/5 rounded-full overflow-hidden shadow-inner border border-black/5">
        <motion.div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-colors", 
            isUrgent ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gradient-to-r from-primary to-secondary"
          )}
          animate={{ width: `${timePct}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </motion.div>
      </div>

      {/* Item Display - Più spazioso e animato */}
      <div className="flex-1 flex items-center justify-center min-h-[220px] md:min-h-[280px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentItem.id + lastFeedback}
            initial={{ scale: 0.5, opacity: 0, y: 40, rotate: -10 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: lastFeedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : [0, -2, 2, -2, 0], // Floating or shaking
            }}
            exit={{ scale: 0.4, opacity: 0, y: -60, rotate: 15 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Glossy Item card */}
            <div className={cn(
              "relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] shadow-2xl border-4 flex items-center justify-center overflow-hidden bg-white/90 backdrop-blur-xl group",
              lastFeedback === 'correct' ? "border-emerald-400 shadow-emerald-400/50" :
              lastFeedback === 'wrong'   ? "border-red-400 shadow-red-400/50" :
              "border-white shadow-primary/20"
            )}>
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none"></div>

              {!imgError && currentItem.image ? (
                <img
                  src={`${import.meta.env.BASE_URL}trash/${currentItem.image}`}
                  alt={currentItem.name}
                  className="w-full h-full object-cover mix-blend-multiply p-4 drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-8xl md:text-9xl select-none drop-shadow-xl group-hover:scale-110 transition-transform duration-500">{currentItem.emoji}</span>
              )}

              {/* Feedback overlay - Più evidente */}
              <AnimatePresence>
                {lastFeedback === 'correct' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/30 backdrop-blur-sm"
                  >
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}>
                      <CheckCircle2 className="w-24 h-24 text-white drop-shadow-lg" />
                    </motion.div>
                  </motion.div>
                )}
                {lastFeedback === 'wrong' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/30 backdrop-blur-sm"
                  >
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}>
                      <XCircle className="w-24 h-24 text-white drop-shadow-lg" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Pill Badge for Item Name */}
            <div className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full font-display font-bold text-xl md:text-2xl shadow-xl border border-slate-700/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {currentItem.name}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3D Glass Bins - mobile: 3x2, desktop: 6 in riga */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mt-auto">
        {categoryIds.map((catId, idx) => {
          const cat = CATEGORIES[catId];
          const style = BIN_STYLES[catId];
          return (
            <motion.button
              key={catId}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring' }}
              disabled={gameState !== 'playing'}
              onClick={() => handleSort(catId)}
              whileTap={{ scale: 0.90, y: 4 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={cn(
                "group relative flex flex-col items-center justify-center p-3 rounded-[2rem] h-28 md:h-40 overflow-hidden",
                "border-b-8 transition-all duration-200 cursor-pointer select-none",
                "bg-gradient-to-b", style.gradient, style.border, style.shadow, style.text,
                gameState !== 'playing' && "opacity-50 grayscale pointer-events-none"
              )}
            >
              {/* Glossy top reflection */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-[2rem] pointer-events-none"></div>
              
              <span className="text-3xl md:text-5xl mb-2 drop-shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10">
                {style.icon}
              </span>
              <span className="font-display font-bold text-[10px] md:text-sm text-center leading-tight uppercase tracking-widest relative z-10 drop-shadow-sm px-1">
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
