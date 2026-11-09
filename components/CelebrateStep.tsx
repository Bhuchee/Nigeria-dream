"use client";

import { useEffect } from "react";
import { t, Lang } from "@/lib/copy";

interface CelebrateStepProps {
  lang: Lang;
  line: string;
  compliment: string;
}

export default function CelebrateStep({ lang, line, compliment }: CelebrateStepProps) {
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    canvas.className = "fixed top-0 left-0 w-full h-full pointer-events-none z-50";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }> = [];
    const colors = ["#0A5C36", "#F6C453", "#F28C6B", "#FAF7F0"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.life -= 0.02;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 6, 6);
      }
      if (active) requestAnimationFrame(anim);
      else {
        canvas.className = "hidden";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(anim);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 safe-bottom bg-mint min-h-screen">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="inline-block p-6 bg-white/90 rounded-xl2 shadow-soft mb-8 border border-white/50">
          <p className="text-xl font-display font-bold text-forest leading-relaxed">{line}</p>
        </div>
        <p className="text-xl text-ink font-medium mb-10">{compliment}</p>
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