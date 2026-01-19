/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'albert-black': ['"Albert Sans"', 'sans-serif'],
        'albert-bold': ['"Albert Sans"', 'sans-serif'],
        'albert-semibold': ['"Albert Sans"', 'sans-serif'],
        'albert-regular': ['"Albert Sans"', 'sans-serif'],
        'albert-light': ['"Albert Sans"', 'sans-serif'],
        'hanchanyuanyuan': ['"M PLUS Rounded 1c"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}