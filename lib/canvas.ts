export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxLines?: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  const cur: string[] = [];
  for (const w of words) {
    const t = cur.length ? `${cur.join(" ")} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur.length) {
      lines.push(cur.join(" "));
      cur.length = 0;
      if (maxLines && lines.length >= maxLines) break;
    }
    cur.push(w);
  }
  if (cur.length && (!maxLines || lines.length < maxLines)) lines.push(cur.join(" "));
  return lines;
}

export function getFontSize(len: number): number {
  return Math.max(56, Math.min(96, 96 - ((len - 10) * 40) / 140));
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
    img.crossOrigin = "anonymous";
  });
}

export const STYLE_CONFIGS: Record<string, { bg: string; text: string }> = {
  green_white: { bg: "#0A5C36", text: "#FFFFFF" },
  sunrise: { bg: "linear-gradient(135deg, #F6C453 0%, #F28C6B 100%)", text: "#2B1B0E" },
  midnight: { bg: "#0E1411", text: "#F2C14E" },
  paper: { bg: "#FAF7F0", text: "#1F2A24" },
};

export async function drawCardToCanvas(
  canvas: HTMLCanvasElement,
  { line, name, photoUrl, style, prompt, siteUrl }: {
    line: string; name: string; photoUrl: string | null;
    style: string; prompt: string; siteUrl: string;
  }
) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1080;
  canvas.height = 1920;
  const cfg = STYLE_CONFIGS[style] || STYLE_CONFIGS.green_white;
  const isGrad = cfg.bg.startsWith("linear");

  if (isGrad) {
    const g = ctx.createLinearGradient(0, 0, 1080, 1920);
    g.addColorStop(0, "#F6C453"); g.addColorStop(1, "#F28C6B");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = cfg.bg;
  }
  ctx.fillRect(0, 0, 1080, 1920);

  if (style === "green_white") {
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 1072, 1912);
  }

  await document.fonts.ready;
  const fs = getFontSize(line.length);

  ctx.font = "bold 40px var(--font-fraunces)";
  ctx.fillStyle = cfg.text;
  ctx.textAlign = "center";
  let py = 250;
  for (const part of wrapText(ctx, prompt, 900)) {
    ctx.fillText(part, 540, py);
    py += 50;
  }

  py += 20;
  ctx.font = `bold ${fs}px var(--font-fraunces)`;
  for (const part of wrapText(ctx, line, 900, 7)) {
    if (py > 1580) break;
    ctx.fillText(part, 540, py);
    py += fs * 1.2;
  }

  if (photoUrl && name) {
    const img = await loadImage(photoUrl);
    const ps = 160, px = 540 - ps / 2, py2 = Math.min(py + 40, 1480);
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, py2 + ps / 2, ps / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, px, py2, ps, ps);
    ctx.restore();
    ctx.font = "bold 32px var(--font-dm-sans)";
    ctx.fillText(name, 540, py2 + ps + 40);
  } else if (name) {
    ctx.font = "bold 32px var(--font-dm-sans)";
    ctx.fillText(name, 540, Math.min(py + 40, 1520));
  }

  ctx.font = "20px var(--font-dm-sans)";
  ctx.fillText(siteUrl || "", 540, 1780);
}