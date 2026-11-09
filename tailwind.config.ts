import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#0A5C36",
        "forest-deep": "#074327",
        gold: "#F6C453",
        sunset: "#F28C6B",
        blush: "#FDF1EC",
        mint: "#EAF6EF",
        ink: "#1F2A24",
        paper: "#FAF7F0",
        midnight: "#0E1411",
        "gold-deep": "#B8860B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      boxShadow: {
        soft: "0 4px 14px rgba(10,92,54,0.08), 0 12px 32px rgba(10,92,54,0.10)",
        chip: "0 2px 8px rgba(10,92,54,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
