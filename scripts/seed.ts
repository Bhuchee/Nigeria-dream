import { sql } from "../lib/db";

const STARTER_LINES_EN = [
  "the light stays on all day, and nobody plans a week around fuel prices.",
  "a graduate gets a decent job in three months, not three years.",
  "I can walk home at night and my mother does not have to pray before I leave.",
  "a good idea matters more than who your uncle is.",
  "a trip to the village takes the time the map says it will.",
  "every child in every state has a school with a roof, a teacher and a book.",
  "a hospital visit does not end with a fundraising appeal.",
  "I can register a business without paying anyone to do it.",
  "Hausa, Igbo, Yoruba and Pidgin share one table and nobody counts who is who.",
  "staying is a choice people are proud of, not a backup plan.",
];

const STARTER_LINES_PCM = [
  "light dey stay, and I no go need generator before I fit work.",
  "pikin for any village fit read book under roof, with teacher.",
  "person go get job because of wetin e sabi, no be because of who e know.",
  "road good well, and trip to village go take the time e suppose take.",
  "hospital go treat person first before dem talk about money.",
  "my mama fit sleep well because she know say I dey safe for road.",
  "young person fit start business without wahala.",
  "e no go be shame to say I be Nigerian anywhere for world.",
];

const BLOCK_TERMS: { term: string; language: string; kind: string }[] = [
  // block_words
  { term: "idiot", language: "en", kind: "block_word" },
  { term: "stupid", language: "en", kind: "block_word" },
  { term: "fool", language: "en", kind: "block_word" },
  { term: "nonsense", language: "en", kind: "block_word" },
  { term: "rubbish", language: "en", kind: "block_word" },
  { term: "kill", language: "en", kind: "block_word" },
  { term: "bomb", language: "en", kind: "block_word" },
  { term: "attack", language: "en", kind: "block_word" },
  { term: "threat", language: "en", kind: "block_word" },
  { term: "hate", language: "en", kind: "block_word" },
  { term: "scam", language: "en", kind: "block_word" },
  { term: "fraud", language: "en", kind: "block_word" },
  { term: "steal", language: "en", kind: "block_word" },
  { term: "rob", language: "en", kind: "block_word" },
  // block_patterns
  { term: "\\b(shut up|drop dead|go to hell|suck it)\\b", language: "en", kind: "block_pattern" },
  // watch_terms - parties
  { term: "apc", language: "en", kind: "watch_term" },
  { term: "pdp", language: "en", kind: "watch_term" },
  { term: "lp", language: "en", kind: "watch_term" },
  { term: "labour party", language: "en", kind: "watch_term" },
  { term: "all progressives congress", language: "en", kind: "watch_term" },
  { term: "peoples democratic party", language: "en", kind: "watch_term" },
  { term: "pp", language: "en", kind: "watch_term" },
  { term: "sdp", language: "en", kind: "watch_term" },
  { term: "apga", language: "en", kind: "watch_term" },
  { term: "zlp", language: "en", kind: "watch_term" },
  { term: "adp", language: "en", kind: "watch_term" },
  // watch_terms - politicians
  { term: "tinubu", language: "en", kind: "watch_term" },
  { term: "atiku", language: "en", kind: "watch_term" },
  { term: "obi", language: "en", kind: "watch_term" },
  { term: "kwankwaso", language: "en", kind: "watch_term" },
  { term: "peter obi", language: "en", kind: "watch_term" },
  { term: "buhari", language: "en", kind: "watch_term" },
  { term: "jonathan", language: "en", kind: "watch_term" },
  // watch_terms - civic
  { term: "vote", language: "en", kind: "watch_term" },
  { term: "election", language: "en", kind: "watch_term" },
  { term: "campaign", language: "en", kind: "watch_term" },
  { term: "inec", language: "en", kind: "watch_term" },
];

async function main() {
  console.log("Seeding starter lines...");

  // Insert starter lines (idempotent: check by text)
  const starterLines: [string, string][] = [
    ...(STARTER_LINES_EN.map((t) => ["en", t] as [string, string])),
    ...(STARTER_LINES_PCM.map((t) => ["pcm", t] as [string, string])),
  ];

  for (const [lang, text] of starterLines) {
    const existing = await sql`
      SELECT id FROM lines WHERE text = ${text} AND is_starter = true
    `;
    if (existing.length === 0) {
      await sql`
        INSERT INTO lines (text, language, style, status, is_starter, device_hash)
        VALUES (${text}, ${lang}, 'green_white', 'approved', true, 'system_starter')
      `;
    }
  }
  console.log(`Seeded ${starterLines.length} starter lines.`);

  // Seed block terms (idempotent)
  console.log("Seeding blocked terms...");
  for (const { term, language, kind } of BLOCK_TERMS) {
    const existing = await sql`
      SELECT id FROM blocked_terms WHERE term = ${term} AND kind = ${kind}
    `;
    if (existing.length === 0) {
      await sql`
        INSERT INTO blocked_terms (term, language, kind)
        VALUES (${term}, ${language}, ${kind})
      `;
    }
  }
  console.log(`Seeded ${BLOCK_TERMS.length} blocked terms.`);

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});