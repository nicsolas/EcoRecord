export type CategoryId = 'organico' | 'vetro' | 'carta' | 'multimateriale' | 'indifferenziato' | 'raee';

export interface TrashItem {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  categoryId: CategoryId;
}

export const CATEGORIES: Record<CategoryId, { id: CategoryId; name: string; color: string; binEmoji: string }> = {
  organico:       { id: 'organico',       name: 'Organico',        color: '#5a8a3c', binEmoji: '🟤' },
  vetro:          { id: 'vetro',          name: 'Vetro',           color: '#2d7a4a', binEmoji: '🟢' },
  carta:          { id: 'carta',          name: 'Carta',           color: '#2563eb', binEmoji: '🔵' },
  multimateriale: { id: 'multimateriale', name: 'Multi-materiale', color: '#d97706', binEmoji: '🟡' },
  indifferenziato:{ id: 'indifferenziato',name: 'Indifferenziato', color: '#6b7280', binEmoji: '⚫' },
  raee:           { id: 'raee',           name: 'RAEE',            color: '#7c3aed', binEmoji: '🔌' },
};

export const TRASH_ITEMS: TrashItem[] = [
  // --- ORGANICO (20) ---
  { id: 'o1',  name: 'Bucce di banana',       emoji: '🍌', image: 'banana_peel.png',      categoryId: 'organico' },
  { id: 'o2',  name: 'Torsolo di mela',        emoji: '🍎', image: 'apple_core.png',       categoryId: 'organico' },
  { id: 'o3',  name: 'Fondi di caffè',          emoji: '☕', image: 'coffee_grounds.png',   categoryId: 'organico' },
  { id: 'o4',  name: 'Gusci d\'uovo',           emoji: '🥚', image: 'egg_shells.png',       categoryId: 'organico' },
  { id: 'o5',  name: 'Scarti di carota',        emoji: '🥕', image: 'carrot_scraps.png',    categoryId: 'organico' },
  { id: 'o6',  name: 'Bucce di patata',         emoji: '🥔', image: 'potato_peel.png',      categoryId: 'organico' },
  { id: 'o7',  name: 'Pane raffermo',           emoji: '🍞', image: 'bread_leftovers.png',  categoryId: 'organico' },
  { id: 'o8',  name: 'Buccia d\'arancia',       emoji: '🍊', image: 'orange_peel.png',      categoryId: 'organico' },
  { id: 'o9',  name: 'Bustina del tè usata',    emoji: '🍵', image: 'tea_bag.png',          categoryId: 'organico' },
  { id: 'o10', name: 'Gusci di noce',           emoji: '🌰', image: 'nut_shells.png',       categoryId: 'organico' },
  { id: 'o11', name: 'Avanzi di pasta',         emoji: '🍝', image: 'pasta_leftovers.png',  categoryId: 'organico' },
  { id: 'o12', name: 'Buccia di pomodoro',      emoji: '🍅', image: 'tomato_scraps.png',    categoryId: 'organico' },
  { id: 'o13', name: 'Fiori appassiti',         emoji: '🌸', image: 'wilted_flowers.png',   categoryId: 'organico' },
  { id: 'o14', name: 'Foglie secche',           emoji: '🍂', image: 'dry_leaves.png',       categoryId: 'organico' },
  { id: 'o15', name: 'Noccioli di ciliegia',    emoji: '🍒', image: 'cherry_pits.png',      categoryId: 'organico' },
  { id: 'o16', name: 'Riso avanzato cotto',     emoji: '🍚', image: 'rice_leftovers.png',   categoryId: 'organico' },
  { id: 'o17', name: 'Buccia di kiwi',          emoji: '🥝', image: 'kiwi_peel.png',        categoryId: 'organico' },
  { id: 'o18', name: 'Scarti di verdura',       emoji: '🥦', image: 'vegetable_scraps.png', categoryId: 'organico' },
  { id: 'o19', name: 'Crosta di pizza',         emoji: '🍕', image: 'pizza_crust.png',      categoryId: 'organico' },
  { id: 'o20', name: 'Buccia di cipolla',       emoji: '🧅', image: 'onion_peel.png',       categoryId: 'organico' },

  // --- VETRO (20) ---
  { id: 'v1',  name: 'Bottiglia di vino',       emoji: '🍷', image: 'wine_bottle.png',         categoryId: 'vetro' },
  { id: 'v2',  name: 'Bottiglia di birra',      emoji: '🍺', image: 'beer_bottle.png',         categoryId: 'vetro' },
  { id: 'v3',  name: 'Barattolo di marmellata', emoji: '🫙', image: 'jam_jar.png',             categoryId: 'vetro' },
  { id: 'v4',  name: 'Bicchiere rotto',         emoji: '🥛', image: 'broken_glass.png',        categoryId: 'vetro' },
  { id: 'v5',  name: 'Bottiglia acqua in vetro',emoji: '💧', image: 'glass_water_bottle.png',  categoryId: 'vetro' },
  { id: 'v6',  name: 'Bottiglia d\'olio',       emoji: '🫒', image: 'oil_bottle.png',          categoryId: 'vetro' },
  { id: 'v7',  name: 'Barattolo di salsa',      emoji: '🍅', image: 'sauce_jar.png',           categoryId: 'vetro' },
  { id: 'v8',  name: 'Bottiglia di aceto',      emoji: '🍶', image: 'vinegar_bottle.png',      categoryId: 'vetro' },
  { id: 'v9',  name: 'Flacone di profumo',      emoji: '🌸', image: 'perfume_bottle.png',      categoryId: 'vetro' },
  { id: 'v10', name: 'Barattolo di olive',      emoji: '🫒', image: 'olive_jar.png',           categoryId: 'vetro' },
  { id: 'v11', name: 'Bottiglia di spumante',   emoji: '🥂', image: 'sparkling_bottle.png',    categoryId: 'vetro' },
  { id: 'v12', name: 'Barattolo di pesto',      emoji: '🌿', image: 'pesto_jar.png',           categoryId: 'vetro' },
  { id: 'v13', name: 'Bottiglia di grappa',     emoji: '🍸', image: 'grappa_bottle.png',       categoryId: 'vetro' },
  { id: 'v14', name: 'Barattolo di maionese',   emoji: '🥚', image: 'mayo_jar.png',            categoryId: 'vetro' },
  { id: 'v15', name: 'Bottiglia di liquore',    emoji: '🍹', image: 'liquor_bottle.png',       categoryId: 'vetro' },
  { id: 'v16', name: 'Flacone medicinale',      emoji: '💊', image: 'medicine_bottle.png',     categoryId: 'vetro' },
  { id: 'v17', name: 'Vaso di vetro',           emoji: '🏺', image: 'glass_jar.png',           categoryId: 'vetro' },
  { id: 'v18', name: 'Bottiglia di succo',      emoji: '🍊', image: 'juice_bottle_glass.png',  categoryId: 'vetro' },
  { id: 'v19', name: 'Barattolo di senape',     emoji: '🌭', image: 'mustard_jar.png',         categoryId: 'vetro' },
  { id: 'v20', name: 'Caraffa di vetro',        emoji: '🫗', image: 'glass_carafe.png',        categoryId: 'vetro' },

  // --- CARTA (20) ---
  { id: 'c1',  name: 'Giornale',               emoji: '📰', image: 'newspaper.png',            categoryId: 'carta' },
  { id: 'c2',  name: 'Scatola di cartone',     emoji: '📦', image: 'cardboard_box.png',        categoryId: 'carta' },
  { id: 'c3',  name: 'Rivista',                emoji: '🗞️', image: 'magazine.png',             categoryId: 'carta' },
  { id: 'c4',  name: 'Sacchetto di carta',     emoji: '🛍️', image: 'paper_bag.png',            categoryId: 'carta' },
  { id: 'c5',  name: 'Scatola pizza',          emoji: '🍕', image: 'pizza_box.png',            categoryId: 'carta' },
  { id: 'c6',  name: 'Cartone delle uova',     emoji: '🥚', image: 'egg_carton.png',           categoryId: 'carta' },
  { id: 'c7',  name: 'Rotolo carta igienica',  emoji: '🧻', image: 'paper_roll.png',           categoryId: 'carta' },
  { id: 'c8',  name: 'Libro vecchio',          emoji: '📚', image: 'old_book.png',             categoryId: 'carta' },
  { id: 'c9',  name: 'Busta da lettera',       emoji: '✉️', image: 'envelope.png',             categoryId: 'carta' },
  { id: 'c10', name: 'Carta da regalo',        emoji: '🎁', image: 'gift_paper.png',           categoryId: 'carta' },
  { id: 'c11', name: 'Tovagliolo di carta',    emoji: '🧻', image: 'paper_napkin.png',         categoryId: 'carta' },
  { id: 'c12', name: 'Scatola di cereali',     emoji: '🥣', image: 'cereal_box.png',           categoryId: 'carta' },
  { id: 'c13', name: 'Scatola di scarpe',      emoji: '👟', image: 'shoebox.png',              categoryId: 'carta' },
  { id: 'c14', name: 'Foglio di carta',        emoji: '📄', image: 'paper_sheet.png',          categoryId: 'carta' },
  { id: 'c15', name: 'Cartoncino',             emoji: '🗂️', image: 'cardboard.png',            categoryId: 'carta' },
  { id: 'c16', name: 'Calendario vecchio',     emoji: '📅', image: 'old_calendar.png',         categoryId: 'carta' },
  { id: 'c17', name: 'Scatola medicinale',     emoji: '💊', image: 'medicine_box.png',         categoryId: 'carta' },
  { id: 'c18', name: 'Bicchiere di carta',     emoji: '☕', image: 'paper_cup.png',            categoryId: 'carta' },
  { id: 'c19', name: 'Quaderno usato',         emoji: '📓', image: 'old_notebook.png',         categoryId: 'carta' },
  { id: 'c20', name: 'Imballaggio in cartone', emoji: '📫', image: 'cardboard_packaging.png',  categoryId: 'carta' },

  // --- MULTIMATERIALE (20) ---
  { id: 'm1',  name: 'Lattina di Coca-Cola',   emoji: '🥤', image: 'soda_can.png',             categoryId: 'multimateriale' },
  { id: 'm2',  name: 'Bottiglia di plastica',  emoji: '💧', image: 'plastic_bottle.png',       categoryId: 'multimateriale' },
  { id: 'm3',  name: 'Vasetto di yogurt',      emoji: '🍦', image: 'yogurt_cup.png',           categoryId: 'multimateriale' },
  { id: 'm4',  name: 'Sacchetto di plastica',  emoji: '🛍️', image: 'plastic_bag.png',          categoryId: 'multimateriale' },
  { id: 'm5',  name: 'Tetrapak del latte',     emoji: '🥛', image: 'milk_tetrapak.png',        categoryId: 'multimateriale' },
  { id: 'm6',  name: 'Lattina di birra',       emoji: '🍺', image: 'beer_can.png',             categoryId: 'multimateriale' },
  { id: 'm7',  name: 'Flacone di shampoo',     emoji: '🧴', image: 'shampoo_bottle.png',       categoryId: 'multimateriale' },
  { id: 'm8',  name: 'Contenitore plastica',   emoji: '📦', image: 'plastic_container.png',    categoryId: 'multimateriale' },
  { id: 'm9',  name: 'Piatto di plastica',     emoji: '🍽️', image: 'plastic_plate.png',        categoryId: 'multimateriale' },
  { id: 'm10', name: 'Forchetta di plastica',  emoji: '🍴', image: 'plastic_fork.png',         categoryId: 'multimateriale' },
  { id: 'm11', name: 'Lattina di tonno',       emoji: '🐟', image: 'tuna_can.png',             categoryId: 'multimateriale' },
  { id: 'm12', name: 'Flacone di detersivo',   emoji: '🧴', image: 'detergent_bottle.png',     categoryId: 'multimateriale' },
  { id: 'm13', name: 'Rete porta verdure',     emoji: '🥬', image: 'veggie_net.png',           categoryId: 'multimateriale' },
  { id: 'm14', name: 'Tappo di plastica',      emoji: '🔵', image: 'plastic_cap.png',          categoryId: 'multimateriale' },
  { id: 'm15', name: 'Cannuccia di plastica',  emoji: '🥤', image: 'plastic_straw.png',        categoryId: 'multimateriale' },
  { id: 'm16', name: 'Vaschetta del gelato',   emoji: '🍨', image: 'ice_cream_container.png',  categoryId: 'multimateriale' },
  { id: 'm17', name: 'Pellicola alimentare',   emoji: '📦', image: 'cling_wrap.png',           categoryId: 'multimateriale' },
  { id: 'm18', name: 'Tubetto di senape',      emoji: '🌭', image: 'mustard_squeeze.png',      categoryId: 'multimateriale' },
  { id: 'm19', name: 'Bottiglietta d\'acqua',  emoji: '💧', image: 'small_water_bottle.png',   categoryId: 'multimateriale' },
  { id: 'm20', name: 'Tetrapak di succo',      emoji: '🧃', image: 'juice_tetrapak.png',       categoryId: 'multimateriale' },

  // --- INDIFFERENZIATO (20) ---
  { id: 'i1',  name: 'Mozzicone di sigaretta', emoji: '🚬', image: 'cigarette_butt.png',      categoryId: 'indifferenziato' },
  { id: 'i2',  name: 'Pannolino usato',        emoji: '🧷', image: 'diaper.png',              categoryId: 'indifferenziato' },
  { id: 'i3',  name: 'Spazzolino da denti',    emoji: '🪥', image: 'toothbrush.png',          categoryId: 'indifferenziato' },
  { id: 'i4',  name: 'Gomma da masticare',     emoji: '🍬', image: 'chewing_gum.png',         categoryId: 'indifferenziato' },
  { id: 'i5',  name: 'Mascherina chirurgica',  emoji: '😷', image: 'face_mask.png',           categoryId: 'indifferenziato' },
  { id: 'i6',  name: 'Penna a sfera esaurita', emoji: '🖊️', image: 'empty_pen.png',           categoryId: 'indifferenziato' },
  { id: 'i7',  name: 'Accendino esaurito',     emoji: '🔥', image: 'lighter.png',             categoryId: 'indifferenziato' },
  { id: 'i8',  name: 'Cerotto usato',          emoji: '🩹', image: 'used_bandage.png',        categoryId: 'indifferenziato' },
  { id: 'i9',  name: 'Spugna da cucina',       emoji: '🧽', image: 'kitchen_sponge.png',      categoryId: 'indifferenziato' },
  { id: 'i10', name: 'Scontrino termico',      emoji: '🧾', image: 'thermal_receipt.png',     categoryId: 'indifferenziato' },
  { id: 'i11', name: 'Cotton fioc',            emoji: '🪥', image: 'cotton_swab.png',         categoryId: 'indifferenziato' },
  { id: 'i12', name: 'Rasoio usa e getta',     emoji: '🪒', image: 'razor_blade.png',         categoryId: 'indifferenziato' },
  { id: 'i13', name: 'Tazza in ceramica rotta',emoji: '☕', image: 'broken_ceramic.png',      categoryId: 'indifferenziato' },
  { id: 'i14', name: 'Carta da cucina unta',   emoji: '🍕', image: 'greasy_paper.png',        categoryId: 'indifferenziato' },
  { id: 'i15', name: 'Nastro adesivo',         emoji: '📎', image: 'tape.png',                categoryId: 'indifferenziato' },
  { id: 'i16', name: 'Cassetta VHS',           emoji: '📼', image: 'vhs_cassette.png',        categoryId: 'indifferenziato' },
  { id: 'i17', name: 'Gomma da cancellare',    emoji: '🔷', image: 'eraser.png',              categoryId: 'indifferenziato' },
  { id: 'i18', name: 'Calze di nylon rotte',   emoji: '🧦', image: 'torn_stockings.png',      categoryId: 'indifferenziato' },
  { id: 'i19', name: 'Tubetto di colla vuoto', emoji: '🔧', image: 'empty_glue.png',          categoryId: 'indifferenziato' },
  { id: 'i20', name: 'Assorbente igienico',    emoji: '🧷', image: 'adult_diaper.png',        categoryId: 'indifferenziato' },

  // --- RAEE (20) ---
  { id: 'r1',  name: 'Smartphone rotto',       emoji: '📱', image: 'broken_smartphone.png',   categoryId: 'raee' },
  { id: 'r2',  name: 'Batteria esaurita',      emoji: '🔋', image: 'dead_battery.png',        categoryId: 'raee' },
  { id: 'r3',  name: 'Caricabatterie rotto',   emoji: '🔌', image: 'broken_charger.png',      categoryId: 'raee' },
  { id: 'r4',  name: 'Lampadina LED',          emoji: '💡', image: 'led_bulb.png',            categoryId: 'raee' },
  { id: 'r5',  name: 'Lampadina fluorescente', emoji: '💡', image: 'fluorescent_bulb.png',    categoryId: 'raee' },
  { id: 'r6',  name: 'Telecomando rotto',      emoji: '📺', image: 'broken_remote.png',       categoryId: 'raee' },
  { id: 'r7',  name: 'Cuffie rotte',           emoji: '🎧', image: 'broken_headphones.png',   categoryId: 'raee' },
  { id: 'r8',  name: 'Tostapane rotto',        emoji: '🍞', image: 'broken_toaster.png',      categoryId: 'raee' },
  { id: 'r9',  name: 'Ferro da stiro rotto',   emoji: '👔', image: 'broken_iron.png',         categoryId: 'raee' },
  { id: 'r10', name: 'Calcolatrice rotta',     emoji: '🔢', image: 'broken_calculator.png',   categoryId: 'raee' },
  { id: 'r11', name: 'Sveglia rotta',          emoji: '⏰', image: 'broken_alarm.png',        categoryId: 'raee' },
  { id: 'r12', name: 'Tastiera rotta',         emoji: '⌨️', image: 'broken_keyboard.png',     categoryId: 'raee' },
  { id: 'r13', name: 'Mouse rotto',            emoji: '🖱️', image: 'broken_mouse.png',        categoryId: 'raee' },
  { id: 'r14', name: 'Tablet rotto',           emoji: '📱', image: 'broken_tablet.png',       categoryId: 'raee' },
  { id: 'r15', name: 'Cavo USB rotto',         emoji: '🔌', image: 'broken_usb_cable.png',    categoryId: 'raee' },
  { id: 'r16', name: 'Asciugacapelli rotto',   emoji: '💨', image: 'broken_hairdryer.png',    categoryId: 'raee' },
  { id: 'r17', name: 'Frullatore rotto',       emoji: '🥤', image: 'broken_blender.png',      categoryId: 'raee' },
  { id: 'r18', name: 'Pile stilo scariche',     emoji: '🔋', image: 'dead_aa_batteries.png',  categoryId: 'raee' },
  { id: 'r19', name: 'Disco CD/DVD',           emoji: '💿', image: 'cd_disc.png',             categoryId: 'raee' },
  { id: 'r20', name: 'Stampante rotta',        emoji: '🖨️', image: 'broken_printer.png',      categoryId: 'raee' },
];

export function shuffleAllItems(): TrashItem[] {
  // Group items by category and shuffle within each group
  const groups = new Map<CategoryId, TrashItem[]>();
  for (const item of TRASH_ITEMS) {
    if (!groups.has(item.categoryId)) groups.set(item.categoryId, []);
    groups.get(item.categoryId)!.push(item);
  }
  for (const [, items] of groups) {
    items.sort(() => Math.random() - 0.5);
  }

  // Build result ensuring no two consecutive items share the same category
  const queues = [...groups.entries()].map(([cat, items]) => ({ cat, items: [...items] }));
  const result: TrashItem[] = [];
  let lastCat: CategoryId | null = null;

  while (queues.some(q => q.items.length > 0)) {
    // Prefer queues that don't match the last category
    const available = queues.filter(q => q.items.length > 0 && q.cat !== lastCat);
    const pool = available.length > 0 ? available : queues.filter(q => q.items.length > 0);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    result.push(chosen.items.shift()!);
    lastCat = chosen.cat;
  }

  return result;
}
