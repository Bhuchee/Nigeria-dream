"use client";

import { t, Lang } from "@/lib/copy";

interface ShareStepProps {
  lang: Lang;
  cardImageUrl: string | null;
  shareCaption: string;
  copied: boolean;
  handleDownload: () => void;
  handleCopy: () => void;
  handleShareWhatsApp: () => void;
  handleShareX: () => void;
  handleShareSheet: () => void;
}

export default function ShareStep({
  lang, cardImageUrl, shareCaption, copied, handleDownload,
  handleCopy, handleShareWhatsApp, handleShareX, handleShareSheet,
}: ShareStepProps) {
  return (
    <div className="flex-1 flex flex-col p-6 safe-bottom bg-mint min-h-screen overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        {cardImageUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={cardImageUrl}
              alt={shareCaption}
              className="w-full max-w-md rounded-xl3 shadow-soft block"
            />
          </div>
        )}

        <div className="space-y-3 mb-8">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-4 px-6 bg-[#25D366] text-white rounded-xl2 font-medium shadow-soft active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            📱 WhatsApp
          </button>
          <button
            onClick={handleShareX}
            className="w-full py-4 px-6 bg-[#1DA1F2] text-white rounded-xl2 font-medium shadow-soft active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            🐦 X (Twitter)
          </button>
          <button
            onClick={handleShareSheet}
            className="w-full py-4 px-6 bg-white text-forest border-2 border-forest/20 rounded-xl2 font-medium shadow-soft active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            📤 Share sheet
          </button>
          <button
            onClick={handleDownload}
            className="w-full py-4 px-6 bg-forest text-white rounded-xl2 font-medium shadow-soft active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            ⬇️ {t(lang, "download")}
          </button>
          <button
            onClick={handleCopy}
            className="w-full py-4 px-6 text-forest text-sm font-medium hover:bg-blush rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold flex items-center justify-center gap-2"
          >
            {copied ? t(lang, "copied") : t(lang, "copyCaption")}
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mb-8">
          For TikTok and Instagram: save the card, open the app, post it, then paste your caption.
        </p>

        <button
          onClick={() => {}}
          className="w-full py-4 px-6 text-forest text-sm font-medium hover:bg-blush rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {t(lang, "wallButton")}
        </button>
      </div>
    </div>
  );
}