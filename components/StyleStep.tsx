"use client";

import { useEffect } from "react";
import { t, Lang } from "@/lib/copy";

interface StyleStepProps {
  lang: Lang;
  style: string;
  setStyle: (v: "green_white" | "sunrise" | "midnight" | "paper") => void;
  line: string;
  name: string;
  photoUrl: string | null;
  previewRef: React.RefObject<any>;
  canvasRef: React.RefObject<any>;
  drawCard: () => void | Promise<void>;
  cardImageUrl: string | null;
}

export default function StyleStep({
  lang, style, setStyle, line, name, photoUrl, previewRef, canvasRef,
  drawCard, cardImageUrl,
}: StyleStepProps) {
  useEffect(() => {
    drawCard();
  }, [drawCard, line, name, photoUrl, style]);

  const styles = [
    { id: "green_white", name: "Green & White", desc: "Deep green base, crisp white text", color: "#0A5C36" },
    { id: "sunrise", name: "Sunrise", desc: "Gold to sunset gradient, warm glow", color: "#F6C453" },
    { id: "midnight", name: "Midnight", desc: "Dark night with gold accents", color: "#0E1411" },
    { id: "paper", name: "Paper", desc: "Cream paper with green accent", color: "#FAF7F0" },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 safe-bottom bg-paper min-h-screen overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <h2 className="font-display text-xl font-bold text-center text-forest mb-6">
          Pick your style
        </h2>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id as "green_white" | "sunrise" | "midnight" | "paper")}
              className={`relative p-4 rounded-xl3 border-2 transition-all ${
                style === s.id
                  ? "border-gold bg-white shadow-soft"
                  : "border-transparent bg-white hover:border-forest/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0" style={{ backgroundColor: s.color }} />
                <div>
                  <div className="font-semibold text-ink">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="border-2 border-forest/20 rounded-xl3 p-6 bg-white shadow-soft relative overflow-hidden mb-8">
          <canvas ref={canvasRef} width={405} height={720} className="w-full h-auto rounded-xl2 mx-auto block" />
          <div className="text-center text-sm text-gray-500 mt-2">
            Card preview (1080 × 1920)
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full py-5 px-6 bg-forest text-white rounded-xl3 font-sans text-lg font-medium shadow-soft transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}