"use client";

import { useEffect, useState, useCallback } from "react";
import { t, Lang, COPY } from "@/lib/copy";

export default function Wall() {
  const [lang, setLang] = useState<Lang>("en");
  const [lines, setLines] = useState<any[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(true);
  [lang];

  const loadMore = useCallback(async () => {
    if (loading || !more) return;
    setLoading(true);
    try {
      const url = cursor ? `/api/wall?cursor=${cursor}` : "/api/wall";
      const r = await fetch(url);
      const d = await r.json();
      setLines((prev) => [...prev, ...(d.lines || [])]);
      setCursor(d.next_cursor ? Number(d.next_cursor) : null);
      setMore(!!d.next_cursor);
    } catch {
      setMore(false);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, more]);

  useEffect(() => { loadMore(); }, [loadMore]);

  return (
    <div className="min-h-screen bg-blush p-4 safe-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-bold text-forest">The Wall</h1>
          <div className="flex gap-2">
            <button onClick={() => setLang("en")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${lang === "en" ? "bg-forest text-white" : "bg-white text-forest border border-forest/30"}`}>English</button>
            <button onClick={() => setLang("pcm")} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${lang === "pcm" ? "bg-forest text-white" : "bg-white text-forest border border-forest/30"}`}>Pidgin</button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-display font-bold text-forest text-lg">✨</span>
            <span className="text-lg font-medium text-ink">Nigerians have shared</span>
          </div>
        </div>

        <div className="grid gap-3">
          {lines.map((l) => (
            <div key={l.id} className="bg-white rounded-xl2 p-4 shadow-soft border border-forest/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">{t(lang, "prompt").slice(0, 30)}…</span>
                {l.is_starter && <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded">Starter dream</span>}
              </div>
              <p className="text-lg text-ink mb-2">{l.text}</p>
              {l.first_name && <p className="text-sm text-gray-600">— {l.first_name}</p>}
              <button className="text-xs text-red-500 mt-2 py-1 px-2 rounded hover:bg-red-50">Report</button>
            </div>
          ))}
          {loading && <div className="text-center py-4 text-gray-500">Loading…</div>}
          {more && lines.length > 0 && (
            <button onClick={loadMore} className="w-full py-3 px-6 bg-forest text-white rounded-xl text-sm font-medium mt-4">Load more</button>
          )}
        </div>

        <div className="mt-8">
          <a href="/" className="w-full py-5 px-6 bg-forest text-white rounded-xl2 text-center font-medium block shadow-soft active:scale-95 transition-all">
            Write yours →
          </a>
        </div>
      </div>
    </div>
  );
}