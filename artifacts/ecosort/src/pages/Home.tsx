import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Play, Leaf, Trophy } from 'lucide-react';
import { useGetLeaderboard } from '@workspace/api-client-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { data: leaderboard } = useGetLeaderboard({ limit: 3 });

  // Pre-fill if exists
  useEffect(() => {
    const f = sessionStorage.getItem('ecosort_firstName');
    const l = sessionStorage.getItem('ecosort_lastName');
    if (f) setFirstName(f);
    if (l) setLastName(l);
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    
    sessionStorage.setItem('ecosort_firstName', firstName.trim());
    sessionStorage.setItem('ecosort_lastName', lastName.trim());
    setLocation('/play');
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 md:mt-16">
        
        {/* Left Column: Hero & Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              <Leaf className="w-4 h-4" />
              <span>Salva il pianeta, un rifiuto alla volta</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Diventa il <span className="text-primary relative inline-block">Campione<div className="absolute -bottom-2 left-0 w-full h-3 bg-secondary/50 rounded-full -z-10"></div></span> del Riciclo!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Hai <strong>30 secondi</strong> per smistare più oggetti possibili tra i 100 disponibili. Più ne smisti correttamente, più punti guadagni!
            </p>
          </div>

          <form onSubmit={handleStart} className="bg-card p-6 rounded-3xl shadow-xl shadow-primary/5 border border-border/50 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <h3 className="font-display text-xl font-semibold">Inserisci i tuoi dati per iniziare</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Nome</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Mario"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">Cognome</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Rossi"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="mt-2 group relative w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-display font-bold text-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10">Gioca Ora</span>
              <Play className="w-6 h-6 fill-current relative z-10" />
            </button>
          </form>
        </motion.div>

        {/* Right Column: Visuals & Mini Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 items-center"
        >
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-eco.png`} 
            alt="EcoSort Park" 
            className="w-full max-w-md rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
          />

          {leaderboard && leaderboard.length > 0 && (
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="text-secondary w-6 h-6" />
                  <h3 className="font-display font-bold text-lg">Top Cittadini</h3>
                </div>
                <Link href="/leaderboard" className="text-sm text-primary font-bold hover:underline">Vedi tutti</Link>
              </div>
              
              <div className="flex flex-col gap-3">
                {leaderboard.map((player, i) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        i === 1 ? 'bg-gray-200 text-gray-700' : 
                        'bg-orange-100 text-orange-700'
                      }`}>
                        #{i + 1}
                      </span>
                      <span className="font-semibold text-foreground truncate max-w-[150px]">
                        {player.firstName} {player.lastName}
                      </span>
                    </div>
                    <span className="font-display font-bold text-primary">{player.bestScore} pt</span>
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
