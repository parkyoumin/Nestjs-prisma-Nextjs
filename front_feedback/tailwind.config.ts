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
    },
  },
  plugins: [],
};
export default config;
