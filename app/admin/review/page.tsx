"use client";

import { useEffect, useState } from "react";

export default function Review() {
  const [items, setItems] = useState<any[]>([]);
  const [waiting, setWaiting] = useState(0);
  const [longest, setLongest] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/queue?type=pending")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.lines || []);
        setWaiting(d.waiting || 0);
        setLongest(d.longest_wait || null);
      });
  }, []);

  const decide = async (id: string, decision: string) => {
    await fetch("/api/admin/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ line_id: id, decision }),
    });
    setItems(items.filter((i) => i.id !== id));
    setSelected(new Set());
  };

  const bulkDecide = async (decision: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    await fetch("/api/admin/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk_ids: ids, decision }),
    });
    setItems(items.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-forest mb-6">Review Queue</h1>
        <div className="mb-4">
          <p className="text-lg text-ink">{waiting} lines waiting</p>
          {longest && <p className="text-sm text-gray-600">Longest wait: {new Date(longest).toLocaleString()}</p>}
        </div>

        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.id} className="bg-white rounded-xl2 p-4 shadow-soft border border-forest/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-lg text-ink mb-1">{l.text}</p>
                  <p className="text-xs text-gray-500">{l.language} • {l.style} • {l.first_name || "Anonymous"}</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={() => setSelected(new Set(selected.has(l.id) ? [...selected].filter((x) => x !== l.id) : [...selected, l.id]))}
                    className="mt-1 accent-forest"
                  />
                  <button onClick={() => decide(l.id, "approved")} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">Approve</button>
                  <button onClick={() => decide(l.id, "rejected")} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100">Reject</button>
                  <button onClick={() => decide(l.id, "removed")} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded hover:bg-gray-100">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <button onClick={() => bulkDecide("approved")} className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium disabled:opacity-50" disabled={selected.size === 0}>
            Approve selected ({selected.size})
          </button>
          <button onClick={() => bulkDecide("rejected")} className="w-full py-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium disabled:opacity-50" disabled={selected.size === 0}>
            Reject selected ({selected.size})
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500 text-center">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}