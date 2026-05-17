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
        // Kebab-case (Standard Tailwind)
        'ustp-blue': '#1a3a8f',
        'ustp-blue-dark': '#0f2460',
        'ustp-blue-light': '#2a52cc',
        'ustp-gold': '#f0b429',
        'ustp-gold-dark': '#c8941f',
        'ustp-gold-light': '#fff8e6',
        
        // CamelCase (To catch your UI components)
        'ustpBlue': '#1a3a8f',
        'ustpDarkBlue': '#0f2460',
        'ustpGold': '#f0b429',
        
        // Background Grays
        'g50': '#f8f9fb',
        'g100': '#f0f2f7',
        'g200': '#e2e6ef',
      }
    },
  },
  plugins: [],
}