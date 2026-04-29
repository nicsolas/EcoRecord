// api/_lib/banned-words.ts

export const bannedWords = [
  // Italian (from LDNOOBW & additions)
  "allupato", "ammucchiata", "anale", "arrapato", "arrusa", "arruso", "assatanato", "bagascia", "bagassa",
  "bagnarsi", "baldracca", "balle", "battere", "battona", "belino", "biga", "bocchinara", "bocchino", "bocchini",
  "bofilo", "boiata", "bordello", "brinca", "bucaiolo", "budiulo", "busone", "cacca", "caciocappella",
  "cadavere", "cagare", "cagata", "cagna", "casci", "cazzata", "cazzimma", "cazzo", "cazzi", "cesso", "cazzone",
  "checca", "chiappa", "chiavare", "chiavata", "chiavate", "ciospo", "ciucciami", "coglione", "coglioni", "cornuto",
  "cozza", "culattina", "culattone", "culo", "culi", "ditalino", "fava", "femminuccia", "fica", "figa", "figone",
  "finocchio", "fottere", "fottersi", "fracicone", "fregna", "frocio", "froscio", "goldone", "guardone",
  "imbecille", "incazzarsi", "incoglionirsi", "ingoio", "leccaculo", "lecchino", "lofare", "loffa",
  "loffare", "merda", "merdata", "merdoso", "mignotta", "mignotte", "minchia", "minchie", "minchione", "mona", "monta",
  "montare", "mussa", "nerchia", "nerchie", "padulo", "palle", "palloso", "patacca", "patonza", "pecorina",
  "pesce", "picio", "pincare", "pippa", "pinnolone", "pipi", "pippone", "pirla", "pisciare", "piscio",
  "pisello", "pistolotto", "pomiciare", "pompa", "pompino", "pompini", "porca", "porco", "potta", "puppami",
  "puttana", "puttane", "quaglia", "recchione", "ricchione", "rincoglionire", "rizzarsi", "rompiballe", "rompipalle", "ruffiano",
  "sbattere", "sbattersi", "sborra", "sborrata", "sborrone", "sbrodolata", "sburro", "sburrare", "sburrata", "sburrato", "sburrone", "scopare", "scopata", "scopate",
  "scorreggiare", "sega", "seghe", "slinguare", "slinguata", "smandrappata", "soccia", "socmel", "sorca",
  "spagnola", "spompinare", "sticchio", "stronza", "stronzata", "stronzo", "succhiami", "succhione",
  "sveltina", "sverginare", "tarzanello", "terrone", "tette", "topa", "troia", "troie", "trombare", "vacca",
  "vaffanculo", "fanculo", "fottiti", "vangare", "zinne", "zoccola", "zoccole", "trump", "biden", "putin", "kushner", "netanyahu", "musk","Charlie kirk","roman","*"

  // Bestemmie e offese aggiuntive
  "porcodio", "dioporco", "porcamadonna", "madonnaputtana", "diocane", "canedio", "diomaiale", "mannaggia", "mortacci",
  "mignottone", "troiona", "zoccolona", "frocione", "succhiacazzi", "rompicazzo", "cagacazzo", "scassacazzo", "cacacazzo",
  "leccafregna", "leccamussa", "negro", "negra", "negri", "negre", "nazi", "nazista", "fascista", "duce", "hitler", "mussolini",
  "ritardato", "handicappato", "mongoloide", "spastico", "stronzetto", "stronzetta", "troietta", "puttanella",

  // English (common)
  "fuck", "shit", "piss", "cunt", "cocksucker", "motherfucker", "tits", "faggot", "nigger", "bastard",
  "asshole", "bitch", "dick", "pussy", "slut", "whore", "fucker", "dumbass", "jackass"
];

export function isBanned(text: string): boolean {
  // 1. Normalizza gli accenti (es. è -> e)
  let normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // 2. Converti leetspeak comune
  normalized = normalized
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/!/g, "i")
    .replace(/\+/g, "t");

  // 3. Rimuovi tutto ciò che non è una lettera dell'alfabeto (spazi, numeri rimasti, punteggiatura)
  // Così "67sburro67" diventa "sburro", "c.a.z.z.o." diventa "cazzo", ecc.
  normalized = normalized.replace(/[^a-z]/gi, "");

  // 4. Controlla se la stringa normalizzata contiene una qualsiasi delle parole bannate
  return bannedWords.some(word => normalized.includes(word));
}
