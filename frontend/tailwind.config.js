/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        'ustp-blue': '#1a3a8f',
        'ustp-blue-dark': '#0f2460',
        'ustp-gold': '#f0b429',
        'ustp-gold-light': '#fff8e6',
        'g50': '#f8f9fb',
        'g100': '#f0f2f7',
        'g200': '#e2e6ef',
      }
    },
  },
  plugins: [],
}