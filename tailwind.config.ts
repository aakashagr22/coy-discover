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
        ink: "#211B29",
        "coy-pink": "#FF347D",
        "coy-lilac": "#E9E0FF",
        "coy-bg": "#FFFCFE",
        surface: "#fbf8fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f5",
        "surface-container": "#f0edef",
        "surface-container-high": "#eae7e9",
        "surface-container-highest": "#e4e2e4",
        "on-surface": "#1b1b1d",
        "on-surface-variant": "#5b3f45",
        primary: "#b70052",
        "primary-container": "#e11568",
        "on-primary-container": "#fffbff",
        "primary-fixed": "#ffd9df",
        "on-primary-fixed-variant": "#8f003f",
        secondary: "#615b75",
        "secondary-container": "#e7defd",
        "secondary-fixed": "#e7defd",
        "on-secondary-fixed": "#1d182e",
        outline: "#8f6f75",
        "outline-variant": "#e3bdc3",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        tactile: "3px 3px 0px #211B29",
        "tactile-sm": "2px 2px 0px #211B29",
        "tactile-lg": "4px 4px 0px #211B29",
        "tactile-active": "1px 1px 0px #211B29",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "margin-mobile": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
