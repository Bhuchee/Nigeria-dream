"use client";

import { t, Lang } from "@/lib/copy";

interface PersonaliseStepProps {
  lang: Lang;
  name: string;
  setName: (v: string) => void;
  photoUrl: string | null;
  setPhotoUrl: (v: string | null) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSkipPhoto: () => void;
  handleTakePhoto: () => void;
}

export default function PersonaliseStep({
  lang, name, setName, photoUrl, setPhotoUrl,
  handlePhotoChange, handleSkipPhoto, handleTakePhoto,
}: PersonaliseStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom bg-paper min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <h2 className="font-display text-2xl font-bold text-center text-forest mb-6">
          {t(lang, "nameAsk")}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="First name"
            className="w-full px-5 py-4 text-lg rounded-xl2 border-2 border-forest/20 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            maxLength={20}
          />

          <div className="flex gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-input"
            />
            <label htmlFor="photo-input" className="flex-1 py-4 bg-white border-2 border-forest/20 rounded-xl2 text-center text-forest font-medium cursor-pointer hover:bg-blush transition-colors">
              📷 Add photo
            </label>
            <button
              onClick={handleTakePhoto}
              className="py-4 bg-white border-2 border-forest/20 rounded-xl2 text-forest font-medium cursor-pointer hover:bg-blush transition-colors"
            >
              📸 Camera
            </button>
          </div>

          {photoUrl && (
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-forest"
              />
              <button
                onClick={() => setPhotoUrl(null)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          )}

          <button onClick={handleSkipPhoto} className="w-full py-4 px-6 text-forest text-sm font-medium hover:bg-blush rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold">
            {t(lang, "skip")}
          </button>
        </div>
      </div>
    </div>
  );
}