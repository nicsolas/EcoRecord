import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Save, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useSubmitScore } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

export default function Results() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [total, setTotal] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: submitScore, isPending } = useSubmitScore();

  useEffect(() => {
    const s = sessionStorage.getItem('ecosort_last_score');
    const c = sessionStorage.getItem('ecosort_last_correct');
    const w = sessionStorage.getItem('ecosort_last_wrong');
    const t = sessionStorage.getItem('ecosort_last_total');
    const f = sessionStorage.getItem('ecosort_firstName');
    const l = sessionStorage.getItem('ecosort_lastName');

    if (!s || !f || !l) { setLocation('/'); return; }

    const sc = parseInt(s, 10);
    setScore(sc);
    setCorrect(parseInt(c || '0', 10));
    setWrong(parseInt(w || '0', 10));
    setTotal(parseInt(t || '0', 10));
    setFirstName(f);
    setLastName(l);

    if (sc >= 300) {
      const duration = 4000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#22c55e', '#eab308', '#3b82f6'] });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#22c55e', '#eab308', '#3b82f6'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [setLocation]);

  const handleSaveScore = () => {
    submitScore(
      { data: { firstName, lastName, score } },
      {
        onSuccess: () => {
          setIsSaved(true);
          toast({ title: '🏆 Punteggio Salvato!', description: 'Controlla la classifica!' });
        },
        onError: () => {
          toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile salvare il punteggio.' });
        }
      }
    );
  };

  const getMessage = () => {
    const pct = total > 0 ? (correct / total) * 100 : 0;
    if (total >= 80 && pct >= 90) return '🏆 Leggenda del riciclo! Inarrestabile!';
    if (total >= 60 && pct >= 80) return '🌿 Campione del riciclo! Ottimo lavoro!';
    if (total >= 40 && pct >= 70) return '🌱 Bravissimo! Hai smistato velocemente!';
    if (total >= 20)              return '⚡ Buona partenza, allena la velocità!';
    return '🍂 Riprova, puoi fare molto meglio!';
  };

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="max-w-md w-full bg-card p-8 rounded-[2rem] shadow-2xl border border-border/50 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-primary/20 to-transparent -z-10" />

        <div className="w-24 h-24 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-secondary/30">
          <Trophy className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-display font-bold mb-1">Tempo scaduto!</h1>
        <p className="text-muted-foreground text-lg mb-6">Ottimo tentativo, {firstName}!</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-3xl font-black text-green-600">{correct}</div>
            <div className="text-xs font-bold text-green-700 uppercase">Corretti</div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <Zap className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-3xl font-black text-primary">{total}</div>
            <div className="text-xs font-bold text-primary/70 uppercase">Smistati</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <div className="text-3xl font-black text-red-500">{wrong}</div>
            <div className="text-xs font-bold text-red-600 uppercase">Errori</div>
          </div>
        </div>

        {/* Score + accuracy */}
        <div className="bg-primary/5 rounded-3xl p-6 mb-6 border border-primary/10">
          <div className="text-6xl font-display font-black text-primary mb-1 drop-shadow-sm">
            {score} pt
          </div>
          <div className="text-sm font-semibold text-muted-foreground mb-2">
            Precisione: {accuracy}% · {total} oggetti in 30 secondi
          </div>
          <p className="font-semibold text-foreground/80 text-sm">{getMessage()}</p>
        </div>

        <div className="flex flex-col gap-3">
          {!isSaved ? (
            <button
              onClick={handleSaveScore}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {isPending ? 'Salvataggio...' : <><Save className="w-5 h-5" /> Salva in Classifica</>}
            </button>
          ) : (
            <Link href="/leaderboard" className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-1 transition-all">
              <Trophy className="w-5 h-5" /> Vai alla Classifica
            </Link>
          )}
          <Link href="/play" className="w-full flex items-center justify-center gap-2 bg-background border-2 border-border text-foreground py-4 rounded-xl font-bold text-lg hover:bg-muted transition-colors">
            <RefreshCw className="w-5 h-5" /> Rigioca
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
