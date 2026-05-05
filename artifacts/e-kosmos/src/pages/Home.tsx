import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Recycle, ArrowRight, X, Leaf, Wine, FileText, Package, Trash2, Cpu, Camera } from 'lucide-react';

interface BinInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  examples: string[];
  notAllowed: string[];
}

const BINS: BinInfo[] = [
  {
    id: 'organico',
    name: 'Organico',
    icon: Leaf,
    color: '#5a8a3c',
    description: 'Raccoglie scarti di cibo e materiali di origine naturale. Vengono trasformati in compost, un fertilizzante per il terreno.',
    examples: ['Bucce di frutta e verdura', 'Avanzi di cibo', 'Fondi di caffè e tè', 'Gusci d\'uovo', 'Fiori appassite', 'Pane raffermo'],
    notAllowed: ['Olio da cucina', 'Ossa grandi', 'Gusci di cozze'],
  },
  {
    id: 'vetro',
    name: 'Vetro',
    icon: Wine,
    color: '#2d7a4a',
    description: 'Il vetro è riciclabile al 100% infinite volte. Sciacqua i contenitori e rimuovi i tappi prima di conferirli.',
    examples: ['Bottiglie di vino e birra', 'Barattoli di marmellata', 'Bottiglie d\'acqua in vetro', 'Flaconi di profumo', 'Vasetti di salsa'],
    notAllowed: ['Specchi', 'Ceramica', 'Lampadine', 'Vetro pirex'],
  },
  {
    id: 'carta',
    name: 'Carta',
    icon: FileText,
    color: '#2563eb',
    description: 'Carta e cartone si riciclano per creare nuova carta. Appiattisci le scatole e assicurati che non siano sporche di cibo.',
    examples: ['Giornali e riviste', 'Scatole di cartone', 'Sacchetti di carta', 'Quaderni e libri', 'Cartoni delle uova'],
    notAllowed: ['Carta plastificata', 'Scontrini termici', 'Carta da forno'],
  },
  {
    id: 'multimateriale',
    name: 'Multi-mat.',
    icon: Package,
    color: '#d97706',
    description: 'Plastica, alluminio e materiali misti. Schiaccia le bottiglie e sciacqua brevemente i contenitori.',
    examples: ['Bottiglie di plastica', 'Lattine di alluminio', 'Tetrapak', 'Sacchetti di plastica', 'Flaconi detersivo'],
    notAllowed: ['Giocattoli di plastica', 'Tubi da giardino', 'Plastica dura'],
  },
  {
    id: 'indifferenziato',
    name: 'Indiff.',
    icon: Trash2,
    color: '#4b5563',
    description: 'L\'ultimo ricorso: ciò che non può essere riciclato. L\'obiettivo è ridurre al minimo questa frazione.',
    examples: ['Mozziconi di sigaretta', 'Pannolini', 'Spazzolini', 'Gomme da masticare', 'Cotton fioc', 'Scontrini'],
    notAllowed: ['Batterie', 'Farmaci scaduti', 'Elettronica', 'Olio esausto'],
  },
  {
    id: 'raee',
    name: 'RAEE',
    icon: Cpu,
    color: '#7c3aed',
    description: 'Rifiuti elettrici ed elettronici: vanno nei centri di raccolta. Contengono materiali preziosi e sostanze pericolose.',
    examples: ['Smartphone rotti', 'Pile scariche', 'Caricabatterie', 'Lampadine LED', 'Elettrodomestici rotti', 'Cavi e cuffie'],
    notAllowed: ['Lampadine a incandescenza', 'Batterie per auto'],
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = BINS.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 min-h-full">
      <div className="w-full max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 md:mt-10 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Recycle className="w-4 h-4" />
            <span>Guida al Riciclo</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-tight">
            Impara a separare <br className="hidden sm:block" />
            <span className="text-primary relative inline-block mt-2">
              i rifiuti correttamente
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-primary/20 rounded-full -z-10" />
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Esplora le categorie per scoprire le istruzioni dettagliate su cosa conferire e cosa evitare per un riciclo perfetto.
          </p>
        </motion.div>

        {/* ── Bin icons row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4"
        >
          {BINS.map((bin) => {
            const isActive = selectedId === bin.id;
            const Icon = bin.icon;
            
            return (
              <motion.button
                key={bin.id}
                onClick={() => setSelectedId(isActive ? null : bin.id)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex flex-col items-center justify-center p-4 h-32 rounded-2xl border transition-all duration-300 outline-none ${
                  isActive 
                    ? 'bg-card shadow-lg z-10' 
                    : 'bg-card/50 hover:bg-card border-border hover:border-muted-foreground/30 hover:shadow-md'
                }`}
                style={{
                  borderColor: isActive ? bin.color : undefined,
                  boxShadow: isActive ? `0 10px 25px -5px ${bin.color}40` : undefined,
                }}
              >
                <div 
                  className="p-3 rounded-xl mb-3 transition-colors duration-300 bg-secondary"
                  style={{ 
                    backgroundColor: isActive ? `${bin.color}15` : undefined,
                    color: isActive ? bin.color : 'hsl(var(--muted-foreground))'
                  }}
                >
                  <Icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className="text-sm font-semibold transition-colors"
                  style={{ color: isActive ? bin.color : 'hsl(var(--foreground))' }}
                >
                  {bin.name}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
                    style={{ backgroundColor: bin.color }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Detail panel ── */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="mt-6 overflow-hidden"
            >
              <div 
                className="bg-card rounded-3xl border shadow-xl overflow-hidden flex flex-col md:flex-row relative"
                style={{ borderColor: `${selected.color}30` }}
              >
                {/* Left/Top Info Sidebar */}
                <div 
                  className="p-6 md:p-8 md:w-1/3 flex flex-col relative"
                  style={{ background: `linear-gradient(145deg, ${selected.color}10, ${selected.color}05)` }}
                >
                  {/* Decorative accent line */}
                  <div 
                    className="absolute top-0 left-0 w-full h-1 md:w-1.5 md:h-full"
                    style={{ backgroundColor: selected.color }}
                  />
                  
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="p-3.5 rounded-2xl bg-background shadow-sm"
                      style={{ color: selected.color }}
                    >
                      <selected.icon className="w-7 h-7" />
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="md:hidden p-2 rounded-full hover:bg-black/5 text-muted-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h2 
                    className="font-display text-3xl font-bold mb-3"
                    style={{ color: selected.color }}
                  >
                    {selected.id === 'carta'
                      ? 'Carta e Cartone'
                      : selected.id === 'multimateriale'
                      ? 'Multi-materiale'
                      : selected.name}
                  </h2>
                  <p className="text-foreground/80 leading-relaxed text-sm md:text-base font-medium">
                    {selected.description}
                  </p>
                </div>

                {/* Right/Bottom Lists */}
                <div className="p-6 md:p-8 md:w-2/3 bg-card grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="hidden md:flex absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div>
                    <h4 
                      className="flex items-center gap-2.5 font-bold text-sm uppercase tracking-wide mb-4"
                      style={{ color: selected.color }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${selected.color}20` }}>
                        <Leaf className="w-3.5 h-3.5" style={{ color: selected.color }} />
                      </div>
                      Cosa va qui
                    </h4>
                    <ul className="space-y-3">
                      {selected.examples.map((ex) => (
                        <li key={ex} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 font-medium">
                          <span 
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selected.color }}
                          />
                          <span className="leading-tight">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10">
                    <h4 className="flex items-center gap-2.5 font-bold text-sm uppercase tracking-wide mb-4 text-destructive">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-destructive" strokeWidth={3} />
                      </div>
                      Cosa NON va qui
                    </h4>
                    <ul className="space-y-3">
                      {selected.notAllowed.map((na) => (
                        <li key={na} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 font-medium">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                          <span className="leading-tight">{na}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 mb-8 text-center"
        >
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-border to-transparent mb-10" />
          
          <h3 className="text-2xl font-display font-bold text-foreground mb-3">
            Gioca o Scansiona! 🎮📸
          </h3>
          <p className="text-muted-foreground mb-8 max-lg mx-auto font-medium text-balance text-lg">
            Mettiti alla prova con il nostro minigioco, oppure usa il nostro <strong className="text-primary">Eco-Scanner AI</strong> per farti aiutare dall'intelligenza artificiale a riconoscere i rifiuti all'istante!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gioca">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-display font-bold text-xl overflow-hidden shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Gamepad2 className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Inizia il Gioco</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="/scan">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-background text-foreground border-2 border-primary/30 rounded-2xl font-display font-bold text-xl overflow-hidden shadow-lg shadow-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/60 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Camera className="w-6 h-6 relative z-10 text-primary" />
                <span className="relative z-10">Eco-Scanner AI</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
