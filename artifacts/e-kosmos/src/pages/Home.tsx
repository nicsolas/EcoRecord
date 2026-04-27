import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Recycle, Sparkles, X } from 'lucide-react';

interface BinInfo {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  examples: string[];
  notAllowed: string[];
}

const BINS: BinInfo[] = [
  {
    id: 'organico',
    name: 'Organico',
    emoji: '🟤',
    color: '#5a8a3c',
    description: 'Raccoglie scarti di cibo e materiali di origine naturale. Vengono trasformati in compost, un fertilizzante per il terreno.',
    examples: ['Bucce di frutta e verdura', 'Avanzi di cibo', 'Fondi di caffè e tè', 'Gusci d\'uovo', 'Fiori appassite', 'Pane raffermo'],
    notAllowed: ['Olio da cucina', 'Ossa grandi', 'Gusci di cozze'],
  },
  {
    id: 'vetro',
    name: 'Vetro',
    emoji: '🟢',
    color: '#2d7a4a',
    description: 'Il vetro è riciclabile al 100% infinite volte. Sciacqua i contenitori e rimuovi i tappi prima di conferirli.',
    examples: ['Bottiglie di vino e birra', 'Barattoli di marmellata', 'Bottiglie d\'acqua in vetro', 'Flaconi di profumo', 'Vasetti di salsa'],
    notAllowed: ['Specchi', 'Ceramica', 'Lampadine', 'Vetro pirex'],
  },
  {
    id: 'carta',
    name: 'Carta',
    emoji: '🔵',
    color: '#2563eb',
    description: 'Carta e cartone si riciclano per creare nuova carta. Appiattisci le scatole e assicurati che non siano sporche di cibo.',
    examples: ['Giornali e riviste', 'Scatole di cartone', 'Sacchetti di carta', 'Quaderni e libri', 'Cartoni delle uova'],
    notAllowed: ['Carta plastificata', 'Scontrini termici', 'Carta da forno'],
  },
  {
    id: 'multimateriale',
    name: 'Multi-mat.',
    emoji: '🟡',
    color: '#d97706',
    description: 'Plastica, alluminio e materiali misti. Schiaccia le bottiglie e sciacqua brevemente i contenitori.',
    examples: ['Bottiglie di plastica', 'Lattine di alluminio', 'Tetrapak', 'Sacchetti di plastica', 'Flaconi detersivo'],
    notAllowed: ['Giocattoli di plastica', 'Tubi da giardino', 'Plastica dura'],
  },
  {
    id: 'indifferenziato',
    name: 'Indiff.',
    emoji: '⚫',
    color: '#6b7280',
    description: 'L\'ultimo ricorso: ciò che non può essere riciclato. L\'obiettivo è ridurre al minimo questa frazione.',
    examples: ['Mozziconi di sigaretta', 'Pannolini', 'Spazzolini', 'Gomme da masticare', 'Cotton fioc', 'Scontrini'],
    notAllowed: ['Batterie', 'Farmaci scaduti', 'Elettronica', 'Olio esausto'],
  },
  {
    id: 'raee',
    name: 'RAEE',
    emoji: '🔌',
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
    <div className="flex-1 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 md:mt-10 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
            <Recycle className="w-4 h-4" />
            <span>Impara la raccolta differenziata</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
            Come fare la{' '}
            <span className="text-primary relative inline-block">
              Differenziata
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-secondary/50 rounded-full -z-10" />
            </span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
            Clicca su un cassonetto per scoprire cosa si butta e cosa no!
          </p>
        </motion.div>

        {/* ── Bin icons row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-3 md:gap-5 flex-wrap"
        >
          {BINS.map((bin) => {
            const isActive = selectedId === bin.id;
            return (
              <motion.button
                key={bin.id}
                onClick={() => setSelectedId(isActive ? null : bin.id)}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2.5 group outline-none"
              >
                {/* Trash bin */}
                <div
                  className="relative cursor-pointer transition-all duration-200"
                  style={{
                    filter: isActive
                      ? `drop-shadow(0 8px 20px ${bin.color}50)`
                      : `drop-shadow(0 4px 10px ${bin.color}30)`,
                    transform: isActive ? 'translateY(-4px)' : undefined,
                  }}
                >
                  {/* Handle on lid */}
                  <div
                    className="mx-auto w-6 md:w-8 h-2.5 md:h-3 rounded-t-full"
                    style={{ backgroundColor: bin.color }}
                  />
                  {/* Lid */}
                  <div
                    className="w-18 md:w-22 h-3 md:h-3.5 rounded-t-lg"
                    style={{
                      backgroundColor: bin.color,
                      boxShadow: `inset 0 -2px 0 ${bin.color}99`,
                    }}
                  />
                  {/* Body — trapezoid via clip-path */}
                  <div
                    className="w-18 md:w-22 h-14 md:h-18 flex items-center justify-center text-2xl md:text-3xl rounded-b-lg"
                    style={{
                      backgroundColor: isActive ? bin.color : bin.color + 'dd',
                      clipPath: 'polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)',
                    }}
                  >
                    <span className="drop-shadow-md select-none">{bin.emoji}</span>
                  </div>

                  {/* Active glow ring */}
                  {isActive && (
                    <motion.div
                      layoutId="bin-dot"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: bin.color }}
                    />
                  )}
                </div>
                <span
                  className="text-xs md:text-sm font-bold transition-colors"
                  style={{ color: isActive ? bin.color : '#64748b' }}
                >
                  {bin.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Detail panel ── */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
              className="mt-8 overflow-hidden"
            >
              <div
                className="rounded-3xl border-2 bg-white shadow-xl relative"
                style={{ borderColor: selected.color + '35' }}
              >
                {/* Header stripe */}
                <div
                  className="flex items-center gap-3 px-6 py-4 rounded-t-3xl"
                  style={{ background: `linear-gradient(135deg, ${selected.color}18, ${selected.color}08)` }}
                >
                  <span className="text-3xl">{selected.emoji}</span>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold" style={{ color: selected.color }}>
                      {BINS.find((b) => b.id === selected.id)?.name === selected.name
                        ? selected.id === 'carta'
                          ? 'Carta e Cartone'
                          : selected.id === 'multimateriale'
                          ? 'Multi-materiale'
                          : selected.id === 'indifferenziato'
                          ? 'Indifferenziato'
                          : selected.name
                        : selected.name}
                    </h2>
                    <p className="text-sm text-foreground/60 leading-snug mt-0.5">{selected.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* What goes here */}
                  <div
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: selected.color + '0a' }}
                  >
                    <h4
                      className="font-display font-bold text-sm uppercase tracking-wide mb-2.5"
                      style={{ color: selected.color }}
                    >
                      ✅ Cosa va qui
                    </h4>
                    <ul className="space-y-1.5">
                      {selected.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm text-foreground/70">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: selected.color }}
                          />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What does NOT go here */}
                  <div className="rounded-2xl p-4 bg-red-50/60">
                    <h4 className="font-display font-bold text-sm uppercase tracking-wide mb-2.5 text-red-600">
                      ❌ Cosa NON va qui
                    </h4>
                    <ul className="space-y-1.5">
                      {selected.notAllowed.map((na) => (
                        <li key={na} className="flex items-center gap-2 text-sm text-foreground/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {na}
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
          transition={{ delay: 0.4 }}
          className="mt-14 mb-8 text-center"
        >
          <p className="text-muted-foreground mb-4 font-medium">
            Hai imparato le regole? Metti alla prova le tue abilità! 🎮
          </p>
          <Link href="/gioca">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-display font-bold text-2xl overflow-hidden shadow-xl shadow-primary/25 transition-shadow hover:shadow-2xl hover:shadow-primary/40"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Sparkles className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Proviamo a riciclare!</span>
              <Gamepad2 className="w-7 h-7 relative z-10" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
