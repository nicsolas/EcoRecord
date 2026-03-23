import { useGetLeaderboard } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function Leaderboard() {
  const { data: scores, isLoading, error } = useGetLeaderboard({ limit: 50 });

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8">
      
      <div className="flex items-center gap-4 mb-8 mt-4">
        <Link href="/" className="p-3 bg-card rounded-full hover:bg-muted border border-border transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-secondary" />
            Classifica Globale
          </h1>
          <p className="text-muted-foreground mt-1">I cittadini più virtuosi. Il vincitore sarà premiato al termine del countdown!</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center text-lg text-muted-foreground font-semibold">
          Caricamento classifica... 🌍
        </div>
      )}

      {error && (
        <div className="p-6 bg-destructive/10 text-destructive rounded-2xl text-center font-semibold">
          Impossibile caricare la classifica. Riprova più tardi.
        </div>
      )}

      {scores && scores.length === 0 && (
        <div className="text-center p-12 bg-card rounded-3xl border border-border">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-bold">Nessun punteggio ancora!</h3>
          <p className="text-muted-foreground mt-2">Sii il primo a giocare e conquista la vetta!</p>
        </div>
      )}

      {scores && scores.length > 0 && (
        <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold w-20 text-center">Pos</th>
                  <th className="p-4 font-bold">Cittadino</th>
                  <th className="p-4 font-bold text-center">Miglior Punteggio</th>
                  <th className="p-4 font-bold text-center hidden sm:table-cell">Partite</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={score.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 text-center">
                      {index === 0 ? <Medal className="w-8 h-8 text-yellow-500 mx-auto" /> :
                       index === 1 ? <Medal className="w-8 h-8 text-gray-400 mx-auto" /> :
                       index === 2 ? <Medal className="w-8 h-8 text-orange-600 mx-auto" /> :
                       <span className="font-bold text-muted-foreground text-lg">#{index + 1}</span>}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-foreground text-lg">
                        {score.firstName} {score.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground md:hidden mt-1">
                        Partite giocate: {score.gamesPlayed}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-display font-bold text-xl rounded-full">
                        {score.bestScore} <Star className="w-4 h-4 fill-current" />
                      </span>
                    </td>
                    <td className="p-4 text-center hidden sm:table-cell text-muted-foreground font-semibold">
                      {score.gamesPlayed}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
