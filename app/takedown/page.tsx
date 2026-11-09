"use client";

import { useState } from "react";

export default function Takedown() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || message.trim().length < 5) return;
    try {
      await fetch("/api/takedown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      setSent(true);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-forest mb-6">Takedown Request</h1>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-lg font-medium text-ink block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-5 py-4 text-lg rounded-xl2 border-2 border-forest/20 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              placeholder="Tell us which line and why it should be removed"
            />
            <button
              type="submit"
              disabled={message.trim().length < 5}
              className="w-full py-5 px-6 bg-forest text-white rounded-xl2 font-medium shadow-soft active:scale-95 transition-all disabled:opacity-50"
            >
              Submit request
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-ink font-medium mb-4">Thank you. Your request has been received.</p>
            <a href="/">Return home</a>
          </div>
        )}
        <p className="mt-6 text-sm text-gray-500">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}