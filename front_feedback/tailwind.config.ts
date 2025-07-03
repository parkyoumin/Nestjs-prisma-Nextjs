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
        primary: "#BFD6ED",
        black: "#0F141A",
      },
      fontFamily: {
        sans: ["Noto Sans KR"],
      },
      keyframes: {
        "slide-in-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out-down": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
      },
      animation: {
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "slide-out-down": "slide-out-down 0.3s ease-in",
      },
    },
  },
  plugins: [],
};
export default config;
