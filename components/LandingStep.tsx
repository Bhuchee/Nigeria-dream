"use client";

import { t, Lang } from "@/lib/copy";

interface LandingStepProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  line: string;
  setLine: (v: string) => void;
  counter: number;
  loadingCounter: boolean;
  promptText: string;
  currentExample: string;
  handleUseExample: () => void;
  goToWrite: () => void;
}

export default function LandingStep({
  lang, setLang, line, setLine, counter, loadingCounter,
  promptText, currentExample, handleUseExample, goToWrite,
}: LandingStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom bg-paper min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              lang === "en" ? "bg-forest text-white" : "bg-white text-forest border border-forest/30"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("pcm")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              lang === "pcm" ? "bg-forest text-white" : "bg-white text-forest border border-forest/30"
            }`}
          >
            Pidgin
          </button>
        </div>

        <h1 className="font-display text-4xl font-bold text-center text-forest mb-6 leading-tight">
          {t(lang, "headline")}
        </h1>

        <div className="mb-6">
          <p className="text-lg font-medium text-ink mb-3">{promptText}</p>
          <div className="relative">
            <input
              type="text"
              value={line}
              onChange={(e) => setLine(e.target.value.slice(0, 150))}
              className="w-full px-5 py-4 text-lg rounded-xl2 border-2 border-forest/20 bg-white shadow-chip focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              placeholder={t(lang, "prompt")}
            />
            <button
              onClick={handleUseExample}
              className="absolute right-3 top-3 px-3 py-1.5 bg-white text-forest border border-forest/20 rounded-full text-xs font-medium shadow-chip"
            >
              ✨ {currentExample.slice(0, 28)}…
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500 text-center">
            10 to 150 characters
          </p>
        </div>

        <button
          onClick={goToWrite}
          disabled={line.trim().length < 10}
          className="w-full py-5 px-6 bg-forest text-white rounded-xl3 font-sans text-lg font-medium shadow-soft transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t(lang, "mainButton")}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {loadingCounter ? t(lang, "loading") : t(lang, "counter", counter)}
          </p>
        </div>
      </div>
    </div>
  );
}