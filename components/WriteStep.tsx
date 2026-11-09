"use client";

import { t, Lang } from "@/lib/copy";

interface WriteStepProps {
  lang: Lang;
  line: string;
  setLine: (v: string) => void;
  promptText: string;
  goToCelebrate: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function WriteStep({
  lang, line, setLine, promptText, goToCelebrate, textAreaRef,
}: WriteStepProps) {
  const remaining = 120 - line.length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom bg-paper min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => {}}
          className="btn-text mb-6 text-gray-500 hover:bg-transparent"
        >
          ← Back
        </button>

        <h2 className="font-display text-2xl font-bold text-center text-forest mb-2">
          {t(lang, "headline")}
        </h2>
        <p className="text-lg text-center text-ink mb-6">{promptText}</p>

        <textarea
          ref={textAreaRef}
          value={line}
          onChange={(e) => setLine(e.target.value.slice(0, 150))}
          rows={4}
          className="w-full px-5 py-4 text-lg rounded-xl2 border-2 border-forest/20 bg-white shadow-chip focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          placeholder={t(lang, "prompt")}
        />

        <div className="mt-2 flex justify-between">
          <span className="text-sm text-gray-500">{line.length} / 150</span>
          <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {remaining} left
          </span>
        </div>

        <button
          onClick={goToCelebrate}
          disabled={line.trim().length < 10}
          className="w-full py-5 px-6 bg-forest text-white rounded-xl3 font-sans text-lg font-medium shadow-soft transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t(lang, "mainButton")}
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          {t(lang, "compliment")}
        </p>
      </div>
    </div>
  );
}