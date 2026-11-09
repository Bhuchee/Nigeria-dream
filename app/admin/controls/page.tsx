"use client";

import { useEffect, useState } from "react";

export default function Controls() {
  const [settings, setSettings] = useState<any>({});
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]).then(([s, st]) => {
      setSettings(s.settings || {});
      setStats(st.stats || {});
    });
  }, []);

  const save = async (key: string, value: any) => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-forest mb-6">Controls</h1>

        <div className="bg-white rounded-xl2 p-4 shadow-soft mb-6">
          <h2 className="font-semibold text-ink mb-3">Kill switch</h2>
          <div className="flex items-center justify-between">
            <span className="text-lg text-ink">Wall enabled</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.wall_enabled !== false}
                onChange={(e) => save("wall_enabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl2 p-4 shadow-soft mb-6">
          <h2 className="font-semibold text-ink mb-3">NDC Mark</h2>
          <div className="flex items-center justify-between">
            <span className="text-lg text-ink">Show 'Gen Z NDC' mark on cards</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.show_ndc_mark === true}
                onChange={(e) => save("show_ndc_mark", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl2 p-4 shadow-soft mb-6">
          <h2 className="font-semibold text-ink mb-3">Hashtags</h2>
          <p className="text-sm text-gray-500 mb-2">{Array.isArray(settings.hashtags) ? settings.hashtags.join(" ") : String(settings.hashtags || "")}</p>
        </div>

        <div className="bg-white rounded-xl2 p-4 shadow-soft mb-6">
          <h2 className="font-semibold text-ink mb-3">Stats (today)</h2>
          <div className="grid grid-cols-2 gap-2">
            {[["Visits", stats.visits], ["Lines started", stats.lines_started], ["Cards created", stats.cards_created], ["Wall opt-ins", stats.wall_opt_ins], ["Reports", stats.reports], ["Pending", stats.pending_lines]].map(([label, val]) => (
              <div key={label} className="text-center p-2 bg-blush rounded-xl">
                <div className="font-display font-bold text-forest text-xl">{val}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 text-center">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}