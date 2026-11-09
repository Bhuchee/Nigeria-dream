export type Lang = "en" | "pcm";

type CopyValue = string | ((...args: any[]) => string);

export const COPY: Record<Lang, Record<string, CopyValue>> = {
  en: {
    headline: "What does your Nigeria look like?",
    prompt: "The Nigeria of my dream is a place where",
    mainButton: "Make my card",
    compliment: "That is a beautiful dream.",
    nameAsk: "Want your name on it?",
    skip: "Skip",
    optIn: "Add my line to the wall",
    optInNote: "Lines are reviewed before they appear.",
    shareNudge: "Send it to three people who would love this",
    counter: (n: number) => `${n} Nigerians have shared their dream`,
    copyCaption: "Copy caption and hashtags",
    copied: "Copied!",
    download: "Download card",
    wallButton: "Write yours",
    emailPrompt: "The Nigeria of my dream is a place where [line]. What is yours?",
    hashtags: "#NigeriaOfMyDream #MyNaijaDream #GenZNDC",
    loading: "Loading...",
    error: "Something went wrong. Please try again.",
    rateLimited: "You've shared a few times already. Please try again later.",
    wallDisabled: "The wall is taking a short break. Please check back soon.",
  },
  pcm: {
    headline: "Wetin your Naija dey look like?",
    prompt: "Di Naija wey I dey dream about na place wey",
    mainButton: "Make my card",
    compliment: "Na beautiful dream be that.",
    nameAsk: "You wan put your name for am?",
    skip: "Skip",
    optIn: "Put my line for di wall",
    optInNote: "Dem go check line before e show for wall.",
    shareNudge: "Send am to three people wey go love am",
    counter: (n: number) => `${n} Nigerians don share their dream`,
    copyCaption: "Copy caption and hashtags",
    copied: "E don copy!",
    download: "Download card",
    wallButton: "Write yours",
    emailPrompt: "Di Naija wey I dey dream about na place wey [line]. Wetin be your own?",
    hashtags: "#NigeriaOfMyDream #MyNaijaDream #GenZNDC",
    loading: "Loading...",
    error: "Something spoil. Try again.",
    rateLimited: "You don share plenty already. Try again later.",
    wallDisabled: "Di wall dey rest now. Come back later.",
  },
};

export function t(lang: Lang, key: string, ...args: any[]): string {
  const template = COPY[lang]?.[key] || COPY.en[key] || key;
  if (typeof template === "function") {
    return template(...args);
  }
  return template;
}