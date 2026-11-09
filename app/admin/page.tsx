"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (r.ok) {
        window.location.href = "/admin/review";
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="font-display text-2xl font-bold text-forest mb-6 text-center">Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-lg font-medium text-ink block">Passcode</label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-5 py-4 text-lg rounded-xl2 border-2 border-forest/20 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          {error && <p className="text-sm text-red-500 text-center">Invalid passcode</p>}
          <button
            type="submit"
            className="w-full py-5 px-6 bg-forest text-white rounded-xl2 font-medium shadow-soft active:scale-95 transition-all"
          >
            Enter
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-500 text-center">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}