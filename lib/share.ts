export function buildCaption(
  lang: string, prompt: string, line: string, siteUrl: string
): string {
  const hashtags = ["#NigeriaOfMyDream", "#MyNaijaDream", "#GenZNDC"].join(" ");
  return `${prompt} ${line}. ${lang === "pcm"
    ? "Wetin be your own?"
    : "What is yours?"} ${siteUrl} ${hashtags}`;
}

export async function deviceHash(): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(navigator.userAgent + "salt")
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function recordEvent(name: string, lang: string, style: string) {
  try {
    const dh = await deviceHash();
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, language: lang, style, device_hash: dh }),
    });
  } catch {}
}

export async function submitLine(
  text: string, firstName: string | null, lang: string, style: string
) {
  try {
    const dh = await deviceHash();
    await fetch("/api/lines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        first_name: firstName || null,
        language: lang,
        style,
        device_hash: dh,
      }),
    });
  } catch {}
}