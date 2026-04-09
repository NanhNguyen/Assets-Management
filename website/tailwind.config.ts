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
          DEFAULT: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
          container: "#E0E0FF",
          fixed: "#E1E0FF",
          "fixed-dim": "#C0C1FF",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          light: "#38BDF8",
          dark: "#0284C7",
          container: "#E0F2FE",
        },
        tertiary: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
          container: "#EDE9FE",
        },
        surface: {
          DEFAULT: "#F7F9FB",
          dim: "#D8DADC",
          bright: "#F7F9FB",
          container: "#ECEEF0",
          "container-high": "#E6E8EA",
          "container-highest": "#E0E3E5",
          "container-low": "#F2F4F6",
          "container-lowest": "#FFFFFF",
        },
        on: {
          surface: "#191C1E",
          "surface-variant": "#464554",
          primary: "#FFFFFF",
          secondary: "#FFFFFF",
          background: "#191C1E",
        },
        outline: {
          DEFAULT: "#767586",
          variant: "#C7C4D7",
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6",
        },
        background: "#F8FAFC",
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
        glow: "0 20px 40px rgba(99, 102, 241, 0.08)",
        "glow-lg": "0 20px 40px rgba(99, 102, 241, 0.15)",
        soft: "0 4px 20px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
