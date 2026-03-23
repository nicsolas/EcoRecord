import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Save, ArrowRight } from 'lucide-react';
import { useSubmitScore } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

export default function Results() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [score, setScore] = useState<number>(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: submitScore, isPending } = useSubmitScore();

  useEffect(() => {
    const s = sessionStorage.getItem('ecosort_last_score');
    const f = sessionStorage.getItem('ecosort_firstName');
    const l = sessionStorage.getItem('ecosort_lastName');

    if (!s || !f || !l) {
      setLocation('/');
      return;
    }

    setScore(parseInt(s, 10));
    setFirstName(f);
    setLastName(l);

    // Celebration!
    if (parseInt(s, 10) > 50) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#eab308', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#eab308', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
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
          toast({
            title: "Punteggio Salvato!",
            description: "Ottimo lavoro, controlla la classifica.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Errore",
            description: "Impossibile salvare il punteggio.",
          });
        }
      }
    );
  };

  const getMessage = () => {
    if (score === 100) return "Perfetto! Sei un maestro del riciclo! 👑";
    if (score >= 70) return "Bravissimo! La natura ti ringrazia! 🌿";
    if (score >= 40) return "Buon lavoro, ma puoi fare di meglio! 🌱";
    return "Ops! Serve più pratica con la raccolta differenziata! 🍂";
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-card p-8 rounded-[2rem] shadow-2xl border border-border/50 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/20 to-transparent -z-10" />

        <div className="w-24 h-24 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary/30">
          <Trophy className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-display font-bold text-foreground mb-2">Game Over!</h1>
        <p className="text-xl font-medium text-muted-foreground mb-8">
          Ciao {firstName}, ecco il tuo risultato
        </p>

        <div className="bg-primary/5 rounded-3xl p-8 mb-8 border border-primary/10">
          <div className="text-7xl font-display font-bold text-primary mb-4 drop-shadow-sm">
            {score}
          </div>
          <p className="font-semibold text-foreground/80">{getMessage()}</p>
        </div>

        <div className="flex flex-col gap-4">
          {!isSaved ? (
            <button
              onClick={handleSaveScore}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Salvataggio...' : (
                <>
                  <Save className="w-5 h-5" />
                  Salva in Classifica
                </>
              )}
            </button>
          ) : (
            <Link href="/leaderboard" className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-1 transition-all">
              <Trophy className="w-5 h-5" />
              Vai alla Classifica
            </Link>
          )}

          <Link href="/play" className="w-full flex items-center justify-center gap-2 bg-background border-2 border-border text-foreground py-4 rounded-xl font-bold text-lg hover:bg-muted transition-colors">
            <RefreshCw className="w-5 h-5" />
            Gioca di Nuovo
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
