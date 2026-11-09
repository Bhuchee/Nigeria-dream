"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { t, Lang } from "@/lib/copy";
import { drawCardToCanvas } from "@/lib/canvas";
import { processImageFile, captureFromCamera } from "@/lib/image";
import { buildCaption, recordEvent, submitLine as sl } from "@/lib/share";

const EX_EN = ["the light stays on all day, and nobody plans a week around fuel prices.","a graduate gets a decent job in three months, not three years.","a good idea matters more than who your uncle is."];
const EX_PCM = ["light dey stay, and I no go need generator before I fit work.","person go get job because of wetin e sabi, no be because of who e know.","road good well, and trip to village go take the time e suppose take."];

export function useCreationFlow() {
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState<"landing"|"write"|"celebrate"|"personalise"|"style"|"optin"|"share">("landing");
  const [line, setLine] = useState("");
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [style, setStyle] = useState<"green_white"|"sunrise"|"midnight"|"paper">("green_white");
  const [counter, setCounter] = useState(0);
  const [loadingCounter, setLoadingCounter] = useState(true);
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [shareCaption, setShareCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [optIn, setOptIn] = useState(true);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { const p = (new URLSearchParams(window.location.search).get("lang") || "en") as Lang; if (p === "en" || p === "pcm") setLang(p); }, []);

  useEffect(() => { let cancelled = false; (async () => { setLoadingCounter(true); try { const r = await fetch("/api/counter"); const d = await r.json(); if (!cancelled) setCounter(d.count || 0); } catch { if (!cancelled) setCounter(0); } finally { if (!cancelled) setLoadingCounter(false); } })(); return () => { cancelled = true; }; }, [lang]);

  useEffect(() => { if (loadingCounter) return; let s = displayCount, e = counter, d = e - s, st = performance.now(); const f = (now: number) => { const pr = Math.min((now - st) / 800, 1); const ease = 1 - Math.pow(1 - pr, 3); setDisplayCount(Math.floor(s + d * ease)); if (pr < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, [counter, loadingCounter, displayCount]);

  useEffect(() => { const tmr = setInterval(() => setExampleIndex((i) => (i + 1) % 3), 4000); return () => clearInterval(tmr); }, []);

  const ex = (lang === "en" ? EX_EN : EX_PCM)[exampleIndex];
  const prompt = t(lang, "prompt");

  const useExample = () => { setLine(ex); inputRef.current?.focus(); };
  const goWrite = () => setStep("write");
  const goCelebrate = () => { if (line.trim().length >= 10) setStep("celebrate"); };
  const skipPhoto = () => setStep("style");

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => { try { setPhotoUrl(await processImageFile(e.target.files![0])); } catch {} };
  const onCamera = async () => { try { setPhotoUrl(await captureFromCamera()); } catch {} };

  const drawCard = useCallback(async () => {
    await drawCardToCanvas(canvasRef.current!, { line, name, photoUrl, style, prompt, siteUrl: typeof window !== "undefined" ? window.location.origin : "" });
    setCardImageUrl(canvasRef.current!.toDataURL("image/png"));
  }, [line, name, photoUrl, style, prompt]);

  useEffect(() => { drawCard(); }, [drawCard]);

  useEffect(() => { setShareCaption(buildCaption(lang, prompt, line, typeof window !== "undefined" ? window.location.origin : "")); }, [line, lang, prompt]);

  const dl = () => { if (!cardImageUrl) return; const a = document.createElement("a"); a.download = "nigeria-dream-card.png"; a.href = cardImageUrl; a.click(); };

  const cp = async () => {
    try { await navigator.clipboard.writeText(shareCaption); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { const ta = document.createElement("textarea"); ta.value = shareCaption; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.focus(); ta.select(); try { document.execCommand("copy"); } catch {}; document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const shaWa = async () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareCaption)}`, "_blank"); recordEvent("share_whatsapp", lang, style); };
  const shaX = async () => { const su = typeof window !== "undefined" ? window.location.origin : ""; window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCaption)}&url=${encodeURIComponent(su)}`, "_blank"); recordEvent("share_x", lang, style); };
  const shaSheet = async () => { if (!cardImageUrl) return; try { const b = await (await fetch(cardImageUrl)).blob(); const f = new File([b], "nigeria-dream-card.png", { type: "image/png" }); if (navigator.share) await navigator.share({ files: [f], text: shareCaption }); recordEvent("share_sheet", lang, style); } catch {} };

  const submitLine = async () => { if (optIn) { await sl(line, name, lang, style); } else { await recordEvent("card_created", lang, style); } setStep("share"); };
  const skipOptIn = async () => { await recordEvent("card_created", lang, style); setStep("share"); };

  return { lang, setLang, step, setStep, line, setLine, name, setName, photoUrl, setPhotoUrl, style, setStyle, counter, loadingCounter, cardImageUrl, shareCaption, copied, optIn, setOptIn, exampleIndex, displayCount, inputRef, textAreaRef, canvasRef, useExample, goWrite, goCelebrate, skipPhoto, onPhoto, onCamera, drawCard, dl, cp, shaWa, shaX, shaSheet, submitLine, skipOptIn };
}