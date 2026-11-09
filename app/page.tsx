"use client";

import { useCreationFlow } from "@/lib/useCreationFlow";
import LandingStep from "@/components/LandingStep";
import WriteStep from "@/components/WriteStep";
import CelebrateStep from "@/components/CelebrateStep";
import PersonaliseStep from "@/components/PersonaliseStep";
import StyleStep from "@/components/StyleStep";
import OptInStep from "@/components/OptInStep";
import ShareStep from "@/components/ShareStep";

export default function Home() {
  const {
    lang, setLang, step, line, setLine, counter, loadingCounter,
    photoUrl, setPhotoUrl, name, setName, style, setStyle,
    cardImageUrl, shareCaption, copied, optIn, setOptIn,
    exampleIndex, displayCount, inputRef, textAreaRef, canvasRef,
    useExample, goWrite, goCelebrate, skipPhoto, onPhoto, onCamera,
    drawCard, dl, cp, shaWa, shaX, shaSheet, submitLine, skipOptIn,
  } = useCreationFlow();

  const prompt = lang === "en"
    ? "The Nigeria of my dream is a place where"
    : "Di Naija wey I dey dream about na place wey";
  const ex = (lang === "en"
    ? ["the light stays on all day, and nobody plans a week around fuel prices.",
      "a graduate gets a decent job in three months, not three years.",
      "a good idea matters more than who your uncle is."]
    : ["light dey stay, and I no go need generator before I fit work.",
      "person go get job because of wetin e sabi, no be because of who e know.",
      "road good well, and trip to village go take the time e suppose take."])[exampleIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <canvas id="confetti-canvas" className="hidden" />
      {step === "landing" && <LandingStep lang={lang} setLang={setLang} line={line} setLine={setLine} counter={displayCount} loadingCounter={loadingCounter} promptText={prompt} currentExample={ex} handleUseExample={useExample} goToWrite={goWrite} />}
      {step === "write" && <WriteStep lang={lang} line={line} setLine={setLine} promptText={prompt} goToCelebrate={goCelebrate} textAreaRef={textAreaRef} />}
      {step === "celebrate" && <CelebrateStep lang={lang} line={line} compliment={lang === "en" ? "That is a beautiful dream." : "Na beautiful dream be that."} />}
      {step === "personalise" && <PersonaliseStep lang={lang} name={name} setName={setName} photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} handlePhotoChange={onPhoto} handleSkipPhoto={skipPhoto} handleTakePhoto={onCamera} />}
      {step === "style" && <StyleStep lang={lang} style={style} setStyle={setStyle} line={line} name={name} photoUrl={photoUrl} previewRef={textAreaRef} canvasRef={canvasRef} drawCard={drawCard} cardImageUrl={cardImageUrl} />}
      {step === "optin" && <OptInStep lang={lang} optIn={optIn} setOptIn={setOptIn} handleSubmitLine={submitLine} handleSkipOptIn={skipOptIn} />}
      {step === "share" && <ShareStep lang={lang} cardImageUrl={cardImageUrl} shareCaption={shareCaption} copied={copied} handleDownload={dl} handleCopy={cp} handleShareWhatsApp={shaWa} handleShareX={shaX} handleShareSheet={shaSheet} />}
    </div>
  );
}