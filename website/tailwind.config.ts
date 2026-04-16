import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1", // Indigo
          light: "#818CF8",
          dark: "#4F46E5",
          container: "#E0E7FF",
          fixed: "#6366F1",
          "fixed-dim": "#4F46E5",
        },
        secondary: {
          DEFAULT: "#0EA5E9", // Sky Blue
          light: "#38BDF8",
          dark: "#0284C7",
          container: "#E0F2FE",
        },
        tertiary: {
          DEFAULT: "#F59E0B", // Amber
          light: "#FBBF24",
          dark: "#D97706",
          container: "#FEF3C7",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          dim: "#E2E8F0",
          bright: "#FFFFFF",
          container: "#F1F5F9",
          "container-high": "#E2E8F0",
          "container-highest": "#CBD5E1",
          "container-low": "#F8FAFC",
          "container-lowest": "#FFFFFF",
        },
        on: {
          surface: "#0F172A",
          "surface-variant": "#475569",
          primary: "#FFFFFF",
          secondary: "#FFFFFF",
          background: "#0F172A",
        },
        outline: {
          DEFAULT: "#64748B",
          variant: "#CBD5E1",
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
        background: "#F1F5F9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 20px 40px rgba(99, 102, 241, 0.12)",
        "glow-lg": "0 30px 60px rgba(99, 102, 241, 0.25)",
        soft: "0 4px 30px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
