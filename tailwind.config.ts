import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        tan: {
          50: "#faf7f4",
          100: "#f5ede4",
          200: "#e8d8c8",
          300: "#d9bda3",
          400: "#c99065",
          500: "#b87a4f",
          600: "#a86944",
          700: "#8b5539",
          800: "#724633",
          900: "#5e3b2c",
        },
        beige: {
          50: "#faf9f7",
          100: "#f5f2ed",
          200: "#e8e0d4",
          300: "#d0bc9f",
          400: "#b89d7a",
          500: "#a0826d",
          600: "#8b6b47",
          700: "#735640",
          800: "#5f4635",
          900: "#4f3f35",
        },
        brown: {
          50: "#f6f4f1",
          100: "#e8e0d8",
          200: "#d4c4b5",
          300: "#b8a08a",
          400: "#a0826d",
          500: "#8b6b47",
          600: "#7a5a3d",
          700: "#654a33",
          800: "#543e2c",
          900: "#473528",
        },
      },
    },
  },
  plugins: [],
};

export default config;
