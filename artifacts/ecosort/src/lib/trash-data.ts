export type CategoryId = 'organico' | 'vetro' | 'carta' | 'multimateriale' | 'indifferenziato';

export interface TrashItem {
  id: string;
  name: string;
  emoji: string;
  categoryId: CategoryId;
}

export const CATEGORIES = {
  organico: { id: 'organico', name: 'Organico', colorClass: 'bg-bin-organico hover-bg-bin-organico' },
  vetro: { id: 'vetro', name: 'Vetro', colorClass: 'bg-bin-vetro hover-bg-bin-vetro' },
  carta: { id: 'carta', name: 'Carta', colorClass: 'bg-bin-carta hover-bg-bin-carta' },
  multimateriale: { id: 'multimateriale', name: 'Multimateriale', colorClass: 'bg-bin-multi hover-bg-bin-multi' },
  indifferenziato: { id: 'indifferenziato', name: 'Indifferenziato', colorClass: 'bg-bin-indiff hover-bg-bin-indiff' },
} as const;

export const TRASH_ITEMS: TrashItem[] = [
  // Organico
  { id: 'o1', name: 'Bucce di banana', emoji: '🍌', categoryId: 'organico' },
  { id: 'o2', name: 'Scarti di cibo', emoji: '🥕', categoryId: 'organico' },
  { id: 'o3', name: 'Fondi di caffè', emoji: '☕', categoryId: 'organico' },
  { id: 'o4', name: 'Gusci d\'uovo', emoji: '🥚', categoryId: 'organico' },
  { id: 'o5', name: 'Avanzi di mela', emoji: '🍎', categoryId: 'organico' },
  // Vetro
  { id: 'v1', name: 'Bottiglia di vino', emoji: '🍷', categoryId: 'vetro' },
  { id: 'v2', name: 'Vasetto di marmellata', emoji: '🫙', categoryId: 'vetro' },
  { id: 'v3', name: 'Bottiglia di birra', emoji: '🍺', categoryId: 'vetro' },
  { id: 'v4', name: 'Barattolo', emoji: '🏺', categoryId: 'vetro' },
  { id: 'v5', name: 'Bicchiere rotto', emoji: '🥛', categoryId: 'vetro' },
  // Carta
  { id: 'c1', name: 'Giornale', emoji: '📰', categoryId: 'carta' },
  { id: 'c2', name: 'Scatola di cartone', emoji: '📦', categoryId: 'carta' },
  { id: 'c3', name: 'Rivista', emoji: '🗞️', categoryId: 'carta' },
  { id: 'c4', name: 'Sacchetto di carta', emoji: '🛍️', categoryId: 'carta' },
  { id: 'c5', name: 'Quaderno usato', emoji: '📓', categoryId: 'carta' },
  // Multimateriale
  { id: 'm1', name: 'Lattina', emoji: '🥤', categoryId: 'multimateriale' },
  { id: 'm2', name: 'Bottiglia di plastica', emoji: '💧', categoryId: 'multimateriale' },
  { id: 'm3', name: 'Vasetto di yogurt', emoji: '🍦', categoryId: 'multimateriale' },
  { id: 'm4', name: 'Busta di plastica', emoji: '🛍️', categoryId: 'multimateriale' },
  { id: 'm5', name: 'Tetrapak', emoji: '🧃', categoryId: 'multimateriale' },
  // Indifferenziato
  { id: 'i1', name: 'Cicca di sigaretta', emoji: '🚬', categoryId: 'indifferenziato' },
  { id: 'i2', name: 'Pannolino', emoji: '🧷', categoryId: 'indifferenziato' },
  { id: 'i3', name: 'Spazzolino da denti', emoji: '🪥', categoryId: 'indifferenziato' },
  { id: 'i4', name: 'Gomma da masticare', emoji: '🍬', categoryId: 'indifferenziato' },
  { id: 'i5', name: 'Mascherina', emoji: '😷', categoryId: 'indifferenziato' },
];

export function getRandomItems(count: number): TrashItem[] {
  const shuffled = [...TRASH_ITEMS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
