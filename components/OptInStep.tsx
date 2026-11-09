"use client";

import { t, Lang } from "@/lib/copy";

interface OptInStepProps {
  lang: Lang;
  optIn: boolean;
  setOptIn: (v: boolean) => void;
  handleSubmitLine: () => void;
  handleSkipOptIn: () => void;
}

export default function OptInStep({
  lang, optIn, setOptIn, handleSubmitLine, handleSkipOptIn,
}: OptInStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom bg-paper min-h-screen">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex items-start justify-center gap-3 mb-8">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-forest rounded border-forest"
          />
          <div className="text-left">
            <p className="font-medium text-ink">{t(lang, "optIn")}</p>
            <p className="text-sm text-gray-500">{t(lang, "optInNote")}</p>
          </div>
        </div>

        <button
          onClick={handleSubmitLine}
          className="w-full py-5 px-6 bg-forest text-white rounded-xl3 font-sans text-lg font-medium shadow-soft transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 mb-4"
        >
          {t(lang, "mainButton")}
        </button>
        <button
          onClick={handleSkipOptIn}
          className="w-full py-4 px-6 text-forest text-sm font-medium hover:bg-blush rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {t(lang, "skip")}
        </button>
      </div>
    </div>
  );
}