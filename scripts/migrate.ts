import { config } from "dotenv";
config({ path: ".env.local" });
import { sql } from "../lib/db";

async function main() {
  console.log("Running migrations...");
  await sql`CREATE TABLE IF NOT EXISTS lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL CHECK (char_length(text) BETWEEN 10 AND 150),
    first_name TEXT CHECK (first_name IS NULL OR char_length(first_name) <= 20),
    language TEXT NOT NULL CHECK (language IN ('en','pcm')),
    style TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','removed')),
    is_starter BOOLEAN NOT NULL DEFAULT false,
    flag_reason TEXT,
    device_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
  )`;
  await sql`CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_id UUID REFERENCES lines(id) ON DELETE CASCADE,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS takedown_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    language TEXT,
    style TEXT,
    device_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS blocked_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    language TEXT,
    kind TEXT NOT NULL CHECK (kind IN ('block_word','block_pattern','watch_term'))
  )`;
  await sql`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
  )`;
  console.log("Migrations complete.");

  const defaults: [string, any][] = [
    ["wall_enabled", true],
    ["show_ndc_mark", false],
    ["hashtags", ["#NigeriaOfMyDream", "#MyNaijaDream", "#GenZNDC"]],
    ["site_url", process.env.SITE_URL || ""],
    ["counter_offset", 0],
  ];

  for (const [key, value] of defaults) {
    await sql`
      INSERT INTO settings (key, value) VALUES (${key}, ${JSON.stringify(value)})
      ON CONFLICT (key) DO NOTHING
    `;
  }
  console.log("Default settings ensured.");

  try {
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  } catch (e) {
    console.log("pgcrypto extension not available (may already be enabled):", e);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});