// api/_lib/banned-words.ts

export const bannedWords = [
  // Italian (from LDNOOBW)
  "allupato", "ammucchiata", "anale", "arrapato", "arrusa", "arruso", "assatanato", "bagascia", "bagassa",
  "bagnarsi", "baldracca", "balle", "battere", "battona", "belino", "biga", "bocchinara", "bocchino",
  "bofilo", "boiata", "bordello", "brinca", "bucaiolo", "budiùlo", "busone", "cacca", "caciocappella",
  "cadavere", "cagare", "cagata", "cagna", "casci", "cazzata", "cazzimma", "cazzo", "cesso", "cazzone",
  "checca", "chiappa", "chiavare", "chiavata", "ciospo", "ciucciami", "coglione", "coglioni", "cornuto",
  "cozza", "culattina", "culattone", "culo", "ditalino", "fava", "femminuccia", "fica", "figa", "figone",
  "finocchio", "fottere", "fottersi", "fracicone", "fregna", "frocio", "froscio", "goldone", "guardone",
  "imbecille", "incazzarsi", "incoglionirsi", "ingoio", "leccaculo", "lecchino", "lofare", "loffa",
  "loffare", "merda", "merdata", "merdoso", "mignotta", "minchia", "minchione", "mona", "monta",
  "montare", "mussa", "nerchia", "padulo", "palle", "palloso", "patacca", "patonza", "pecorina",
  "pesce", "picio", "pincare", "pippa", "pinnolone", "pipì", "pippone", "pirla", "pisciare", "piscio",
  "pisello", "pistolotto", "pomiciare", "pompa", "pompino", "porca", "porco", "potta", "puppami",
  "puttana", "quaglia", "recchione", "rincoglionire", "rizzarsi", "rompiballe", "rompipalle", "ruffiano",
  "sbattere", "sbattersi", "sborra", "sborrata", "sborrone", "sbrodolata", "scopare", "scopata",
  "scorreggiare", "sega", "slinguare", "slinguata", "smandrappata", "soccia", "socmel", "sorca",
  "spagnola", "spompinare", "sticchio", "stronza", "stronzata", "stronzo", "succhiami", "succhione",
  "sveltina", "sverginare", "tarzanello", "terrone", "tette", "topa", "troia", "trombare", "vacca",
  "vaffanculo", "vangare", "zinne", "zoccola", "trump", "biden", "putin", "kushner", "netanyahu", "musk",

  // English (common)
  "fuck", "shit", "piss", "cunt", "cocksucker", "motherfucker", "tits", "faggot", "nigger", "bastard",
  "asshole", "bitch", "dick", "pussy", "slut", "whore", "fucker", "dumbass", "jackass"
];

export function isBanned(text: string): boolean {
  const normalized = text.toLowerCase().replace(/\s+/g, "");
  return bannedWords.some(word => normalized.includes(word));
}
