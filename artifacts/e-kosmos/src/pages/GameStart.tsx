import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Play, Leaf, Trophy } from 'lucide-react';
import { useGetLeaderboard } from '@workspace/api-client-react';
import { cn } from '@/lib/utils';

export default function GameStart() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const leaderboardParams = useMemo(() => ({ limit: 3 }), []);
  const { data: leaderboard } = useGetLeaderboard(leaderboardParams);

  // Pre-fill if exists
  useEffect(() => {
    const u = sessionStorage.getItem('ekosmos_username');
    const e = sessionStorage.getItem('ekosmos_email');
    if (u) setUsername(u);
    if (e) setEmail(e);
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    
    sessionStorage.setItem('ekosmos_username', username.trim());
    sessionStorage.setItem('ekosmos_email', email.trim());
    sessionStorage.setItem('ekosmos_gameName', 'E-kosmos Challenge');
    setLocation('/play');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 relative">
      
      {/* Decorative background blurs matching the Game page */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 md:mt-16">
        
        {/* Left Column: Hero & Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 text-primary font-bold text-sm mb-4 shadow-sm">
              <Leaf className="w-4 h-4" />
              <span>Salva il pianeta, un rifiuto alla volta</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground leading-tight tracking-tight">
              Diventa il <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 relative inline-block">Campione</span> del Riciclo!
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Hai <strong>30 secondi</strong> per smistare più oggetti possibili tra i 120 disponibili. Più ne smisti correttamente, più punti guadagni!
            </p>
          </div>

          <form onSubmit={handleStart} className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-primary/10 border border-white/60 flex flex-col gap-5 relative overflow-hidden group">
            {/* Shimmer on form hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none z-0"></div>
            
            <h3 className="font-display text-2xl font-bold relative z-10">Inserisci i tuoi dati</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="EcoGamer"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-inner font-medium text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mario@example.com"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all shadow-inner font-medium text-lg"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="mt-4 group/btn relative w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-primary to-emerald-600 text-white rounded-2xl font-display font-black text-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 active:scale-95 border border-primary/20 relative z-10"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 drop-shadow-md">Inizia a Giocare</span>
              <Play className="w-6 h-6 fill-current relative z-10 drop-shadow-md" />
            </button>
            <p className="text-xs text-slate-500 font-medium text-center px-2 mt-2 relative z-10">
              *se lo username sarà ritenuto offensivo dal sistema il punteggio non potrà essere salvato
            </p>
          </form>
        </motion.div>

        {/* Right Column: Visuals & Mini Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-8 items-center lg:items-end"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-eco.png`} 
              alt="E-kosmos Park" 
              className="relative w-full max-w-[28rem] rounded-[3rem] shadow-2xl shadow-black/10 -rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 border-8 border-white/50 backdrop-blur-sm"
            />
          </div>

          {Array.isArray(leaderboard) && leaderboard.length > 0 && (
            <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-black/5 border border-white/60">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-xl">
                    <Trophy className="text-secondary w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-xl text-slate-800">Top Cittadini</h3>
                </div>
                <Link href="/leaderboard" className="text-sm text-primary font-bold hover:underline px-3 py-1.5 bg-primary/10 rounded-full transition-colors hover:bg-primary/20">Vedi tutti</Link>
              </div>
              
              <div className="flex flex-col gap-3">
                {leaderboard.map((player, i) => (
                  <div key={player.id} className="group/item flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-inner",
                        i === 0 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300/50' : 
                        i === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-300/50' : 
                        'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-800 border border-orange-300/50'
                      )}>
                        #{i + 1}
                      </span>
                      <span className="font-bold text-slate-700 text-lg truncate max-w-[150px] group-hover/item:text-primary transition-colors">
                        {player.username}
                      </span>
                    </div>
                    <span className="font-display font-black text-xl text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                      {player.score} pt
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
