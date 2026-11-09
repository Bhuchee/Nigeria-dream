import "server-only";
import { sql } from "./db.server";

const LOOK_ALIKE: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "@": "a",
  "$": "s", "7": "t", "8": "b", "9": "g", "!": "i", "|": "l",
};

export function normalizeText(text: string): string {
  let t = text.toLowerCase();
  // swap look-alikes
  t = t.replace(/[01345789@$!|]/g, (m) => LOOK_ALIKE[m] || m);
  // collapse repeated letters (more than 3 in a row)
  t = t.replace(/([a-z])\1{3,}/g, "$1$1$1");
  // strip spaces and symbols between letters
  t = t.replace(/[^a-z0-9]+/g, "");
  return t;
}

const DEFAULT_BLOCK_WORDS: string[] = [
  // English abuse/slurs/threats - starter set
  "idiot", "stupid", "fool", "nonsense", "rubbish", "rubbish",
  "kill", "bomb", "attack", "threat", "hate",
  "scam", "fraud", "steal", "rob",
];
const DEFAULT_BLOCK_PATTERNS: string[] = [
  // abusive patterns
  "\\b(shut up|drop dead|go to hell|suck it)\\b",
];
const DEFAULT_WATCH_TERMS: string[] = [
  // Nigeria political parties (all treated equally)
  "apc", "pdp", "lp", "labour party", "all progressives congress",
  "peoples democratic party", "pp", "sdp", "apga", "zlp", "adp",
  // well-known national politicians (surnames - draft, to be refined by native speaker)
  "tinubu", "atiku", "obi", "kwankwaso", "peter obi", "buhari",
  "jonathan", "abdulsalami", "abacha", "babangida",
  // civic terms
  "vote", "election", "campaign", "inec",
];

const NIGERIAN_STATES_CITIES: string[] = [
  "abia", "adamawa", "akwa ibom", "anambra", "bauchi", "bayelsa", "benue",
  "borno", "cross river", "delta", "ebonyi", "edo", "ekiti", "enugu",
  "fct", "gombe", "imo", "jigawa", "kaduna", "kano", "katsina", "kebbi",
  "kogi", "kwara", "lagos", "nasarawa", "niger", "ogun", "ondo", "osun",
  "oyo", "plateau", "rivers", "sokoto", "taraba", "yobe", "zamfara",
  "abuja", "lagos city", "kano city", "ibadan", "port harcourt", "benin city",
  "maiduguri", "zaria", "abakaliki", "abak", "abonnema", "ahoada",
];

export interface FilterResult {
  status: "approved" | "pending" | "rejected";
  reasons: string[];
}

export async function filterLine(
  text: string,
  language: string,
  deviceHash: string,
): Promise<FilterResult> {
  const normalized = normalizeText(text);
  const reasons: string[] = [];

  // Fetch block terms from DB
  const [blockTerms, watchTerms] = await Promise.all([
    sql`SELECT term, kind FROM blocked_terms WHERE kind IN ('block_word', 'block_pattern')`,
    sql`SELECT term FROM blocked_terms WHERE kind = 'watch_term'`,
  ]);

  // Check block words
  for (const row of blockTerms) {
    if (row.kind === "block_word") {
      if (normalized.includes(row.term.toLowerCase())) {
        reasons.push(`block_word:${row.term}`);
      }
    } else if (row.kind === "block_pattern") {
      try {
        const re = new RegExp(row.term, "i");
        if (re.test(text)) {
          reasons.push(`block_pattern:${row.term}`);
        }
      } catch {
        // ignore invalid regex
      }
    }
  }

  // Check for links, emails, handles, phone numbers
  const linkPattern = /(https?:\/\/|www\.)/i;
  const emailPattern = /\S+@\S+\.\S+/;
  const handlePattern = /@\w+/;
  const phonePattern = /(\+234|0)[\s\-]?[789][01][\s\-]?\d{3}[\s\-]?\d{4}/;

  if (linkPattern.test(text)) reasons.push("link");
  if (emailPattern.test(text)) reasons.push("email");
  if (handlePattern.test(text)) reasons.push("handle");
  if (phonePattern.test(text)) reasons.push("phone");

  if (reasons.length > 0) {
    return { status: "rejected", reasons };
  }

  // Check watch terms
  const allWatchTerms = [
    ...DEFAULT_WATCH_TERMS,
    ...watchTerms.map((r: any) => r.term),
  ];
  for (const term of allWatchTerms) {
    if (normalized.includes(term.toLowerCase())) {
      reasons.push(`watch_term:${term}`);
    }
  }

  // Check for capitalised personal names not in allow-list
  const nameWords = text.match(/\b[A-Z][a-z]+\b/g) || [];
  for (const word of nameWords) {
    const lower = word.toLowerCase();
    if (!NIGERIAN_STATES_CITIES.includes(lower)) {
      reasons.push(`name:${word}`);
    }
  }

  // Check for all-caps text
  if (text.length >= 5 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
    reasons.push("all_caps");
  }

  // Check for repeated characters (>4 same char)
  if (/(.)\1{4,}/.test(text)) {
    reasons.push("repeated_char");
  }

  // Check device history: 2+ rejected or removed lines in last 24h
  const recentRejected = await sql`
    SELECT COUNT(*) as cnt FROM lines
    WHERE device_hash = ${deviceHash}
    AND status IN ('rejected', 'removed')
    AND created_at > NOW() - INTERVAL '24 hours'
  `;
  if (Number(recentRejected[0].cnt) >= 2) {
    reasons.push("device_history");
  }

  if (reasons.length > 0) {
    return { status: "pending", reasons };
  }

  return { status: "approved", reasons: [] };
}