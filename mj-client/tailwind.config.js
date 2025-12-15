/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
        // Các font đặc biệt
        offthewall: ['"Permanent Marker"', "cursive"],
        thriller: ['"Creepster"', "cursive"],
        bad: ['"Rock Salt"', "cursive"],
        dangerous: ['"Cinzel Decorative"', "serif"],
        history: ['"Playfair Display"', "serif"],
        invincible: ['"Orbitron"', "sans-serif"],
        xscape: ['"Kaushan Script"', "cursive"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
