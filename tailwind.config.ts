import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1F4BFF",
          foreground: "#F5F7FF",
        },
        surface: {
          DEFAULT: "#0B1324",
          subtle: "#101C33",
          muted: "#17263F",
        },
        accent: "#00C4FF",
        success: "#34D399",
        danger: "#F87171",
        neutral: "#94A3B8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(31, 75, 255, 0.3)",
        card: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backgroundImage: {
        "grid-surface":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0.5px, transparent 0.5px), linear-gradient(45deg, rgba(255,255,255,0.04) 0.5px, transparent 0.5px)",
      },
      backgroundSize: {
        "grid-surface": "24px 24px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out forwards",
        "scale-in": "scale-in 160ms ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
