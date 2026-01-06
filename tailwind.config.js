// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["forest"], // выбери свои
    darkTheme: "forest", // тема по умолчанию для `dark` класса
    lightTheme: "forest",
    base: true, // применяет base стили
    styled: true,
    utils: true,
    prefix: "", // без префикса (daisy-)
    logs: true,
  },
}